"""The pipeline: tasks with dependencies, run in order, with retries and a log of every run.

Each task is a function of the run context. A task runs only after all the
tasks it depends on succeeded; a failure is retried, and a task that still
fails stops every task that depends on it. Every attempt is recorded in
ops.pipeline_runs, with Unix times, so a run can be audited afterwards.

Lesson 10: the run emits the three signals of observability.

    metrics  a telemetry.RunMetrics object (attempts, durations, rows, requests to
             the source, quality numbers, outcome, and tcg_run_info with the
             trace_id), pushed to a Pushgateway and written to out/metrics.prom;
    traces   a root span tcg_dataapp.run, one span per task, and the child spans
             of the requests to the source and of the SQL files;
    logs     one JSON line per event, carrying run_id, trace_id and span_id.

At the end of a successful run, the batches of db_ingestion are recorded in
ops.good_batches: the last known good state, which the controller of
control.py restores when a new batch breaks the quality gate.
"""
from __future__ import annotations

import time
import uuid
from dataclasses import dataclass, field
from typing import Callable

import duckdb
from opentelemetry.trace import Status, StatusCode

from tcg_dataapp.config import Settings
from tcg_dataapp.etls import extract
from tcg_dataapp.etls.tcgcsv import TcgcsvClient
from tcg_dataapp.observability import current_run_id, ids, logger, tracer
from tcg_dataapp.processors import gold, quality
from tcg_dataapp.telemetry import RunMetrics
from tcg_dataapp.views import report

LOG_DDL = """
CREATE SCHEMA IF NOT EXISTS ops;
CREATE TABLE IF NOT EXISTS ops.pipeline_runs (
    run_id     VARCHAR,
    task       VARCHAR,
    attempt    INTEGER,
    status     VARCHAR,
    started_at BIGINT,
    ended_at   BIGINT,
    detail     VARCHAR
);
CREATE TABLE IF NOT EXISTS ops.good_batches (
    data_tag    VARCHAR,
    timestamp   BIGINT,
    rows        BIGINT,
    digest      VARCHAR,
    run_id      VARCHAR,
    recorded_at BIGINT
);
"""

# One row per batch of db_ingestion, with a digest of its content: the same key
# (tag, timestamp) can be loaded again with other records.
BATCH_DIGEST = """
SELECT data_tag, timestamp, count(*) AS rows,
       md5(string_agg(data_json::VARCHAR, '|' ORDER BY data_json::VARCHAR)) AS digest
FROM db_ingestion GROUP BY 1, 2
"""


@dataclass
class Task:
    name: str
    run: Callable[["Context"], object]
    depends_on: tuple = ()
    retries: int | None = None


@dataclass
class Context:
    settings: Settings
    con: duckdb.DuckDBPyConnection
    client: TcgcsvClient
    run_id: str
    captured_at: int
    metrics: RunMetrics | None = None
    results: dict = field(default_factory=dict)
    trace_id: str = ""


def build_tasks(settings: Settings, with_today: bool = False) -> list[Task]:
    tasks = [
        Task("extract_sets", lambda c: extract.extract_sets(c.con, c.client, c.settings.sets, c.captured_at)),
        Task("extract_products", lambda c: extract.extract_products(c.con, c.client, c.settings.sets, c.captured_at),
             depends_on=("extract_sets",)),
    ]
    price_tasks = []
    for day in settings.price_dates:
        name = f"extract_prices_{day}"
        tasks.append(Task(name, lambda c, d=day: extract.extract_prices_archive(c.con, c.client, c.settings.sets, d),
                          depends_on=("extract_products",)))
        price_tasks.append(name)
    if with_today:
        tasks.append(Task("extract_prices_today",
                          lambda c: extract.extract_prices_today(c.con, c.client, c.settings.sets, extract.today()),
                          depends_on=("extract_products",)))
        price_tasks.append("extract_prices_today")
    tasks += [
        Task("build_gold", lambda c: gold.build_gold(c.con), depends_on=tuple(price_tasks), retries=0),
        Task("check_quality", lambda c: quality.check_gold(c.con), depends_on=("build_gold",), retries=0),
        Task("freeze_reports", lambda c: gold.freeze_month(c.con, c.settings.frozen_month),
             depends_on=("check_quality",), retries=0),
        Task("export_marts", lambda c: [p.as_posix() for p in report.export_marts(c.con, c.settings.out_dir)],
             depends_on=("check_quality",)),
        Task("write_report", lambda c: report.write_report(c.con, c.settings.out_dir, c.run_id).as_posix(),
             depends_on=("freeze_reports", "export_marts")),
    ]
    return tasks


def order(tasks: list[Task]) -> list[Task]:
    """Topological order of the tasks; raises on an unknown dependency or a cycle."""
    by_name = {t.name: t for t in tasks}
    for t in tasks:
        for d in t.depends_on:
            if d not in by_name:
                raise ValueError(f"task {t.name} depends on unknown task {d}")
    done, ordered, visiting = set(), [], set()

    def visit(t: Task):
        if t.name in done:
            return
        if t.name in visiting:
            raise ValueError(f"cycle at task {t.name}")
        visiting.add(t.name)
        for d in t.depends_on:
            visit(by_name[d])
        visiting.discard(t.name)
        done.add(t.name)
        ordered.append(t)

    for t in tasks:
        visit(t)
    return ordered


def _log(con, run_id, task, attempt, status, started, ended, detail):
    con.execute("INSERT INTO ops.pipeline_runs VALUES (?, ?, ?, ?, ?, ?, ?)",
                [run_id, task, attempt, status, started, ended, str(detail)[:500]]).fetchall()


def record_good_state(con, run_id: str) -> int:
    """Replace ops.good_batches with the batches present now; returns how many."""
    con.execute("DELETE FROM ops.good_batches").fetchall()
    con.execute(f"INSERT INTO ops.good_batches SELECT data_tag, timestamp, rows, digest, ?, ? FROM ({BATCH_DIGEST})",
                [run_id, extract.now_unix()]).fetchall()
    return con.execute("SELECT count(*) FROM ops.good_batches").fetchone()[0]


def _summary(result) -> str:
    return str(result)[:200]


def run(settings: Settings, tasks: list[Task] | None = None, client: TcgcsvClient | None = None,
        con: duckdb.DuckDBPyConnection | None = None, with_today: bool = False,
        echo: Callable[[str], None] = print, metrics: bool = True, trigger: str = "manual") -> Context:
    own = con is None
    if own:
        settings.db_path.parent.mkdir(parents=True, exist_ok=True)
        con = duckdb.connect(str(settings.db_path))
    for statement in con.extract_statements(LOG_DDL):
        con.execute(statement).fetchall()
    run_id = uuid.uuid4().hex[:12]
    token = current_run_id.set(run_id)
    log = logger()
    m = RunMetrics(run_id) if metrics else None
    source = client or TcgcsvClient(settings.base_url, settings.category)
    if settings.fault:
        from tcg_dataapp.faults import FaultyClient
        source = FaultyClient(source, settings.fault)
    ctx = Context(settings=settings, con=con, client=m.instrument(source) if m else source,
                  run_id=run_id, captured_at=extract.now_unix(), metrics=m)
    failed: set[str] = set()
    t_run = time.perf_counter()
    try:
        with tracer().start_as_current_span("tcg_dataapp.run") as root:
            root.set_attribute("tcg.run_id", run_id)
            root.set_attribute("tcg.trigger", trigger)
            root.set_attribute("tcg.sets", len(settings.sets))
            root.set_attribute("tcg.with_today", with_today)
            if settings.fault:
                root.set_attribute("tcg.fault", settings.fault)
            ctx.trace_id = ids()[0]
            log.info("run started", extra={"event": "run.start", "trigger": trigger, "fault": settings.fault})
            for task in order(tasks or build_tasks(settings, with_today)):
                _run_task(ctx, task, failed, echo)
            ctx.results["_failed"] = sorted(failed)
            if failed:
                root.set_status(Status(StatusCode.ERROR, f"failed: {', '.join(sorted(failed))}"))
            else:
                ctx.results["_good_batches"] = record_good_state(con, run_id)
            root.set_attribute("tcg.failed_tasks", len(failed))
            log.log(40 if failed else 20, "run finished", extra={
                "event": "run.end", "status": "failed" if failed else "ok", "failed_tasks": ",".join(sorted(failed)),
                "duration_s": round(time.perf_counter() - t_run, 3)})
    finally:
        if own:
            con.close()
        current_run_id.reset(token)
    if m:
        m.finish(ctx.results["_failed"], ctx.trace_id)
    return ctx


def _run_task(ctx: Context, task: Task, failed: set, echo) -> None:
    con, settings, m, log = ctx.con, ctx.settings, ctx.metrics, logger()
    with tracer().start_as_current_span(f"task {task.name}") as span:
        span.set_attribute("tcg.task", task.name)
        if any(d in failed for d in task.depends_on):
            failed.add(task.name)
            span.set_attribute("tcg.status", "skipped")
            span.set_status(Status(StatusCode.ERROR, "a dependency failed"))
            _log(con, ctx.run_id, task.name, 0, "skipped", extract.now_unix(), extract.now_unix(), "a dependency failed")
            log.warning("task skipped", extra={"event": "task.skip", "task": task.name})
            echo(f"  skip  {task.name}  (a dependency failed)")
            if m:
                m.attempt(task.name, "skipped")
            return
        attempts = 1 + (settings.retries if task.retries is None else task.retries)
        for attempt in range(1, attempts + 1):
            started = extract.now_unix()
            t0 = time.perf_counter()
            try:
                result = task.run(ctx)
            except Exception as error:  # noqa: BLE001 - every failure is logged and retried
                detail = f"{type(error).__name__}: {error}"
                _log(con, ctx.run_id, task.name, attempt, "failed", started, extract.now_unix(), detail)
                span.add_event("attempt failed", {"tcg.attempt": attempt, "exception.type": type(error).__name__,
                                                  "exception.message": str(error)[:300]})
                log.error("task attempt failed", extra={"event": "task.fail", "task": task.name, "attempt": attempt,
                                                        "attempts": attempts, "error": detail[:300]})
                if m:
                    m.attempt(task.name, "failed", time.perf_counter() - t0)
                echo(f"  fail  {task.name}  attempt {attempt}/{attempts}: {detail}")
                if attempt == attempts:
                    failed.add(task.name)
                    span.record_exception(error)
                    span.set_status(Status(StatusCode.ERROR, detail[:200]))
                    span.set_attribute("tcg.status", "failed")
                else:
                    time.sleep(settings.retry_delay * attempt)
                continue
            seconds = time.perf_counter() - t0
            ctx.results[task.name] = result
            _log(con, ctx.run_id, task.name, attempt, "success", started, extract.now_unix(), result)
            span.set_attribute("tcg.status", "success")
            span.set_attribute("tcg.attempts", attempt)
            span.set_attribute("tcg.result", _summary(result))
            log.info("task succeeded", extra={"event": "task.ok", "task": task.name, "attempt": attempt,
                                              "duration_s": round(seconds, 3), "result": _summary(result)})
            if m:
                m.attempt(task.name, "success", seconds, result)
            echo(f"  ok    {task.name}  {seconds:5.2f} s  {result}")
            return

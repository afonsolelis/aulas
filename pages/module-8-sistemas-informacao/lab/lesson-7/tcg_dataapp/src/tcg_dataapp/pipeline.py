"""The pipeline: tasks with dependencies, run in order, with retries and a log of every run.

Each task is a function of the run context. A task runs only after all the
tasks it depends on succeeded; a failure is retried, and a task that still
fails stops every task that depends on it. Every attempt is recorded in
ops.pipeline_runs, with Unix times, so a run can be audited afterwards.
"""
from __future__ import annotations

import time
import uuid
from dataclasses import dataclass, field
from typing import Callable

import duckdb

from tcg_dataapp.config import Settings
from tcg_dataapp.etls import extract
from tcg_dataapp.etls.tcgcsv import TcgcsvClient
from tcg_dataapp.processors import gold, quality
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
    results: dict = field(default_factory=dict)


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


def run(settings: Settings, tasks: list[Task] | None = None, client: TcgcsvClient | None = None,
        con: duckdb.DuckDBPyConnection | None = None, with_today: bool = False,
        echo: Callable[[str], None] = print) -> Context:
    own = con is None
    if own:
        settings.db_path.parent.mkdir(parents=True, exist_ok=True)
        con = duckdb.connect(str(settings.db_path))
    for statement in con.extract_statements(LOG_DDL):
        con.execute(statement).fetchall()
    ctx = Context(settings=settings, con=con,
                  client=client or TcgcsvClient(settings.base_url, settings.category),
                  run_id=uuid.uuid4().hex[:12], captured_at=extract.now_unix())
    failed: set[str] = set()
    try:
        for task in order(tasks or build_tasks(settings, with_today)):
            if any(d in failed for d in task.depends_on):
                failed.add(task.name)
                _log(con, ctx.run_id, task.name, 0, "skipped", extract.now_unix(), extract.now_unix(), "a dependency failed")
                echo(f"  skip  {task.name}  (a dependency failed)")
                continue
            attempts = 1 + (settings.retries if task.retries is None else task.retries)
            for attempt in range(1, attempts + 1):
                started = extract.now_unix()
                t0 = time.perf_counter()
                try:
                    result = task.run(ctx)
                except Exception as error:  # noqa: BLE001 - every failure is logged and retried
                    _log(con, ctx.run_id, task.name, attempt, "failed", started, extract.now_unix(),
                         f"{type(error).__name__}: {error}")
                    echo(f"  fail  {task.name}  attempt {attempt}/{attempts}: {type(error).__name__}: {error}")
                    if attempt == attempts:
                        failed.add(task.name)
                    else:
                        time.sleep(settings.retry_delay * attempt)
                    continue
                ctx.results[task.name] = result
                _log(con, ctx.run_id, task.name, attempt, "success", started, extract.now_unix(), result)
                echo(f"  ok    {task.name}  {time.perf_counter() - t0:5.2f} s  {result}")
                break
    finally:
        if own:
            con.close()
    ctx.results["_failed"] = sorted(failed)
    return ctx

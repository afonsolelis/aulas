"""The pipeline of Lesson 7 as a Prefect flow.

The hand-written runner of pipeline.py ordered the tasks, retried them and
logged them. Here Prefect does those three jobs: each step is a task, the
dependencies are the futures passed from one task to the next (or wait_for),
retries and their pauses are options of the task, and every state of every
run goes to the Prefect server, which shows them in its UI. The layers below
(etls, processors, views) are the same functions of Lesson 7.

Two rules decide the options of each task:

- a task that writes to the warehouse is never cached, because skipping it
  would skip the write; it is idempotent instead, so a retry or a rerun is safe;
- the download of a past day is cached by its inputs, because the archive of
  a past day never changes, so a rerun does not download it again.
"""
from __future__ import annotations

import datetime
from contextlib import contextmanager

import duckdb
from prefect import flow, get_run_logger, task
from prefect.cache_policies import INPUTS, NO_CACHE, TASK_SOURCE
from prefect.futures import wait
from prefect.runtime import flow_run

from tcg_dataapp.config import Settings
from tcg_dataapp.etls import extract
from tcg_dataapp.etls.landing import load_batch
from tcg_dataapp.etls.tcgcsv import TcgcsvClient
from tcg_dataapp.pipeline import LOG_DDL
from tcg_dataapp.processors import gold, quality
from tcg_dataapp.views import report


def make_client(settings: Settings) -> TcgcsvClient:
    """The source; the tests replace this function with a fake TCGplayer."""
    return TcgcsvClient(settings.base_url, settings.category)


@contextmanager
def warehouse(settings: Settings):
    """One connection per task: tasks run in threads, and a DuckDB connection must not be shared between them."""
    settings.db_path.parent.mkdir(parents=True, exist_ok=True)
    con = duckdb.connect(str(settings.db_path))
    try:
        yield con
    finally:
        con.close()


def _unix(moment: datetime.datetime | None) -> int | None:
    return int(moment.timestamp()) if moment else None


def log_state(tsk, task_run, state) -> None:
    """State hook: one row of ops.pipeline_runs per task run, as the runner of Lesson 7 wrote."""
    settings = Settings()
    with warehouse(settings) as con:
        for statement in con.extract_statements(LOG_DDL):
            con.execute(statement).fetchall()
        con.execute(
            "INSERT INTO ops.pipeline_runs VALUES (?, ?, ?, ?, ?, ?, ?)",
            [str(task_run.flow_run_id).replace("-", "")[:12], task_run.name if tsk.task_run_name else tsk.name,
             task_run.run_count, state.type.value.lower(), _unix(task_run.start_time),
             extract.now_unix(), (state.message or "")[:500]],
        ).fetchall()


def not_a_quality_error(tsk, task_run, state) -> bool:
    """Retry condition: a wrong model does not become right by running again."""
    try:
        state.result()
    except quality.QualityError:
        return False
    except Exception:  # noqa: BLE001 - any other failure (network, timeout) is worth a retry
        return True
    return True


WRITES = dict(cache_policy=NO_CACHE, on_completion=[log_state], on_failure=[log_state])


@task(name="extract_sets", retries=3, retry_delay_seconds=[2, 4, 8], **WRITES)
def extract_sets(settings: Settings, captured_at: int) -> int:
    with warehouse(settings) as con:
        return extract.extract_sets(con, make_client(settings), settings.sets, captured_at)


@task(name="extract_products", retries=3, retry_delay_seconds=[2, 4, 8], **WRITES)
def extract_products(settings: Settings, captured_at: int) -> int:
    with warehouse(settings) as con:
        return extract.extract_products(con, make_client(settings), settings.sets, captured_at)


@task(name="fetch_prices_archive", task_run_name="fetch_prices_{day}", retries=3, retry_delay_seconds=[2, 4, 8],
      cache_policy=INPUTS + TASK_SOURCE, persist_result=True)
def fetch_prices_archive(base_url: str, category: int, sets: tuple, day: str) -> list[dict]:
    """Download the archive of one past day and keep the prices of the sets; no write, so it can be cached."""
    client = make_client(Settings(base_url=base_url, category=category))
    by_set = client.prices_archive(day, list(sets))
    return [price for set_id in sets for price in by_set.get(set_id, [])]


@task(name="load_prices", task_run_name="load_prices_{day}", retries=3, retry_delay_seconds=[1, 2, 4], **WRITES)
def load_prices(settings: Settings, day: str, records: list[dict]) -> int:
    with warehouse(settings) as con:
        return load_batch(con, "tcgplayer.price.v1", extract.unix(day), records)


@task(name="extract_prices_today", retries=3, retry_delay_seconds=[2, 4, 8], **WRITES)
def extract_prices_today(settings: Settings) -> int:
    with warehouse(settings) as con:
        return extract.extract_prices_today(con, make_client(settings), settings.sets, extract.today())


@task(name="build_gold", **WRITES)
def build_gold(settings: Settings) -> str:
    with warehouse(settings) as con:
        return gold.build_gold(con)


@task(name="check_quality", retries=2, retry_condition_fn=not_a_quality_error, **WRITES)
def check_quality(settings: Settings) -> dict:
    with warehouse(settings) as con:
        return quality.check_gold(con)


@task(name="freeze_reports", **WRITES)
def freeze_reports(settings: Settings) -> dict:
    with warehouse(settings) as con:
        return gold.freeze_month(con, settings.frozen_month)


@task(name="export_marts", retries=2, retry_delay_seconds=1, **WRITES)
def export_marts(settings: Settings) -> list[str]:
    with warehouse(settings) as con:
        return [p.as_posix() for p in report.export_marts(con, settings.out_dir)]


@task(name="write_report", **WRITES)
def write_report(settings: Settings, run_id: str) -> str:
    with warehouse(settings) as con:
        return report.write_report(con, settings.out_dir, run_id).as_posix()


@flow(name="tcg-dataapp", log_prints=True)
def tcg_pipeline(with_today: bool = False) -> dict:
    """Extract, load, build the gold layer, check it, freeze the month and write the reports."""
    logger = get_run_logger()
    settings = Settings()
    run_id = (flow_run.id or "local").replace("-", "")[:12]
    captured_at = extract.now_unix()
    with warehouse(settings) as con:
        for statement in con.extract_statements(LOG_DDL):
            con.execute(statement).fetchall()
    logger.info("db %s · sets %d · dates %s", settings.db_path, len(settings.sets), ", ".join(settings.price_dates))

    # the network tasks take their retries from the settings, with a pause that doubles: 2, 4, 8 s by default
    net = dict(retries=settings.retries,
               retry_delay_seconds=[settings.retry_delay * 2 ** i for i in range(max(settings.retries, 1))])

    # the catalogue: products after sets, so a missing set stops the run before 1,490 products are loaded
    sets_f = extract_sets.with_options(**net).submit(settings, captured_at)
    products_f = extract_products.with_options(**net).submit(settings, captured_at, wait_for=[sets_f])

    # the prices: the downloads depend on nothing and start at once, in parallel; each load waits for its download
    loads = []
    for day in settings.price_dates:
        raw = fetch_prices_archive.with_options(**net).submit(
            settings.base_url, settings.category, settings.sets, day)
        loads.append(load_prices.submit(settings, day, raw))
    if with_today:
        loads.append(extract_prices_today.with_options(**net).submit(settings, wait_for=[products_f]))

    # the model: one chain, and the two outputs of the checks in parallel
    gold_f = build_gold.submit(settings, wait_for=[products_f, *loads])
    quality_f = check_quality.submit(settings, wait_for=[gold_f])
    freeze_f = freeze_reports.submit(settings, wait_for=[quality_f])
    marts_f = export_marts.submit(settings, wait_for=[quality_f])
    report_f = write_report.submit(settings, run_id, wait_for=[freeze_f, marts_f])

    futures = {"extract_sets": sets_f, "extract_products": products_f, "build_gold": gold_f,
               "check_quality": quality_f, "freeze_reports": freeze_f, "export_marts": marts_f,
               "write_report": report_f}
    futures.update({f"load_prices_{d}": f for d, f in zip(settings.price_dates, loads)})
    if with_today:
        futures["extract_prices_today"] = loads[-1]
    wait(list(futures.values()))

    results, failed = {}, []
    for name, future in futures.items():
        if future.state.is_completed():
            results[name] = future.result()
        else:
            failed.append(name)
    if failed:
        raise RuntimeError(f"run {run_id} failed: {', '.join(sorted(failed))}")
    logger.info("run %s: OK · %s", run_id, results["check_quality"])
    return results


def serve(cron: str = "0 6 * * *") -> None:
    """A deployment of the flow on a schedule; needs a Prefect server (prefect server start)."""
    tcg_pipeline.serve(name="daily", cron=cron, parameters={"with_today": True},
                       description="TCGplayer prices of the 2026 sets, every day at 06:00 UTC",
                       tags=["m8-si", "lesson-8"])

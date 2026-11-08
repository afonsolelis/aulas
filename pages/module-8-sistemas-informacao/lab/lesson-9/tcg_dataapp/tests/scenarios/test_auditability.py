"""Scenarios S08 and S09: what was published and what ran can be audited."""
import duckdb
import pytest

from tcg_dataapp import pipeline
from tcg_dataapp.etls import extract

from conftest import FakeClient


def quiet(_):
    pass


@pytest.mark.scenario("S08")
def test_s08_late_prices_of_a_frozen_month_do_not_change_it(settings):
    """TC08.1 late prices of a frozen month do not change it"""
    pipeline.run(settings, client=FakeClient(), echo=quiet)
    query = "SELECT * FROM report.mv_card_price_2026_08 ORDER BY ALL"
    con = duckdb.connect(str(settings.db_path))
    before = con.execute(query).fetchall()
    con.execute("INSERT INTO db_ingestion VALUES (?, '{\"productId\":11,\"marketPrice\":9.0,\"subTypeName\":\"Normal\"}', "
                "'tcgplayer.price.v1')", [extract.unix("2026-08-25")]).fetchall()
    con.close()
    ctx = pipeline.run(settings, client=FakeClient(), echo=quiet)
    assert ctx.results["freeze_reports"]["mv_card_price_2026_08"] == "kept"
    con = duckdb.connect(str(settings.db_path), read_only=True)
    assert con.execute(query).fetchall() == before
    live = con.execute("SELECT max(market_price) FROM mart_collectors.card_price WHERE card = 'Card A' AND month = '2026-08'").fetchone()[0]
    assert float(live) == 9.0


@pytest.mark.scenario("S09")
def test_s09_the_log_of_a_run_with_a_retry_is_complete(settings):
    """TC09.1 the log of a run with a retry is complete"""
    ctx = pipeline.run(settings, client=FakeClient(fail_times=1), echo=quiet)
    con = duckdb.connect(str(settings.db_path), read_only=True)
    rows = con.execute("SELECT task, attempt, status, started_at, ended_at, typeof(started_at), typeof(ended_at) "
                       "FROM ops.pipeline_runs WHERE run_id = ?", [ctx.run_id]).fetchall()
    tasks = [t.name for t in pipeline.build_tasks(settings)]
    assert sorted(t for t, _, s, *_ in rows if s == "success") == sorted(tasks)
    assert all(s in {"success", "failed", "skipped"} for _, _, s, *_ in rows)
    assert all(a <= b and ta == tb == "BIGINT" for *_, a, b, ta, tb in rows)
    assert len(rows) == len(tasks) + 1

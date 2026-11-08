import duckdb
import pytest

from tcg_dataapp import pipeline
from tcg_dataapp.pipeline import Task, order

from conftest import FakeClient


def test_order_respects_dependencies_and_rejects_cycles():
    tasks = [Task("c", None, ("b",)), Task("a", None), Task("b", None, ("a",))]
    assert [t.name for t in order(tasks)] == ["a", "b", "c"]
    with pytest.raises(ValueError, match="cycle"):
        order([Task("a", None, ("b",)), Task("b", None, ("a",))])
    with pytest.raises(ValueError, match="unknown"):
        order([Task("a", None, ("z",))])


def test_full_run_builds_gold_and_freezes_the_month(settings):
    ctx = pipeline.run(settings, client=FakeClient(), echo=lambda _: None)
    assert ctx.results["_failed"] == []
    quality = ctx.results["check_quality"]
    assert quality["fact_rows"] == quality["fact_grain_keys"] == 6
    assert quality["dates"] == 2
    assert ctx.results["freeze_reports"]["mv_card_price_2026_08"].startswith("created")
    assert (settings.out_dir / "report.md").exists()
    assert (settings.out_dir / "marts" / "card_price.parquet").exists()


def test_second_run_keeps_the_frozen_report_and_the_grain(settings):
    pipeline.run(settings, client=FakeClient(), echo=lambda _: None)
    ctx = pipeline.run(settings, client=FakeClient(), echo=lambda _: None)
    assert ctx.results["freeze_reports"]["mv_card_price_2026_08"] == "kept"
    assert ctx.results["check_quality"]["fact_rows"] == 6  # the catalogue twice, the dimensions once
    con = duckdb.connect(str(settings.db_path), read_only=True)
    frozen = con.execute("SELECT market_price FROM report.mv_card_price_2026_08 WHERE card = 'Card A'").fetchall()
    live = con.execute("SELECT market_price FROM report.v_card_price_latest WHERE card = 'Card A'").fetchall()
    assert [float(v) for (v,) in frozen] == [1.0] and [float(v) for (v,) in live] == [2.0]


def test_a_month_with_two_captures_freezes_only_the_last(settings):
    pipeline.run(settings, client=FakeClient(), echo=lambda _: None)
    con = duckdb.connect(str(settings.db_path))
    # a second capture in August, two weeks later, at a higher price
    con.execute("INSERT INTO db_ingestion VALUES (1786795200, '{\"productId\":11,\"marketPrice\":3.0,\"subTypeName\":\"Normal\"}', 'tcgplayer.price.v1')").fetchall()
    con.execute("DROP TABLE report.mv_card_price_2026_08").fetchall()
    con.close()
    ctx = pipeline.run(settings, client=FakeClient(), echo=lambda _: None)
    assert ctx.results["freeze_reports"]["mv_card_price_2026_08"].startswith("created")
    con = duckdb.connect(str(settings.db_path), read_only=True)
    rows = con.execute("SELECT market_price FROM report.mv_card_price_2026_08 WHERE card = 'Card A'").fetchall()
    assert [float(v) for (v,) in rows] == [3.0]


def test_a_failure_is_retried_and_logged(settings):
    ctx = pipeline.run(settings, client=FakeClient(fail_times=1), echo=lambda _: None)
    assert ctx.results["_failed"] == []
    con = duckdb.connect(str(settings.db_path), read_only=True)
    attempts = con.execute(
        "SELECT attempt, status FROM ops.pipeline_runs WHERE task = 'extract_sets' ORDER BY attempt").fetchall()
    assert attempts == [(1, "failed"), (2, "success")]


def test_a_task_that_keeps_failing_skips_its_dependents(settings):
    ctx = pipeline.run(settings, client=FakeClient(fail_times=5), echo=lambda _: None)
    assert "extract_sets" in ctx.results["_failed"]
    assert "write_report" in ctx.results["_failed"]
    assert "build_gold" not in ctx.results

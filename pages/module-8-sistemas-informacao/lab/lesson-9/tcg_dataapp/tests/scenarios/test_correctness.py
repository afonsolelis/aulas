"""Scenarios S01 to S05: correctness of the published numbers."""
import copy

import duckdb
import pytest

from tcg_dataapp import pipeline
from tcg_dataapp.etls import extract
from tcg_dataapp.processors import quality
from tcg_dataapp.processors.quality import QualityError

from conftest import PRICES, FakeClient


def quiet(_):
    pass


def fact(settings):
    con = duckdb.connect(str(settings.db_path), read_only=True)
    try:
        return con.execute("SELECT count(*), count(DISTINCT (date_unix, product_id, variant)), sum(market_price) "
                           "FROM gold.fact_price").fetchone()
    finally:
        con.close()


@pytest.mark.scenario("S01")
def test_s01_second_run_keeps_the_fact(settings):
    """TC01.1 second run of the archive dates keeps the fact"""
    pipeline.run(settings, client=FakeClient(), echo=quiet)
    first = fact(settings)
    pipeline.run(settings, client=FakeClient(), echo=quiet)
    assert fact(settings) == first
    assert first[0] == first[1] == 6


@pytest.mark.scenario("S01")
def test_s01_two_runs_today_keep_one_price_per_product(settings, monkeypatch):
    """TC01.2 two runs with the prices of today keep one price per product and day"""
    monkeypatch.setattr(extract, "today", lambda: "2026-09-15")
    pipeline.run(settings, client=FakeClient(), with_today=True, echo=quiet)
    first = fact(settings)
    pipeline.run(settings, client=FakeClient(), with_today=True, echo=quiet)
    assert fact(settings) == first == (10, 10, first[2])


@pytest.mark.scenario("S02")
def test_s02_broken_grain_stops_the_run_and_keeps_the_report(settings):
    """TC02.1 a broken grain stops the run and keeps the previous report"""
    pipeline.run(settings, client=FakeClient(), echo=quiet)
    before = (settings.out_dir / "report.md").read_bytes()
    con = duckdb.connect(str(settings.db_path))
    # a defective extractor loads the prices of 2026-09-01 again, one hour later
    con.execute("INSERT INTO db_ingestion SELECT timestamp + 3600, data_json, data_tag FROM db_ingestion "
                "WHERE data_tag = 'tcgplayer.price.v1' AND timestamp = ?", [extract.unix("2026-09-01")]).fetchall()
    con.close()
    ctx = pipeline.run(settings, client=FakeClient(), echo=quiet)
    assert {"check_quality", "freeze_reports", "export_marts", "write_report"} <= set(ctx.results["_failed"])
    assert (settings.out_dir / "report.md").read_bytes() == before


@pytest.mark.scenario("S02")
def test_s02_the_quality_gate_is_attempted_once(settings):
    """TC02.2 the quality gate is attempted once"""
    pipeline.run(settings, client=FakeClient(), echo=quiet)
    con = duckdb.connect(str(settings.db_path))
    con.execute("INSERT INTO db_ingestion SELECT timestamp + 3600, data_json, data_tag FROM db_ingestion "
                "WHERE data_tag = 'tcgplayer.price.v1'").fetchall()
    con.close()
    ctx = pipeline.run(settings, client=FakeClient(), echo=quiet)
    con = duckdb.connect(str(settings.db_path), read_only=True)
    attempts = con.execute("SELECT count(*) FROM ops.pipeline_runs WHERE run_id = ? AND task = 'check_quality'",
                           [ctx.run_id]).fetchone()[0]
    assert attempts == 1


def with_orphan():
    prices = copy.deepcopy(PRICES)
    prices["2026-09-01"][1].append({"productId": 14, "marketPrice": 3.0, "subTypeName": "Normal"})
    return prices


@pytest.mark.scenario("S03")
def test_s03_prices_without_product_are_counted(settings):
    """TC03.1 prices without product are counted"""
    pipeline.run(settings, client=FakeClient(prices=with_orphan()), echo=quiet)
    con = duckdb.connect(str(settings.db_path), read_only=True)
    measured = quality.check_gold(con, max_dropped_share=0.5)
    assert measured["prices_not_in_fact"] == 1


@pytest.mark.scenario("S03")
def test_s03_above_one_percent_the_run_stops(settings):
    """TC03.2 above 1 % of a capture the run stops"""
    ctx = pipeline.run(settings, client=FakeClient(prices=with_orphan()), echo=quiet)
    assert "check_quality" in ctx.results["_failed"]
    assert not (settings.out_dir / "report.md").exists()


@pytest.mark.scenario("S04")
def test_s04_renamed_price_field_stops_the_run(settings):
    """TC04.1 a renamed price field stops the run"""
    prices = copy.deepcopy(PRICES)
    for rows in prices["2026-09-01"].values():
        for r in rows:
            r["market_price"] = r.pop("marketPrice")
    ctx = pipeline.run(settings, client=FakeClient(prices=prices), echo=quiet)
    assert "check_quality" in ctx.results["_failed"]
    con = duckdb.connect(str(settings.db_path), read_only=True)
    detail = con.execute("SELECT detail FROM ops.pipeline_runs WHERE task = 'check_quality'").fetchone()[0]
    assert "null market price" in detail


@pytest.mark.scenario("S04")
def test_s04_new_field_changes_nothing(settings, tmp_path):
    """TC04.2 a new field changes nothing"""
    pipeline.run(settings, client=FakeClient(), echo=quiet)
    baseline = fact(settings)
    prices = copy.deepcopy(PRICES)
    for day in prices.values():
        for rows in day.values():
            for r in rows:
                r["directLowPrice"] = 0.01
    other = type(settings)(**{**settings.__dict__, "db_path": tmp_path / "drift.duckdb", "out_dir": tmp_path / "drift"})
    ctx = pipeline.run(other, client=FakeClient(prices=prices), echo=quiet)
    assert ctx.results["_failed"] == []
    assert fact(other) == baseline


@pytest.mark.scenario("S05")
def test_s05_two_captures_of_a_month_freeze_only_the_last(settings):
    """TC05.1 two captures of a month freeze only the last"""
    later = dict(settings.__dict__)
    prices = copy.deepcopy(PRICES)
    prices["2026-08-20"] = {1: [{"productId": 11, "marketPrice": 3.0, "subTypeName": "Normal"},
                                {"productId": 12, "marketPrice": 12.0, "subTypeName": "Holofoil"}]}
    later["price_dates"] = ("2026-08-01", "2026-08-20", "2026-09-01")
    s = type(settings)(**later)
    ctx = pipeline.run(s, client=FakeClient(prices=prices), echo=quiet)
    assert ctx.results["_failed"] == []
    con = duckdb.connect(str(s.db_path), read_only=True)
    rows = con.execute("SELECT card, market_price FROM report.mv_card_price_2026_08 ORDER BY card").fetchall()
    assert [(c, float(p)) for c, p in rows] == [("Card A", 3.0), ("Card B", 12.0)]

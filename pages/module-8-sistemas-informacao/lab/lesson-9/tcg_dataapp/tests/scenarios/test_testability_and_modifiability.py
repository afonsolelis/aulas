"""Scenarios S13 and S14: the suite runs offline, and the run follows its configuration."""
import urllib.request

import duckdb
import pytest

from tcg_dataapp import pipeline
from tcg_dataapp.config import Settings

from conftest import FakeClient


@pytest.mark.scenario("S13")
def test_s13_the_suite_cannot_open_a_connection():
    """TC13.1 the suite cannot open a connection"""
    with pytest.raises(Exception, match="network blocked"):
        urllib.request.urlopen("https://tcgcsv.com/tcgplayer/3/groups", timeout=2)


@pytest.mark.scenario("S14")
def test_s14_sets_and_dates_come_from_the_environment(tmp_path, monkeypatch):
    """TC14.1 TCG_SETS and TCG_PRICE_DATES drive the run"""
    monkeypatch.setenv("TCG_SETS", "1")
    monkeypatch.setenv("TCG_PRICE_DATES", "2026-09-01")
    monkeypatch.setenv("TCG_DB_PATH", str(tmp_path / "tcg.duckdb"))
    monkeypatch.setenv("TCG_OUT_DIR", str(tmp_path / "out"))
    monkeypatch.setenv("TCG_FROZEN_MONTH", "2026-09")
    s = Settings()
    assert s.sets == (1,) and s.price_dates == ("2026-09-01",)
    ctx = pipeline.run(s, client=FakeClient(), echo=lambda _: None)
    assert ctx.results["_failed"] == []
    con = duckdb.connect(str(s.db_path), read_only=True)
    assert con.execute("SELECT set_id FROM gold.dim_set").fetchall() == [(1,)]

"""Scenario S11: data that stopped arriving is detected."""
import pytest

from tcg_dataapp import cli, pipeline
from tcg_dataapp.etls import extract

from conftest import FakeClient


@pytest.fixture
def warehouse(settings, monkeypatch):
    pipeline.run(settings, client=FakeClient(), echo=lambda _: None)
    monkeypatch.setenv("TCG_DB_PATH", str(settings.db_path))
    return settings


@pytest.mark.scenario("S11")
def test_s11_fresh_data_passes(warehouse, monkeypatch, capsys):
    """TC11.1 fresh data passes"""
    monkeypatch.setattr(extract, "now_unix", lambda: extract.unix("2026-09-02"))
    assert cli.main(["freshness", "--max-age-days", "2"]) == 0
    assert "1.0 days" in capsys.readouterr().out


@pytest.mark.scenario("S11")
def test_s11_data_older_than_two_days_fails(warehouse, monkeypatch, capsys):
    """TC11.2 data older than 2 days fails the check"""
    monkeypatch.setattr(extract, "now_unix", lambda: extract.unix("2026-09-04"))
    assert cli.main(["freshness", "--max-age-days", "2"]) == 1
    assert "stale" in capsys.readouterr().out

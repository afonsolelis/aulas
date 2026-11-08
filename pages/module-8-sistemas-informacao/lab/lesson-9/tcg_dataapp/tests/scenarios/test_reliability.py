"""Scenarios S06 and S07: reliability against a source without a service level."""
import duckdb
import pytest

from tcg_dataapp import cli, pipeline

from conftest import FakeClient


def quiet(_):
    pass


def landing_rows(settings):
    con = duckdb.connect(str(settings.db_path), read_only=True)
    try:
        return con.execute("SELECT count(*) FROM db_ingestion").fetchone()[0]
    finally:
        con.close()


@pytest.mark.scenario("S06")
def test_s06_one_failure_is_absorbed_by_a_retry(settings, tmp_path):
    """TC06.1 one failure is absorbed by a retry"""
    ctx = pipeline.run(settings, client=FakeClient(fail_times=1), echo=quiet)
    assert ctx.results["_failed"] == []
    con = duckdb.connect(str(settings.db_path), read_only=True)
    log = con.execute("SELECT attempt, status FROM ops.pipeline_runs WHERE task = 'extract_sets' ORDER BY attempt").fetchall()
    con.close()
    assert log == [(1, "failed"), (2, "success")]
    clean = type(settings)(**{**settings.__dict__, "db_path": tmp_path / "clean.duckdb"})
    pipeline.run(clean, client=FakeClient(), echo=quiet)
    assert landing_rows(settings) == landing_rows(clean)


@pytest.mark.scenario("S07")
def test_s07_source_down_publishes_nothing(settings):
    """TC07.1 the run fails and publishes nothing"""
    pipeline.run(settings, client=FakeClient(), echo=quiet)
    report = (settings.out_dir / "report.md").read_bytes()
    marts = {p.name: p.read_bytes() for p in (settings.out_dir / "marts").iterdir()}
    rows = landing_rows(settings)
    ctx = pipeline.run(settings, client=FakeClient(fail_times=99), echo=quiet)
    assert "extract_sets" in ctx.results["_failed"] and "write_report" in ctx.results["_failed"]
    assert landing_rows(settings) == rows
    assert (settings.out_dir / "report.md").read_bytes() == report
    assert {p.name: p.read_bytes() for p in (settings.out_dir / "marts").iterdir()} == marts


@pytest.mark.scenario("S07")
def test_s07_the_command_returns_exit_code_1(tmp_path, monkeypatch, capsys):
    """TC07.2 the command returns exit code 1"""
    monkeypatch.setenv("TCG_DB_PATH", str(tmp_path / "tcg.duckdb"))
    monkeypatch.setenv("TCG_OUT_DIR", str(tmp_path / "out"))
    monkeypatch.setenv("TCG_SETS", "1,2")
    monkeypatch.setenv("TCG_PRICE_DATES", "2026-08-01,2026-09-01")
    monkeypatch.setenv("TCG_RETRY_DELAY", "0")
    monkeypatch.setattr(pipeline, "TcgcsvClient", lambda *a, **k: FakeClient(fail_times=99))
    assert cli.main(["run"]) == 1
    assert "FAILED (" in capsys.readouterr().out

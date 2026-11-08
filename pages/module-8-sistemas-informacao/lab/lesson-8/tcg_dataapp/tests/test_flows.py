"""The Prefect flow over the fake TCGplayer: same results as the runner of Lesson 7, with Prefect doing the retries."""
import duckdb
import pytest
from prefect.settings import PREFECT_LOCAL_STORAGE_PATH, temporary_settings
from prefect.testing.utilities import prefect_test_harness

from tcg_dataapp import flows
from tcg_dataapp.processors import quality

from conftest import FakeClient


@pytest.fixture(scope="session", autouse=True)
def prefect_server():
    """A temporary Prefect server and database for the whole session."""
    with prefect_test_harness():
        yield


@pytest.fixture
def env(settings, monkeypatch, tmp_path):
    """The flow reads its settings from the environment, as it does when a deployment runs it."""
    monkeypatch.setenv("TCG_DB_PATH", str(settings.db_path))
    monkeypatch.setenv("TCG_OUT_DIR", str(settings.out_dir))
    monkeypatch.setenv("TCG_SETS", "1,2")
    monkeypatch.setenv("TCG_PRICE_DATES", "2026-08-01,2026-09-01")
    monkeypatch.setenv("TCG_FROZEN_MONTH", "2026-08")
    monkeypatch.setenv("TCG_RETRIES", "1")
    monkeypatch.setenv("TCG_RETRY_DELAY", "0")
    with temporary_settings({PREFECT_LOCAL_STORAGE_PATH: tmp_path / "prefect-results"}):
        yield settings


def use(monkeypatch, client):
    monkeypatch.setattr(flows, "make_client", lambda _settings: client)
    return client


def log(settings, task=None):
    con = duckdb.connect(str(settings.db_path), read_only=True)
    sql = "SELECT task, attempt, status FROM ops.pipeline_runs"
    rows = con.execute(sql + (" WHERE task = ?" if task else "") + " ORDER BY started_at, task", [task] if task else []).fetchall()
    con.close()
    return rows


def test_the_flow_builds_gold_and_logs_every_task(env, monkeypatch):
    use(monkeypatch, FakeClient())
    state = flows.tcg_pipeline(return_state=True)
    assert state.is_completed()
    results = state.result()
    assert results["check_quality"]["fact_rows"] == results["check_quality"]["fact_grain_keys"] == 6
    assert results["freeze_reports"]["mv_card_price_2026_08"].startswith("created")
    assert (env.out_dir / "report.md").exists()
    assert {t for t, _, s in log(env) if s == "completed"} == {
        "extract_sets", "extract_products", "load_prices_2026-08-01", "load_prices_2026-09-01",
        "build_gold", "check_quality", "freeze_reports", "export_marts", "write_report"}


def test_a_second_run_reuses_the_downloads_and_keeps_the_grain(env, monkeypatch):
    client = use(monkeypatch, FakeClient())
    calls = []
    original = client.prices_archive
    monkeypatch.setattr(client, "prices_archive", lambda day, groups: calls.append(day) or original(day, groups))
    flows.tcg_pipeline()
    second = flows.tcg_pipeline()
    assert sorted(calls) == ["2026-08-01", "2026-09-01"]  # each archive downloaded once: the second run hit the cache
    assert second["check_quality"]["fact_rows"] == 6
    assert second["freeze_reports"]["mv_card_price_2026_08"] == "kept"


def test_a_network_failure_is_retried_by_prefect(env, monkeypatch):
    use(monkeypatch, FakeClient(fail_times=1))
    assert flows.tcg_pipeline(return_state=True).is_completed()
    assert log(env, "extract_sets") == [("extract_sets", 2, "completed")]


def test_a_task_that_keeps_failing_stops_everything_downstream(env, monkeypatch):
    use(monkeypatch, FakeClient(fail_times=99))
    state = flows.tcg_pipeline(return_state=True)
    assert state.is_failed()
    assert "extract_sets" in state.message and "write_report" in state.message
    assert log(env, "extract_sets") == [("extract_sets", 2, "failed")]
    assert not (env.out_dir / "report.md").exists()


def test_a_quality_error_is_not_retried(env, monkeypatch):
    use(monkeypatch, FakeClient())
    calls = []

    def broken(con):
        calls.append(1)
        raise quality.QualityError("grain broken")

    monkeypatch.setattr(quality, "check_gold", broken)
    state = flows.tcg_pipeline(return_state=True)
    assert state.is_failed()
    assert len(calls) == 1
    assert not (env.out_dir / "report.md").exists()

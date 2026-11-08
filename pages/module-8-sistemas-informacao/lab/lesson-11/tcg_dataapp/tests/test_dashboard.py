"""The queries of the app, over the fake warehouse of conftest: no Streamlit and no network."""
import pytest

from tcg_dataapp import pipeline
from tcg_dataapp.views import dashboard as db

from conftest import FakeClient


@pytest.fixture
def con(settings):
    pipeline.run(settings, client=FakeClient(), echo=lambda _: None)
    con = db.connect(settings.db_path)
    yield con
    con.close()


def test_the_connection_of_the_app_cannot_write(con):
    with pytest.raises(Exception, match="read-only"):
        con.execute("DROP VIEW gold.fact_price")


def test_overview_counts_the_model_and_the_last_run(con):
    info = db.overview(con)
    assert (info["sets"], info["cards"], info["prices"], info["captures"]) == (2, 3, 6, 2)
    assert info["last_run"]["tasks_ok"] == info["last_run"]["tasks"] == 9


def test_task_graph_comes_from_the_run_log(con):
    tasks = {t["task"]: t for t in db.task_graph(con)["tasks"]}
    assert tasks["write_report"]["depends_on"] == ["freeze_reports", "export_marts"]
    assert {t["status"] for t in tasks.values()} == {"success"}


def test_lineage_reads_the_catalogue_and_the_comment_of_the_frozen_table(con):
    graph = db.lineage(con)
    assert ("db_ingestion", "gold.fact_price") in graph["edges"]
    assert ("gold.fact_price", "gold.agg_price_cube") in graph["edges"]
    assert ("mart_collectors.card_price", "report.mv_card_price_2026_08") in graph["edges"]
    rows = {n["name"]: n["rows"] for n in graph["nodes"]}
    assert rows["gold.fact_price"] == 6


def test_explorer_drills_down_and_agrees_with_the_cube(con):
    by_set = db.explore(con, "live", ["set_name"], "market_value")
    assert [(r["set_name"], float(r["value"])) for r in by_set["rows"]] == [("Test Set One", 10.0), ("Test Set Two", 0.5)]
    assert db.cube_check(con, by_set, ["set_name"], "market_value")["agree"]
    cards = db.explore(con, "live", ["card"], "max_price", {"set_name": "Test Set One", "rarity": "Rare"})
    assert [r["card"] for r in cards["rows"]] == ["Card B"]
    assert db.cube_check(con, cards, ["card"], "max_price", {"set_name": "Test Set One"}) is None


def test_frozen_source_reads_the_month_that_was_frozen(con):
    assert db.frozen_months(con) == ["2026_08"]
    frozen = db.explore(con, "frozen", ["card"], "max_price", suffix="2026_08")
    assert {r["card"]: float(r["value"]) for r in frozen["rows"]} == {"Card B": 10.0, "Card A": 1.0}


@pytest.mark.parametrize("args", [
    {"source": "live", "dims": ["set_name; DROP TABLE x"], "measure": "prices"},
    {"source": "live", "dims": ["set_name"], "measure": "sum(1)"},
    {"source": "db_ingestion", "dims": [], "measure": "prices"},
    {"source": "frozen", "dims": [], "measure": "prices", "suffix": "x"},
])
def test_explorer_refuses_anything_outside_its_lists(con, args):
    with pytest.raises(ValueError):
        db.explore(con, **args)


def test_a_filter_value_is_a_parameter_not_sql(con):
    result = db.explore(con, "live", ["card"], "prices", {"set_name": "x' OR '1'='1"})
    assert result["rows"] == [] and "?" in result["sql"]


def test_price_history_by_set_and_by_card(con):
    sets = db.price_history(con, "set")
    assert {r["captured_at"] for r in sets} == {1785542400, 1788220800}
    cards = db.price_history(con, "card", "Test Set One")
    assert {r["series"] for r in cards} == {"Card A · Normal", "Card B · Holofoil"}

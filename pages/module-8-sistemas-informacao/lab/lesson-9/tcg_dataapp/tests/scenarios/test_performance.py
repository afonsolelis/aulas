"""Scenario S12: the processing of a year of captures fits the budget."""
import time

import duckdb
import pytest

from tcg_dataapp.etls.landing import ensure_table
from tcg_dataapp.processors import gold, quality
from tcg_dataapp.views import report

PRODUCTS, CAPTURES, BUDGET_S = 2_000, 50, 10.0
START = 1767268800  # 2026-01-01 12:00 UTC


def synthetic_landing(con):
    ensure_table(con)
    con.execute("""INSERT INTO db_ingestion VALUES (?, '{"groupId":1,"name":"Synthetic","abbreviation":"SYN",
                   "publishedOn":"2025-12-01T00:00:00"}', 'tcgplayer.set.v1')""", [START]).fetchall()
    con.execute(f"""INSERT INTO db_ingestion
        SELECT {START}, json_object('productId', p, 'groupId', 1, 'name', 'Card ' || p,
               'extendedData', json_array(json_object('name', 'Number', 'value', p || '/{PRODUCTS}'),
                                          json_object('name', 'Rarity', 'value', ['Common', 'Uncommon', 'Rare'][p % 3 + 1]))),
               'tcgplayer.product.v1'
        FROM range({PRODUCTS}) t(p)""").fetchall()
    con.execute(f"""INSERT INTO db_ingestion
        SELECT {START} + d * 7 * 86400,
               json_object('productId', p, 'marketPrice', round(1 + (p % 97) * (1 + d / 100), 2), 'subTypeName', 'Normal'),
               'tcgplayer.price.v1'
        FROM range({PRODUCTS}) t(p), range({CAPTURES}) u(d)""").fetchall()


@pytest.mark.scenario("S12")
def test_s12_processing_fits_the_budget(tmp_path):
    """TC12.1 100,000 prices processed within the budget"""
    con = duckdb.connect(str(tmp_path / "big.duckdb"))
    synthetic_landing(con)
    t0 = time.perf_counter()
    gold.build_gold(con)
    measured = quality.check_gold(con)
    gold.freeze_month(con, "2026-03")
    report.export_marts(con, tmp_path / "out")
    report.write_report(con, tmp_path / "out")
    elapsed = time.perf_counter() - t0
    print(f"S12: {measured['fact_rows']:,} prices processed in {elapsed:.2f} s")
    assert measured["fact_rows"] == PRODUCTS * CAPTURES
    assert elapsed < BUDGET_S

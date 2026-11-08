"""Checks that stop the pipeline when the gold layer is wrong."""
from __future__ import annotations

import duckdb

from tcg_dataapp.etls.landing import run


class QualityError(RuntimeError):
    pass


def check_gold(con: duckdb.DuckDBPyConnection) -> dict:
    """Return the measured numbers, or raise QualityError naming the check that failed."""
    m = {}
    for tag in ("tcgplayer.set.v1", "tcgplayer.product.v1", "tcgplayer.price.v1"):
        m[tag] = run(con, "SELECT count(*) FROM db_ingestion WHERE data_tag = ?", [tag])[0][0]
        if m[tag] == 0:
            raise QualityError(f"db_ingestion has no rows of {tag}")
    rows, keys = run(con, "SELECT count(*), count(DISTINCT (date_unix, product_id, variant)) FROM gold.fact_price")[0]
    m["fact_rows"], m["fact_grain_keys"] = rows, keys
    if rows != keys:
        raise QualityError(f"grain of gold.fact_price broken: {rows} rows for {keys} keys")
    orphans = run(con, "SELECT count(*) FROM gold.fact_price f LEFT JOIN gold.dim_set s ON s.set_id = f.set_id WHERE s.set_id IS NULL")[0][0]
    m["fact_without_set"] = orphans
    if orphans:
        raise QualityError(f"{orphans} prices of gold.fact_price have no set in gold.dim_set")
    m["dates"] = run(con, "SELECT count(*) FROM gold.dim_date")[0][0]
    m["cube_cells"] = run(con, "SELECT count(*) FROM gold.agg_price_cube")[0][0]
    return m

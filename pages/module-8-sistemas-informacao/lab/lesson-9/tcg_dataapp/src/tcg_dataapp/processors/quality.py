"""Checks that stop the pipeline when the gold layer is wrong, and the check of freshness.

Version 0.3.0 adds two checks found by the ATAM scenarios of Lesson 9:
S03, prices of the landing table that never reach the fact, and S04, a
capture whose market prices became null because the source renamed a
field. The check of 0.1.0 that counted prices without a set was removed:
gold.fact_price is an inner join with gold.dim_set, so it could never fail.
"""
from __future__ import annotations

import duckdb

from tcg_dataapp.etls.landing import run

MAX_DROPPED_SHARE = 0.01  # S03: share of the prices of a capture that may miss the fact
MAX_NULL_SHARE = 0.10     # S04: share of null market prices in a capture (real maximum 1.7 %)


class QualityError(RuntimeError):
    pass


class StaleDataError(RuntimeError):
    pass


def check_gold(con: duckdb.DuckDBPyConnection, max_dropped_share: float = MAX_DROPPED_SHARE,
               max_null_share: float = MAX_NULL_SHARE) -> dict:
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

    # S03: every price of the landing table reaches the fact, capture by capture
    per_capture = run(con, """
        WITH landing AS (SELECT timestamp // 86400 * 86400 AS date_unix, count(*) AS n
                         FROM db_ingestion WHERE data_tag = 'tcgplayer.price.v1' GROUP BY 1),
             fact AS (SELECT date_unix, count(*) AS n,
                             count(*) FILTER (WHERE market_price IS NULL) AS nulls
                      FROM gold.fact_price GROUP BY 1)
        SELECT l.date_unix, l.n, coalesce(f.n, 0), coalesce(f.nulls, 0)
        FROM landing l LEFT JOIN fact f USING (date_unix) ORDER BY 1""")
    m["prices_not_in_fact"] = sum(n - in_fact for _, n, in_fact, _ in per_capture)
    for date_unix, n, in_fact, nulls in per_capture:
        dropped = (n - in_fact) / n
        if dropped > max_dropped_share:
            raise QualityError(f"{n - in_fact} of {n} prices of the capture {date_unix} did not reach "
                               f"gold.fact_price ({dropped:.1%} > {max_dropped_share:.0%})")
        null_share = nulls / in_fact if in_fact else 1.0
        if null_share > max_null_share:
            raise QualityError(f"{nulls} of {in_fact} prices of the capture {date_unix} have a null market price "
                               f"({null_share:.1%} > {max_null_share:.0%}); did the source rename a field?")
    m["max_null_price_share"] = round(max((nulls / in_fact for _, _, in_fact, nulls in per_capture if in_fact),
                                          default=0.0), 4)
    m["dates"] = run(con, "SELECT count(*) FROM gold.dim_date")[0][0]
    m["cube_cells"] = run(con, "SELECT count(*) FROM gold.agg_price_cube")[0][0]
    return m


def check_freshness(con: duckdb.DuckDBPyConnection, now: int, max_age_days: float = 2) -> float:
    """S11: age in days of the last capture; raise StaleDataError when it is older than max_age_days."""
    last = run(con, "SELECT max(timestamp) FROM db_ingestion WHERE data_tag = 'tcgplayer.price.v1'")[0][0]
    if last is None:
        raise StaleDataError("db_ingestion has no prices")
    age = (now - last) / 86400
    if age > max_age_days:
        raise StaleDataError(f"last capture {last} is {age:.1f} days old (limit {max_age_days:g} days)")
    return round(age, 2)

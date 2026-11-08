"""The five questions of Lesson 6, each one an OLAP operation over the cube or the mart.

The dates are not fixed: every question reads the last capture of the model.
"""
from __future__ import annotations

import duckdb

LAST = "(SELECT max(date_unix) FROM gold.dim_date)"

QUESTIONS = {
    "q1_rarity_rollup": (
        "Roll-up: average and maximum market price of a card of each rarity, on the last capture",
        f"""SELECT rarity, prices, avg_market_price, max_market_price
            FROM gold.agg_price_cube WHERE grouping_id = 5 AND date_unix = {LAST}
            ORDER BY avg_market_price DESC""",
    ),
    "q2_top_cards_slice": (
        "Slice: the five most expensive cards of Ascended Heroes (ASC), on the last capture",
        f"""SELECT card, rarity, variant, market_price
            FROM mart_collectors.card_price WHERE set_code = 'ASC' AND captured_at = {LAST}
            ORDER BY market_price DESC LIMIT 5""",
    ),
    "q3_set_value_by_month": (
        "Pivot: market value of each set on the last capture of each month (semi-additive: one capture at a time)",
        """SELECT set_name, month, market_value
           FROM mart_collectors.set_value
           QUALIFY captured_at = max(captured_at) OVER (PARTITION BY month)
           ORDER BY set_name, month""",
    ),
    "q4_variant_dice": (
        "Dice: average price of each variant of the four lowest rarities, on the last capture",
        f"""SELECT rarity, variant, avg_market_price
            FROM gold.agg_price_cube
            WHERE grouping_id = 4 AND date_unix = {LAST}
              AND rarity IN ('Common', 'Uncommon', 'Rare', 'Double Rare')
            ORDER BY rarity, variant""",
    ),
    "q5_appreciation": (
        "The cards that appreciated most between their first and their last capture (first price >= US$ 5)",
        """WITH first_and_last AS (
                SELECT set_code, card, rarity, variant,
                       arg_min(market_price, captured_at) AS first_price,
                       min(captured_at)                   AS first_captured_at,
                       arg_max(market_price, captured_at) AS last_price
                FROM mart_collectors.card_price
                WHERE market_price IS NOT NULL
                GROUP BY ALL
                HAVING count(*) >= 2)
           SELECT set_code, card, rarity, variant, first_captured_at, first_price, last_price,
                  last_price - first_price AS gain_usd,
                  round(100 * (last_price / first_price - 1), 1) AS gain_pct
           FROM first_and_last WHERE first_price >= 5
           ORDER BY gain_pct DESC LIMIT 10""",
    ),
}


def answer(con: duckdb.DuckDBPyConnection, key: str) -> tuple[list[str], list[tuple]]:
    relation = con.sql(QUESTIONS[key][1])
    return relation.columns, relation.fetchall()


def answer_all(con: duckdb.DuckDBPyConnection) -> dict:
    return {key: answer(con, key) for key in QUESTIONS}

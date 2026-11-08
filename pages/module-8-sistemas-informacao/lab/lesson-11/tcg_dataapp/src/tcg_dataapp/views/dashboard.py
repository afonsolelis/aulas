"""Queries of the Streamlit app, kept apart from Streamlit so they can be tested alone.

Every function reads the warehouse through a read-only connection and only
from gold, the marts, the reports and the run log: the app never reads
db_ingestion directly, and it cannot write. Dates stay in Unix time (seconds,
UTC) here; the app converts them only when it draws them.
"""
from __future__ import annotations

import re
from pathlib import Path

import duckdb

# Sources of the explorer: the report frozen in a month and the live view.
SOURCES = {
    "frozen": "report.mv_card_price_{suffix}",
    "live": "report.v_card_price_latest",
}
# Dimensions that the explorer may group by, in the order of the hierarchy.
DIMENSIONS = ("set_name", "rarity", "card", "variant")
HIERARCHY = ("set_name", "rarity", "card")
MEASURES = {
    "max_price": ("Highest market price (US$)", "round(max(market_price), 2)"),
    "avg_price": ("Average market price (US$)", "round(avg(market_price), 2)"),
    "market_value": ("Market value, sum of prices (US$)", "round(sum(market_price), 2)"),
    "prices": ("Number of prices", "count(*)"),
}
# The same measures in the cube, to check the explorer against it.
CUBE_MEASURES = {"max_price": "max_market_price", "avg_price": "avg_market_price",
                 "market_value": "market_value", "prices": "prices"}
# Bits of grouping(set_name, rarity, variant): a bit is 1 when the column is rolled up.
CUBE_BITS = {"set_name": 4, "rarity": 2, "variant": 1}
LINEAGE_SCHEMAS = ("gold", "mart_collectors", "report")


def connect(db_path: Path) -> duckdb.DuckDBPyConnection:
    """A read-only connection: the view layer cannot change the warehouse."""
    return duckdb.connect(str(db_path), read_only=True)


def _rows(con, sql: str, params: list | None = None) -> list[dict]:
    cur = con.execute(sql, params or [])
    names = [d[0] for d in cur.description]
    return [dict(zip(names, row)) for row in cur.fetchall()]


def overview(con) -> dict:
    """The numbers of the infographic: size of the model and the last run."""
    size = _rows(con, """
        SELECT (SELECT count(*) FROM gold.dim_set)                         AS sets,
               (SELECT count(*) FROM gold.dim_product WHERE kind = 'card') AS cards,
               (SELECT count(*) FROM gold.fact_price)                      AS prices,
               (SELECT count(*) FROM gold.dim_date)                        AS captures,
               (SELECT count(*) FROM gold.agg_price_cube)                  AS cube_cells,
               (SELECT min(date_unix) FROM gold.dim_date)                  AS first_capture,
               (SELECT max(date_unix) FROM gold.dim_date)                  AS last_capture""")[0]
    last_run = _rows(con, """
        WITH last AS (SELECT run_id FROM ops.pipeline_runs ORDER BY started_at DESC LIMIT 1)
        SELECT run_id,
               count(DISTINCT task) FILTER (WHERE status = 'success') AS tasks_ok,
               count(DISTINCT task)                                   AS tasks,
               count(*) FILTER (WHERE status = 'failed')              AS failed_attempts,
               min(started_at) AS started_at, max(ended_at) AS ended_at
        FROM ops.pipeline_runs WHERE run_id = (SELECT run_id FROM last) GROUP BY run_id""")
    size["last_run"] = last_run[0] if last_run else None
    return size


def headline(con) -> dict:
    """The sentence that opens the app: the most valuable card and the largest set on the last capture."""
    top = _rows(con, """SELECT card, set_name, variant, market_price FROM report.v_card_price_latest
                        WHERE market_price IS NOT NULL ORDER BY market_price DESC LIMIT 1""")
    share = _rows(con, """SELECT set_name, market_value,
                                 round(100 * market_value / sum(market_value) OVER (), 1) AS share
                          FROM report.v_set_value_latest ORDER BY market_value DESC LIMIT 1""")
    return {"top_card": top[0] if top else None, "top_set": share[0] if share else None}


def task_graph(con) -> dict:
    """Tasks of the last run with their dependencies and final status, from the run log."""
    rows = _rows(con, """
        WITH last AS (SELECT run_id FROM ops.pipeline_runs ORDER BY started_at DESC LIMIT 1)
        SELECT t.task, t.depends_on,
               arg_max(r.status, r.attempt) AS status,
               max(r.attempt)               AS attempts,
               sum(r.ended_at - r.started_at) AS seconds
        FROM ops.pipeline_tasks AS t
        LEFT JOIN ops.pipeline_runs AS r ON r.run_id = t.run_id AND r.task = t.task
        WHERE t.run_id = (SELECT run_id FROM last)
        GROUP BY t.task, t.depends_on, t.rowid ORDER BY t.rowid""")
    return {"tasks": rows}


def lineage(con) -> dict:
    """Objects of the warehouse, their rows and the objects each one reads.

    The edges of a view come from its own SQL in the catalogue (duckdb_views); a
    frozen table keeps its source in a comment, written by freeze_month.
    """
    views = _rows(con, "SELECT schema_name, view_name AS name, sql FROM duckdb_views() "
                       "WHERE schema_name IN ('gold', 'mart_collectors', 'report')")
    tables = _rows(con, "SELECT schema_name, table_name AS name, comment FROM duckdb_tables() "
                        "WHERE schema_name IN ('main', 'report') ORDER BY schema_name, table_name")
    names = ["db_ingestion"] + [f"{v['schema_name']}.{v['name']}" for v in views] + \
            [f"{t['schema_name']}.{t['name']}" for t in tables if t["schema_name"] == "report"]
    edges = []
    for v in views:
        target = f"{v['schema_name']}.{v['name']}"
        for source in names:
            if source != target and re.search(rf"(?<![\w.]){re.escape(source)}(?!\w)", v["sql"]):
                edges.append((source, target))
    for t in tables:
        match = re.search(r"frozen from ([\w.]+)", t["comment"] or "")
        if match:
            edges.append((match.group(1), f"{t['schema_name']}.{t['name']}"))
    nodes = []
    for name in names:
        rows = con.execute(f"SELECT count(*) FROM {name}").fetchall()[0][0]
        kind = "table" if name == "db_ingestion" or name.startswith("report.mv_") else "view"
        layer = "etls" if name == "db_ingestion" else ("views" if name.startswith("report.") else "processors")
        nodes.append({"name": name, "rows": rows, "kind": kind, "layer": layer})
    return {"nodes": nodes, "edges": sorted(set(edges))}


def frozen_months(con) -> list[str]:
    """Months that have a frozen report, as YYYY_MM suffixes."""
    rows = con.execute("SELECT table_name FROM duckdb_tables() WHERE schema_name = 'report' "
                       "AND table_name LIKE 'mv_card_price_%' ORDER BY table_name").fetchall()
    return [r[0].removeprefix("mv_card_price_") for r in rows]


def explore(con, source: str, dims: list[str], measure: str, filters: dict | None = None,
            suffix: str | None = None, limit: int = 15) -> dict:
    """Ranked groups of the explorer, with the SQL that produced them.

    The dimensions and the measure come from fixed lists and the filter values
    are parameters, so a value chosen in the app never becomes SQL.
    """
    if source not in SOURCES:
        raise ValueError(f"unknown source {source!r}")
    if measure not in MEASURES:
        raise ValueError(f"unknown measure {measure!r}")
    filters = filters or {}
    for d in list(dims) + list(filters):
        if d not in DIMENSIONS:
            raise ValueError(f"unknown dimension {d!r}")
    if source == "frozen" and not re.fullmatch(r"\d{4}_\d{2}", suffix or ""):
        raise ValueError("a frozen source needs a suffix YYYY_MM")
    table = SOURCES[source].format(suffix=suffix)
    label, expression = MEASURES[measure]
    group = ", ".join(dims)
    where = " AND ".join(f"{d} = ?" for d in filters) or "true"
    select = f"{group}, " if dims else ""
    sql = (f"SELECT {select}{expression} AS value\nFROM {table}\nWHERE market_price IS NOT NULL AND {where}\n"
           + (f"GROUP BY {group}\n" if dims else "") + f"ORDER BY value DESC\nLIMIT {int(limit)}")
    rows = _rows(con, sql, list(filters.values()))
    captured_at = con.execute(f"SELECT max(captured_at) FROM {table}").fetchall()[0][0]
    return {"sql": sql, "params": list(filters.values()), "rows": rows, "label": label,
            "captured_at": captured_at, "table": table}


def cube_check(con, result: dict, dims: list[str], measure: str, filters: dict | None = None) -> dict | None:
    """Reads the same groups from gold.agg_price_cube and says whether they agree.

    The cube has no card, so the check exists only when neither the grouping
    nor the filters use it.
    """
    filters = filters or {}
    used = set(dims) | set(filters)
    if "card" in used:
        return None
    grouping_id = sum(bit for d, bit in CUBE_BITS.items() if d not in used)
    where = " AND ".join([f"{d} = ?" for d in filters] + ["grouping_id = ?", "date_unix = ?"])
    cube = _rows(con, f"SELECT {', '.join(dims) + ', ' if dims else ''}{CUBE_MEASURES[measure]} AS value "
                      f"FROM gold.agg_price_cube WHERE {where}",
                 list(filters.values()) + [grouping_id, result["captured_at"]])
    key = lambda r: tuple(r[d] for d in dims)  # noqa: E731
    cube_by_key = {key(r): round(float(r["value"]), 2) for r in cube}
    agree = all(abs(cube_by_key.get(key(r), float("nan")) - round(float(r["value"]), 2)) < 0.01
                for r in result["rows"])
    return {"grouping_id": grouping_id, "cells": len(cube), "agree": agree}


def price_history(con, level: str, highlight: str | None = None) -> list[dict]:
    """Market value of each set, or the price of each card of one set, on every capture.

    level 'set' reads mart_collectors.set_value; level 'card' reads the card
    prices of the set named in highlight, one line per card and variant.
    """
    if level == "set":
        return _rows(con, "SELECT captured_at, set_name AS series, market_value AS value "
                          "FROM mart_collectors.set_value ORDER BY captured_at, series")
    if level == "card":
        return _rows(con, """
            WITH top AS (SELECT card, number, variant FROM mart_collectors.card_price
                         WHERE set_name = ? AND market_price IS NOT NULL
                           AND captured_at = (SELECT max(captured_at) FROM mart_collectors.card_price)
                         ORDER BY market_price DESC LIMIT 5)
            SELECT c.captured_at, c.card || ' · ' || c.variant AS series, c.market_price AS value
            FROM mart_collectors.card_price AS c
            JOIN top USING (card, number, variant)
            WHERE c.set_name = ? AND c.market_price IS NOT NULL
            ORDER BY c.captured_at, series""", [highlight, highlight])
    raise ValueError(f"unknown level {level!r}")

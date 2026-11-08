"""Builds the gold layer from the SQL files of the package and freezes monthly reports."""
from __future__ import annotations

import re
from importlib import resources

import duckdb

from tcg_dataapp.etls.landing import run

SQL_FILES = ("01_dimensions.sql", "02_fact.sql", "03_cube_and_mart.sql", "04_live_reports.sql")


def sql_text(name: str) -> str:
    return resources.files("tcg_dataapp.processors").joinpath("sql", name).read_text(encoding="utf-8")


def build_gold(con: duckdb.DuckDBPyConnection) -> list[str]:
    """Create or replace every view of gold, mart_collectors and the live reports."""
    for name in SQL_FILES:
        for statement in con.extract_statements(sql_text(name)):
            con.execute(statement).fetchall()
    return list(SQL_FILES)


def freeze_month(con: duckdb.DuckDBPyConnection, month: str) -> dict:
    """Materialize the reports of one month (YYYY-MM), once. An existing frozen report is kept as it is.

    A month can have more than one capture; the report takes the last one, because
    the price is semi-additive and two captures of the same card must not add up.
    """
    if not re.fullmatch(r"\d{4}-\d{2}", month):
        raise ValueError(f"month must be YYYY-MM, got {month!r}")
    suffix = month.replace("-", "_")
    run(con, "CREATE SCHEMA IF NOT EXISTS report")
    result = {}
    for name, source, columns in (
        (f"mv_card_price_{suffix}", "mart_collectors.card_price", "set_name, card, rarity, variant, market_price"),
        (f"mv_set_value_{suffix}", "mart_collectors.set_value", "set_name, prices, market_value"),
    ):
        exists = run(con, "SELECT count(*) FROM duckdb_tables() WHERE schema_name = 'report' AND table_name = ?", [name])[0][0]
        if exists:
            result[name] = "kept"
            continue
        last = f"(SELECT max(captured_at) FROM {source} WHERE month = ?)"
        rows = run(con, f"SELECT count(*) FROM {source} WHERE captured_at = {last}", [month])[0][0]
        if rows == 0:
            result[name] = "no data"
            continue
        run(con, f"CREATE TABLE report.{name} AS SELECT captured_at, {columns} FROM {source} WHERE captured_at = {last}", [month])
        # A table does not remember the query that made it; the comment keeps its lineage.
        run(con, f"COMMENT ON TABLE report.{name} IS 'frozen from {source}, last capture of {month}'")
        result[name] = f"created ({rows} rows)"
    return result

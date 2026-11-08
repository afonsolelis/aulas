"""The landing table db_ingestion: three columns, every record as it arrived.

    timestamp  BIGINT   Unix time of the capture (seconds, UTC)
    data_json  JSON     the record, with the field names of TCGplayer
    data_tag   VARCHAR  tcgplayer.set.v1, tcgplayer.product.v1 or tcgplayer.price.v1

A batch is the set of records of one tag captured at one timestamp. Loading
the same batch again replaces it, so a rerun never duplicates rows.
"""
from __future__ import annotations

import json

import duckdb

DDL = """
CREATE TABLE IF NOT EXISTS db_ingestion (
    timestamp BIGINT  NOT NULL,
    data_json JSON    NOT NULL,
    data_tag  VARCHAR NOT NULL
)
"""


def run(con: duckdb.DuckDBPyConnection, sql: str, params: list | None = None) -> list:
    """Execute one statement and consume its result.

    DuckDB 2.0 keeps the result of execute() open until it is read, and the
    next statement on the same connection fails while it is open.
    """
    return con.execute(sql, params or []).fetchall()


def ensure_table(con: duckdb.DuckDBPyConnection) -> None:
    run(con, DDL)


def load_batch(con: duckdb.DuckDBPyConnection, data_tag: str, timestamp: int, records: list[dict],
               extra_filter: tuple[str, list] | None = None) -> int:
    """Replace the batch (data_tag, timestamp) with the given records; return the rows written.

    extra_filter narrows what is replaced inside the batch, for loads split in
    parts, such as the prices of one set: ("data_json->>'groupId' = ?", [24541]).
    """
    ensure_table(con)
    where = "data_tag = ? AND timestamp = ?"
    params: list = [data_tag, timestamp]
    if extra_filter:
        where += f" AND {extra_filter[0]}"
        params += extra_filter[1]
    run(con, "BEGIN TRANSACTION")
    try:
        run(con, f"DELETE FROM db_ingestion WHERE {where}", params)
        if records:
            con.executemany(
                "INSERT INTO db_ingestion VALUES (?, ?, ?)",
                [(timestamp, json.dumps(r, separators=(",", ":"), ensure_ascii=False), data_tag) for r in records],
            ).fetchall()
        run(con, "COMMIT")
    except Exception:
        run(con, "ROLLBACK")
        raise
    return len(records)


def counts(con: duckdb.DuckDBPyConnection) -> list[tuple]:
    """Rows and Unix time range per tag; works on a read-only connection."""
    return run(con, "SELECT data_tag, count(*), min(timestamp), max(timestamp) FROM db_ingestion GROUP BY 1 ORDER BY 1")

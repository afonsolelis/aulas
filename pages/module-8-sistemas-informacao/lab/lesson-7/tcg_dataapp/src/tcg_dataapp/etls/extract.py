"""Extraction of sets, products and prices, each one loaded as a batch of db_ingestion."""
from __future__ import annotations

import datetime

import duckdb

from tcg_dataapp.etls.landing import load_batch
from tcg_dataapp.etls.tcgcsv import TcgcsvClient

# Product attributes kept from extendedData; the long text of the card is dropped.
KEEP_EXTENDED = {"Number", "Rarity", "Card Type", "HP", "Stage"}


def unix(day: str, hour: int = 12) -> int:
    """Unix time of a day (YYYY-MM-DD) at the given hour, UTC."""
    d = datetime.date.fromisoformat(day)
    return int(datetime.datetime(d.year, d.month, d.day, hour, tzinfo=datetime.timezone.utc).timestamp())


def now_unix() -> int:
    return int(datetime.datetime.now(datetime.timezone.utc).timestamp())


def extract_sets(con: duckdb.DuckDBPyConnection, client: TcgcsvClient, set_ids: tuple, captured_at: int) -> int:
    groups = {g["groupId"]: g for g in client.groups()}
    missing = [s for s in set_ids if s not in groups]
    if missing:
        raise ValueError(f"sets not found on TCGplayer: {missing}")
    return load_batch(con, "tcgplayer.set.v1", captured_at, [groups[s] for s in set_ids])


def extract_products(con: duckdb.DuckDBPyConnection, client: TcgcsvClient, set_ids: tuple, captured_at: int) -> int:
    records = []
    for set_id in set_ids:
        for product in client.products(set_id):
            product = dict(product)
            product.pop("imageUrl", None)
            product["extendedData"] = [e for e in product.get("extendedData", []) if e["name"] in KEEP_EXTENDED]
            records.append(product)
    return load_batch(con, "tcgplayer.product.v1", captured_at, records)


def extract_prices_archive(con: duckdb.DuckDBPyConnection, client: TcgcsvClient, set_ids: tuple, day: str) -> int:
    """Prices of one past day, from the archive, captured at noon UTC of that day."""
    by_set = client.prices_archive(day, list(set_ids))
    records = [price for set_id in set_ids for price in by_set.get(set_id, [])]
    return load_batch(con, "tcgplayer.price.v1", unix(day), records)


def extract_prices_today(con: duckdb.DuckDBPyConnection, client: TcgcsvClient, set_ids: tuple, day: str) -> int:
    """Prices of today from the live API, loaded as the batch of noon UTC of the day.

    Using noon of the day, and not the moment of the run, makes a second run on
    the same day replace the batch instead of adding a second price per product.
    """
    records = [price for set_id in set_ids for price in client.prices_today(set_id)]
    return load_batch(con, "tcgplayer.price.v1", unix(day), records)


def today() -> str:
    return datetime.datetime.now(datetime.timezone.utc).date().isoformat()

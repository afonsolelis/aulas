"""A fake TCGplayer with two sets, so the tests run without network."""
from __future__ import annotations

import pytest
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import SimpleSpanProcessor
from opentelemetry.sdk.trace.export.in_memory_span_exporter import InMemorySpanExporter

from tcg_dataapp.config import Settings

# One tracer provider for the whole test session (OpenTelemetry accepts only one
# per process); the fixture spans empties its exporter before each test.
_EXPORTER = InMemorySpanExporter()
_provider = TracerProvider()
_provider.add_span_processor(SimpleSpanProcessor(_EXPORTER))
trace.set_tracer_provider(_provider)

SETS = {
    1: {"groupId": 1, "name": "Test Set One", "abbreviation": "TS1", "publishedOn": "2026-07-01T00:00:00", "categoryId": 3},
    2: {"groupId": 2, "name": "Test Set Two", "abbreviation": "TS1", "publishedOn": "2026-08-01T00:00:00", "categoryId": 3},
}


def card(pid, gid, name, number, rarity):
    return {"productId": pid, "groupId": gid, "name": name, "imageUrl": "x",
            "extendedData": [{"name": "Number", "value": number}, {"name": "Rarity", "value": rarity},
                             {"name": "CardText", "value": "long text"}]}


PRODUCTS = {
    1: [card(11, 1, "Card A", "001/010", "Common"), card(12, 1, "Card B", "002/010", "Rare"),
        {"productId": 13, "groupId": 1, "name": "Booster Box", "extendedData": []}],
    2: [card(21, 2, "Card C", "001/020", "Common")],
}
# prices per day of capture
PRICES = {
    "2026-08-01": {1: [{"productId": 11, "marketPrice": 1.0, "subTypeName": "Normal"},
                       {"productId": 12, "marketPrice": 10.0, "subTypeName": "Holofoil"}]},
    "2026-09-01": {1: [{"productId": 11, "marketPrice": 2.0, "subTypeName": "Normal"},
                       {"productId": 12, "marketPrice": 8.0, "subTypeName": "Holofoil"},
                       {"productId": 13, "marketPrice": 100.0, "subTypeName": "Normal"}],
                   2: [{"productId": 21, "marketPrice": 0.5, "subTypeName": "Normal"}]},
}


class FakeClient:
    """fail_times: the first calls of groups() raise; down: every call raises while True."""

    base_url = "https://fake.tcgcsv.test"

    def __init__(self, fail_times: int = 0):
        self.fail_times = fail_times
        self.calls = 0
        self.down = False

    def groups(self):
        self.calls += 1
        if self.down or self.calls <= self.fail_times:
            raise ConnectionError("tcgcsv is down")
        return list(SETS.values()) + [{"groupId": 99, "name": "Other", "abbreviation": "OT", "publishedOn": "2020-01-01T00:00:00"}]

    def products(self, group_id):
        return PRODUCTS[group_id]

    def prices_archive(self, day, group_ids):
        return {g: PRICES[day].get(g, []) for g in group_ids}

    def prices_today(self, group_id):
        return PRICES["2026-09-01"].get(group_id, [])


@pytest.fixture
def spans():
    _EXPORTER.clear()
    return _EXPORTER


@pytest.fixture
def settings(tmp_path):
    return Settings(db_path=tmp_path / "tcg.duckdb", out_dir=tmp_path / "out", sets=(1, 2),
                    price_dates=("2026-08-01", "2026-09-01"), frozen_month="2026-08", retries=1, retry_delay=0)

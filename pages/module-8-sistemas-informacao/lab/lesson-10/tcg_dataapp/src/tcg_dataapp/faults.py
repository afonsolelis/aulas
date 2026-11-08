"""Faults injected into the client of the source, to rehearse how the DataApp and its controller react.

Chaos engineering on a small scale: the fault is chosen by TCG_FAULT, never by code,
so the same package runs in production with TCG_FAULT empty.

    source_down       every request raises ConnectionError, as when tcgcsv.com is down
    duplicate_prices  the prices of today arrive twice, which breaks the grain of the fact
"""
from __future__ import annotations

FAULTS = ("source_down", "duplicate_prices")


class FaultyClient:
    def __init__(self, client, fault: str):
        if fault not in FAULTS:
            raise ValueError(f"unknown fault {fault!r}; expected one of {FAULTS}")
        self._client = client
        self.fault = fault
        self.base_url = getattr(client, "base_url", "")

    def _down(self):
        raise ConnectionError("fault injected: source_down")

    def groups(self):
        if self.fault == "source_down":
            self._down()
        return self._client.groups()

    def products(self, group_id):
        if self.fault == "source_down":
            self._down()
        return self._client.products(group_id)

    def prices_archive(self, day, group_ids):
        if self.fault == "source_down":
            self._down()
        return self._client.prices_archive(day, group_ids)

    def prices_today(self, group_id):
        if self.fault == "source_down":
            self._down()
        prices = self._client.prices_today(group_id)
        return prices + prices if self.fault == "duplicate_prices" else prices

"""A fake TCGplayer with two sets, so the tests run without network, and the
plugin that traces each test to the ATAM scenario it covers.

A test declares the scenario of docs/scenarios.toml it covers with
@pytest.mark.scenario("S01"). At the end of the run the plugin prints the
traceability table and writes out/traceability.json, which
tools/traceability.py turns into the utility tree with the results.
"""
from __future__ import annotations

import copy
import json
import socket
import time
import tomllib
from pathlib import Path

import pytest

from tcg_dataapp.config import Settings

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
    """The source of the tests. prices can replace PRICES to simulate a change of the source."""

    def __init__(self, fail_times: int = 0, prices: dict | None = None):
        self.fail_times = fail_times
        self.calls = 0
        self.prices = copy.deepcopy(PRICES) if prices is None else prices

    def groups(self):
        self.calls += 1
        if self.calls <= self.fail_times:
            raise ConnectionError("tcgcsv is down")
        return list(SETS.values()) + [{"groupId": 99, "name": "Other", "abbreviation": "OT", "publishedOn": "2020-01-01T00:00:00"}]

    def products(self, group_id):
        return PRODUCTS[group_id]

    def prices_archive(self, day, group_ids):
        return {g: self.prices[day].get(g, []) for g in group_ids}

    def prices_today(self, group_id):
        return self.prices["2026-09-01"].get(group_id, [])


@pytest.fixture
def settings(tmp_path):
    return Settings(db_path=tmp_path / "tcg.duckdb", out_dir=tmp_path / "out", sets=(1, 2),
                    price_dates=("2026-08-01", "2026-09-01"), frozen_month="2026-08", retries=1, retry_delay=0)


@pytest.fixture(autouse=True)
def no_network(monkeypatch):
    """Scenario S13: no test may open a connection; the fake source is the only source."""
    def refuse(*args, **kwargs):
        raise RuntimeError("network blocked by the test suite")
    monkeypatch.setattr(socket.socket, "connect", refuse)
    monkeypatch.setattr(socket, "create_connection", refuse)


# --------------------------------------------------------------- traceability
SCENARIOS: dict[str, dict] = {}
OUTCOMES: dict[str, list[tuple[str, str, str]]] = {}
STARTED = [0.0]


def pytest_addoption(parser):
    parser.addoption("--scenario", action="append", default=[],
                     help="run only the tests of this ATAM scenario (repeatable), e.g. --scenario S04")


def pytest_configure(config):
    path = Path(config.rootpath) / "docs" / "scenarios.toml"
    SCENARIOS.update({s["id"]: s for s in tomllib.loads(path.read_text(encoding="utf-8"))["scenario"]})
    STARTED[0] = time.perf_counter()


def _scenario_of(item):
    mark = item.get_closest_marker("scenario")
    return mark.args[0] if mark else None


def pytest_collection_modifyitems(config, items):
    for item in items:
        sid = _scenario_of(item)
        if sid is not None and sid not in SCENARIOS:
            raise pytest.UsageError(f"{item.nodeid} declares scenario {sid}, which is not in docs/scenarios.toml")
    wanted = set(config.getoption("--scenario"))
    if wanted:
        keep = [i for i in items if _scenario_of(i) in wanted]
        config.hook.pytest_deselected(items=[i for i in items if i not in keep])
        items[:] = keep


def pytest_runtest_logreport(report):
    if report.when == "call" or (report.when == "setup" and report.outcome != "passed"):
        sid = dict(report.user_properties).get("scenario")
        if sid:
            case = dict(report.user_properties).get("case", "")
            OUTCOMES.setdefault(sid, []).append((report.nodeid.split("::")[-1], case, report.outcome))


@pytest.hookimpl(tryfirst=True)
def pytest_runtest_setup(item):
    sid = _scenario_of(item)
    if sid:
        doc = (item.function.__doc__ or "").strip().splitlines()
        item.user_properties.append(("scenario", sid))
        item.user_properties.append(("case", doc[0] if doc else ""))


def pytest_terminal_summary(terminalreporter, config):
    if not OUTCOMES:
        return
    elapsed = time.perf_counter() - STARTED[0]
    tr = terminalreporter
    tr.section("ATAM traceability")
    rows = []
    selected = set(config.getoption("--scenario")) or set(SCENARIOS)
    for sid, s in SCENARIOS.items():
        if sid not in selected:
            continue
        results = OUTCOMES.get(sid, [])
        passed = sum(1 for *_, o in results if o == "passed")
        status = "NOT COVERED" if not results else ("PASS" if passed == len(results) else "FAIL")
        rows.append({"id": sid, "attribute": s["attribute"], "refinement": s["refinement"],
                     "priority": f"({s['importance']},{s['difficulty']})", "tests": len(results),
                     "passed": passed, "status": status,
                     "cases": [{"test": t, "case": c, "outcome": o} for t, c, o in results]})
        name = f"{s['attribute']} · {s['refinement']}"
        tr.write_line(f"{sid}  {rows[-1]['priority']}  {name:48.48} {passed}/{len(results)}  {status}")
    tr.write_line(f"suite time {elapsed:.2f} s")
    out = Path(config.rootpath) / "out"
    out.mkdir(exist_ok=True)
    (out / "traceability.json").write_text(json.dumps({"suite_seconds": round(elapsed, 2), "scenarios": rows},
                                                      indent=2), encoding="utf-8")

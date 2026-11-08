"""Scenario S10: the marts are a contract with the dashboards that read them."""
import json
from pathlib import Path

import duckdb
import pytest

from tcg_dataapp import pipeline

from conftest import FakeClient

CONTRACT = Path(__file__).resolve().parents[2] / "docs" / "contracts" / "marts.json"


@pytest.mark.scenario("S10")
def test_s10_the_parquet_files_follow_the_contract(settings):
    """TC10.1 the Parquet files follow the contract"""
    pipeline.run(settings, client=FakeClient(), echo=lambda _: None)
    contract = json.loads(CONTRACT.read_text(encoding="utf-8"))
    con = duckdb.connect()
    for name, columns in contract.items():
        path = settings.out_dir / "marts" / f"{name}.parquet"
        actual = [[c, t] for c, t, *_ in con.execute(f"DESCRIBE SELECT * FROM '{path.as_posix()}'").fetchall()]
        assert actual == columns, f"{name}.parquet broke its contract"

"""Tests of the cost model. Run with: python3 -m pytest test_cost_model.py"""
import json
import shutil
import subprocess
from pathlib import Path

import pytest

from cost_model import HERE, estimate, expected_grid, load_prices

PRICES = load_prices()


def test_always_on_is_the_sum_of_its_lines_by_hand():
    # 730 h of t4g.small + 8 GB of gp3 + 730 h of public IPv4; 1 GB of egress is inside the free 100 GB
    res = estimate("ec2_always_on", PRICES)
    assert res["total"] == pytest.approx(730 * 0.0168 + 8 * 0.08 + 730 * 0.005)


def test_lambda_daily_run_is_inside_the_free_tier():
    res = estimate("lambda_s3", PRICES)
    compute = next(l for l in res["lines"] if l.item.startswith("Lambda compute"))
    assert compute.quantity == 0  # 30 runs x 40 s x 1 GB = 1,200 GB-s < 400,000
    assert res["total"] < 0.01


def test_without_free_tier_lambda_pays_every_gb_second():
    res = estimate("lambda_s3", PRICES, options={"free_tier": False})
    compute = next(l for l in res["lines"] if l.item.startswith("Lambda compute"))
    assert compute.quantity == 30 * 40 * 1


def test_fargate_bills_at_least_one_minute():
    res = estimate("fargate_s3", PRICES, {"run_seconds": 10}, {"start_seconds": 0})
    vcpu = res["lines"][0]
    assert vcpu.quantity == pytest.approx(30 * 60 / 3600 * 0.5)


def test_sao_paulo_costs_more_than_virginia_for_every_architecture():
    for arch in ("ec2_always_on", "ec2_scheduled", "fargate_s3", "fargate_rds"):
        us = estimate(arch, PRICES)["total"]
        sp = estimate(arch, PRICES, options={"region": "sa-east-1"})["total"]
        assert sp > us, arch


def test_commitment_lowers_the_always_on_instance():
    od = estimate("ec2_always_on", PRICES)["total"]
    ri = estimate("ec2_always_on", PRICES, options={"pricing": "commit_1y"})["total"]
    assert ri < od


def test_every_price_has_a_source():
    def walk(node):
        if isinstance(node, dict):
            if "usd" in node:
                assert node["offer"] and node["usagetype"] and node["published"]
            for v in node.values():
                walk(v)
    walk(PRICES["regions"])
    assert PRICES["consulted"] == "2026-11-08"


def test_expected_totals_file_is_current():
    stored = json.loads((HERE / "data" / "expected_totals.json").read_text())
    assert stored == expected_grid(PRICES)


@pytest.mark.skipif(shutil.which("node") is None, reason="node is not installed")
def test_the_browser_model_gives_the_same_totals():
    out = subprocess.run(["node", "check_js.mjs"], cwd=HERE, capture_output=True, text=True)
    assert out.returncode == 0, out.stdout + out.stderr

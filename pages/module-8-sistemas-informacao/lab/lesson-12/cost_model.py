"""Monthly cost of the tcg-dataapp workload under five AWS architectures.

The same rules are written in cost_model.js, which the lab page runs; check_js.mjs
proves that both give the same totals. Every price comes from data/prices.json
(AWS Price List, consulted on 2026-11-08).

    python3 cost_model.py                       # the five architectures in us-east-1, on-demand
    python3 cost_model.py --region sa-east-1 --pricing commit_1y --runs 720
    python3 cost_model.py --write-expected      # regenerate data/expected_totals.json
"""
from __future__ import annotations

import argparse
import itertools
import json
from dataclasses import dataclass
from pathlib import Path

HERE = Path(__file__).resolve().parent
HOURS_PER_MONTH = 730

ARCHITECTURES = {
    "ec2_always_on": "A · EC2 always on",
    "ec2_scheduled": "B · EC2 started for each run",
    "lambda_s3": "C · Lambda + Scheduler + S3",
    "fargate_s3": "D · Fargate task + Scheduler + S3",
    "fargate_rds": "E · Fargate task + RDS PostgreSQL",
}

# Measured on 08/11/2026 with tcg-dataapp 0.1.0 (Lesson 7); 40 s is the reference duration of Lesson 7.
DEFAULT_WORKLOAD = {
    "runs_per_month": 30,
    "run_seconds": 40,
    "memory_gb": 1,
    "storage_gb": 0.002,
    "egress_gb": 1,
    "reader_downloads": 300,
}

DEFAULT_OPTIONS = {
    "region": "us-east-1",
    "pricing": "on_demand",
    "free_tier": True,
    "ec2_type": "t4g.small",
    "ebs_gb": 8,
    "boot_seconds": 60,
    "fargate_vcpu": 0.5,
    "fargate_gb": 1,
    "start_seconds": 30,
    "image_gb": 0.3,
    "s3_class": "standard",
    "rds_storage_gb": 20,
    "puts_per_run": 5,
    "gets_per_run": 1,
}


@dataclass
class Line:
    item: str
    quantity: float
    unit: str
    price: float
    note: str = ""

    @property
    def cost(self) -> float:
        return self.quantity * self.price


def load_prices(path: Path = HERE / "data" / "prices.json") -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def _paid(quantity: float, allowance: float, o: dict) -> float:
    return max(0, quantity - allowance) if o["free_tier"] else quantity


def _ec2_rate(r: dict, o: dict) -> tuple[float, str]:
    t = r["ec2"].get(o["ec2_type"])
    if t is None:
        raise ValueError(f"unknown instance type {o['ec2_type']}")
    if o["pricing"] == "commit_1y":
        return t["commit_1y"]["usd"], "reserved 1 yr, no upfront"
    if o["pricing"] == "spot":
        pct = t["spot_savings_pct"]["pct"]
        return t["on_demand"]["usd"] * (1 - pct / 100), f"spot estimate, {pct}% below on-demand"
    return t["on_demand"]["usd"], "on-demand"


def _egress(prices: dict, r: dict, w: dict, o: dict) -> Line:
    gb = _paid(w["egress_gb"], prices["free_allowances"]["egress_internet_gb"], o)
    return Line("Data transfer out to the internet", gb, "GB", r["egress_internet_gb"]["usd"], "after the free 100 GB" if o["free_tier"] else "")


def _scheduler(prices: dict, r: dict, invocations: float, o: dict) -> Line:
    n = _paid(invocations, prices["free_allowances"]["scheduler_invocations"], o)
    return Line("EventBridge Scheduler invocations", n, "invocations", r["scheduler_invocation"]["usd"], "first 14 million free" if o["free_tier"] else "")


def _s3(r: dict, w: dict, o: dict) -> list[Line]:
    ia = o["s3_class"] == "ia"
    return [
        Line(f"S3 storage ({'Standard-IA' if ia else 'Standard'})", w["storage_gb"], "GB-month", r["s3_ia_gb_month" if ia else "s3_standard_gb_month"]["usd"]),
        Line("S3 PUT requests", w["runs_per_month"] * o["puts_per_run"], "requests", r["s3_put_request"]["usd"]),
        Line("S3 GET requests", w["runs_per_month"] * o["gets_per_run"] + w["reader_downloads"], "requests", r["s3_get_request"]["usd"]),
    ]


def _fargate(r: dict, w: dict, o: dict) -> list[Line]:
    billed = max(60, w["run_seconds"] + o["start_seconds"])
    hours = w["runs_per_month"] * billed / 3600
    commit = o["pricing"] == "commit_1y"
    note = "Compute Savings Plan 1 yr" if commit else "Fargate Spot is not in the price list: on-demand" if o["pricing"] == "spot" else "on-demand"
    return [
        Line("Fargate vCPU (ARM)", hours * o["fargate_vcpu"], "vCPU-hours", r["fargate_arm_vcpu_hour_commit_1y" if commit else "fargate_arm_vcpu_hour"]["usd"], note),
        Line("Fargate memory (ARM)", hours * o["fargate_gb"], "GB-hours", r["fargate_arm_gb_hour_commit_1y" if commit else "fargate_arm_gb_hour"]["usd"], note),
        Line("Public IPv4 of the task", hours, "hours", r["public_ipv4_hour"]["usd"]),
        Line("ECR image storage", o["image_gb"], "GB-month", r["ecr_gb_month"]["usd"]),
    ]


def estimate(arch: str, prices: dict, workload: dict | None = None, options: dict | None = None) -> dict:
    w = {**DEFAULT_WORKLOAD, **(workload or {})}
    o = {**DEFAULT_OPTIONS, **(options or {})}
    r = prices["regions"].get(o["region"])
    if r is None:
        raise ValueError(f"unknown region {o['region']}")
    if arch == "ec2_always_on":
        rate, note = _ec2_rate(r, o)
        lines = [
            Line(f"EC2 {o['ec2_type']}", HOURS_PER_MONTH, "hours", rate, note),
            Line("EBS gp3 volume", o["ebs_gb"], "GB-month", r["ebs_gp3_gb_month"]["usd"]),
            Line("Public IPv4 address", HOURS_PER_MONTH, "hours", r["public_ipv4_hour"]["usd"]),
            _egress(prices, r, w, o),
        ]
    elif arch == "ec2_scheduled":
        rate, note = _ec2_rate(r, o)
        hours = w["runs_per_month"] * max(60, w["run_seconds"] + o["boot_seconds"]) / 3600
        lines = [
            Line(f"EC2 {o['ec2_type']}", hours, "hours", rate, note),
            Line("EBS gp3 volume (billed while stopped)", o["ebs_gb"], "GB-month", r["ebs_gp3_gb_month"]["usd"]),
            Line("Public IPv4 address (only while running)", hours, "hours", r["public_ipv4_hour"]["usd"]),
            _scheduler(prices, r, w["runs_per_month"] * 2, o),
            _egress(prices, r, w, o),
        ]
    elif arch == "lambda_s3":
        commit = o["pricing"] == "commit_1y"
        gbs = _paid(w["runs_per_month"] * w["run_seconds"] * w["memory_gb"], prices["free_allowances"]["lambda_gb_seconds"], o)
        requests = _paid(w["runs_per_month"], prices["free_allowances"]["lambda_requests"], o)
        note = "Compute Savings Plan 1 yr" if commit else "no Spot for Lambda: on-demand" if o["pricing"] == "spot" else "on-demand"
        lines = [
            Line("Lambda compute (ARM)", gbs, "GB-seconds", r["lambda_arm_gb_second_commit_1y" if commit else "lambda_arm_gb_second"]["usd"],
                 f"{note}, after 400,000 free" if o["free_tier"] else note),
            Line("Lambda requests", requests, "requests", r["lambda_request"]["usd"], "first million free" if o["free_tier"] else ""),
            *_s3(r, w, o),
            _scheduler(prices, r, w["runs_per_month"], o),
            _egress(prices, r, w, o),
        ]
    elif arch in ("fargate_s3", "fargate_rds"):
        lines = [*_fargate(r, w, o), *_s3(r, w, o), _scheduler(prices, r, w["runs_per_month"], o), _egress(prices, r, w, o)]
        if arch == "fargate_rds":
            commit = o["pricing"] == "commit_1y"
            rds = r["rds_pg_t4g_micro"]
            lines += [
                Line("RDS PostgreSQL db.t4g.micro, Single-AZ", HOURS_PER_MONTH, "hours", rds["commit_1y" if commit else "on_demand"]["usd"],
                     "reserved 1 yr, no upfront" if commit else "no Spot for RDS: on-demand" if o["pricing"] == "spot" else "on-demand"),
                Line("RDS gp3 storage", o["rds_storage_gb"], "GB-month", r["rds_gp3_gb_month"]["usd"]),
            ]
    else:
        raise ValueError(f"unknown architecture {arch}")
    total = 0
    for item in lines:
        total += item.cost
    return {"arch": arch, "region": o["region"], "pricing": o["pricing"], "lines": lines, "total": total}


def expected_grid(prices: dict) -> list[dict]:
    """Totals of every architecture over regions, pricing models, free tier and three run frequencies."""
    rows = []
    for arch, region, pricing, free, runs in itertools.product(
        ARCHITECTURES, prices["regions"], ["on_demand", "commit_1y", "spot"], [True, False], [30, 720, 8640]
    ):
        result = estimate(arch, prices, {"runs_per_month": runs}, {"region": region, "pricing": pricing, "free_tier": free})
        rows.append({"arch": arch, "region": region, "pricing": pricing, "free_tier": free, "runs_per_month": runs, "total": result["total"]})
    return rows


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--region", default="us-east-1", choices=["us-east-1", "sa-east-1"])
    ap.add_argument("--pricing", default="on_demand", choices=["on_demand", "commit_1y", "spot"])
    ap.add_argument("--runs", type=int, default=30, help="runs per month")
    ap.add_argument("--no-free-tier", action="store_true")
    ap.add_argument("--write-expected", action="store_true")
    args = ap.parse_args()
    prices = load_prices()
    if args.write_expected:
        path = HERE / "data" / "expected_totals.json"
        path.write_text(json.dumps(expected_grid(prices), indent=0) + "\n", encoding="utf-8")
        print("wrote", path)
        return
    for arch, label in ARCHITECTURES.items():
        res = estimate(arch, prices, {"runs_per_month": args.runs},
                       {"region": args.region, "pricing": args.pricing, "free_tier": not args.no_free_tier})
        print(f"\n{label} · {args.region} · {args.pricing} · USD {res['total']:.2f} per month")
        for item in res["lines"]:
            print(f"  {item.item:<44} {item.quantity:>14,.4f} {item.unit:<12} × {item.price:<12.10g} = {item.cost:>9.4f}  {item.note}")


if __name__ == "__main__":
    main()

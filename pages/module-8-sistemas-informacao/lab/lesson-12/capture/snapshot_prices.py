"""Snapshot of the AWS unit prices used by the Lesson 12 lab.

Reads the public AWS Price List (no account or key is needed) and writes
data/prices.json with one entry per unit price: the value in USD, the unit,
the offer and usage type it came from and the publication date of that offer.

    python3 capture/snapshot_prices.py --raw /tmp/aws-prices

The raw files are kept in --raw so that a second run does not download them
again. The EC2 offer is about 480 MB per region and the Savings Plans offer
about 440 MB, so the EC2 list is read as CSV in a stream and filtered on the
fly, and the Savings Plans files are deleted after they are read.
"""
from __future__ import annotations

import argparse
import csv
import io
import json
import urllib.request
from pathlib import Path

BASE = "https://pricing.us-east-1.amazonaws.com"
OFFERS = f"{BASE}/offers/v1.0/aws"
REGIONS = {"us-east-1": "USE1-", "sa-east-1": "SAE1-"}
EC2_TYPES = ["t4g.micro", "t4g.small", "t4g.medium", "t3.small", "t3.medium", "m7g.large"]
CONSULTED = "2026-11-08"


def fetch(url: str, path: Path) -> Path:
    if not path.exists():
        path.parent.mkdir(parents=True, exist_ok=True)
        urllib.request.urlretrieve(url, path)
    return path


def offer(raw: Path, service: str, region: str) -> dict:
    return json.loads(fetch(f"{OFFERS}/{service}/current/{region}/index.json", raw / f"{service}-{region}.json").read_text())


def on_demand(doc: dict, usagetype: str, begin: str = "0", **attrs) -> tuple[float, str, str]:
    """First OnDemand price of a usage type (and attributes) whose range starts at `begin`."""
    for sku, terms in doc["terms"]["OnDemand"].items():
        a = doc["products"][sku]["attributes"]
        if a.get("usagetype") != usagetype or any(a.get(k) != v for k, v in attrs.items()):
            continue
        for term in terms.values():
            for dim in term["priceDimensions"].values():
                if dim.get("beginRange", "0") == begin:
                    return float(dim["pricePerUnit"]["USD"]), dim["unit"], dim["description"].strip()
    raise LookupError(f"{usagetype} {attrs} not found")


def entry(value, unit, offer_code, usagetype, published, note=""):
    item = {"usd": value, "unit": unit, "offer": offer_code, "usagetype": usagetype, "published": published}
    if note:
        item["note"] = note
    return item


def ec2_prices(region: str) -> tuple[dict, dict, str]:
    """On-demand and 1-year no-upfront reserved prices of the instance types, and gp3, streamed from the CSV."""
    url = f"{OFFERS}/AmazonEC2/current/{region}/index.csv"
    with urllib.request.urlopen(url) as response:
        lines = io.TextIOWrapper(response, encoding="utf-8")
        meta = [next(lines) for _ in range(5)]
        published = meta[2].split(",")[1].strip().strip('"')
        types, gp3 = {}, None
        for row in csv.DictReader(lines):
            family = row["Product Family"]
            if family == "Storage" and row["Volume API Name"] == "gp3" and row["TermType"] == "OnDemand":
                gp3 = entry(float(row["PricePerUnit"]), row["Unit"], "AmazonEC2", row["usageType"], published)
            if family != "Compute Instance" or row["Instance Type"] not in EC2_TYPES:
                continue
            if (row["Operating System"], row["Tenancy"], row["Pre Installed S/W"], row["CapacityStatus"]) != ("Linux", "Shared", "NA", "Used"):
                continue
            t = types.setdefault(row["Instance Type"], {"vcpu": int(row["vCPU"]), "memory": row["Memory"]})
            if row["TermType"] == "OnDemand":
                t["on_demand"] = entry(float(row["PricePerUnit"]), "Hrs", "AmazonEC2", row["usageType"], published)
            elif (row["LeaseContractLength"], row["PurchaseOption"], row["OfferingClass"]) == ("1yr", "No Upfront", "standard"):
                t["commit_1y"] = entry(float(row["PricePerUnit"]), "Hrs", "AmazonEC2", row["usageType"], published,
                                       "Reserved Instance, standard, 1 year, no upfront")
    return types, gp3, published


def compute_savings_plan(raw: Path, region: str, usagetypes: list[str]) -> dict:
    index = json.loads(fetch(f"{BASE}/savingsPlan/v1.0/aws/AWSComputeSavingsPlan/current/region_index.json", raw / "sp-index.json").read_text())
    version = next(r["versionUrl"] for r in index["regions"] if r["regionCode"] == region)
    path = fetch(BASE + version, raw / f"sp-{region}.json")
    doc = json.loads(path.read_text())
    products = {p["sku"]: p for p in doc["products"]}
    found = {}
    for term in doc["terms"]["savingsPlan"]:
        p = products[term["sku"]]
        a = p["attributes"]
        if p["productFamily"] != "ComputeSavingsPlans" or a.get("purchaseTerm") != "1yr" or a.get("purchaseOption") != "No Upfront":
            continue
        for rate in term["rates"]:
            if rate["discountedUsageType"] in usagetypes:
                found[rate["discountedUsageType"]] = entry(float(rate["discountedRate"]["price"]), rate["unit"], "AWSComputeSavingsPlan",
                                                           rate["discountedUsageType"], doc["publicationDate"],
                                                           "Compute Savings Plan, 1 year, no upfront")
    path.unlink()
    return found


def region_prices(raw: Path, region: str, spot: dict) -> dict:
    p = REGIONS[region]
    us = region == "us-east-1"
    out: dict = {}

    types, gp3, _ = ec2_prices(region)
    for name, t in types.items():
        advisor = spot["spot_advisor"][region]["Linux"].get(name)
        if advisor:
            t["spot_savings_pct"] = {"pct": advisor["s"], "source": "spot-bid-advisor.s3.amazonaws.com/spot-advisor-data.json",
                                     "note": "average saving of Spot over On-Demand, from the Spot Instance Advisor; Spot prices change"}
    out["ec2"] = types
    out["ebs_gp3_gb_month"] = gp3

    vpc = offer(raw, "AmazonVPC", region)
    ut = f"{p}PublicIPv4:InUseAddress"
    v, unit, _ = on_demand(vpc, ut)
    out["public_ipv4_hour"] = entry(v, unit, "AmazonVPC", ut, vpc["publicationDate"])

    lam = offer(raw, "AWSLambda", region)
    pre = "" if us else p
    for key, ut in [("lambda_arm_gb_second", f"{pre}Lambda-GB-Second-ARM"), ("lambda_request", f"{pre}Request-ARM")]:
        v, unit, _ = on_demand(lam, ut)
        out[key] = entry(v, unit, "AWSLambda", ut, lam["publicationDate"])

    ecs = offer(raw, "AmazonECS", region)
    for key, ut in [("fargate_arm_vcpu_hour", f"{p}Fargate-ARM-vCPU-Hours:perCPU"), ("fargate_arm_gb_hour", f"{p}Fargate-ARM-GB-Hours")]:
        v, unit, _ = on_demand(ecs, ut)
        out[key] = entry(v, unit, "AmazonECS", ut, ecs["publicationDate"])

    s3 = offer(raw, "AmazonS3", region)
    for key, ut in [("s3_standard_gb_month", f"{pre}TimedStorage-ByteHrs"), ("s3_ia_gb_month", f"{pre}TimedStorage-SIA-ByteHrs"),
                    ("s3_put_request", f"{pre}Requests-Tier1"), ("s3_get_request", f"{pre}Requests-Tier2")]:
        v, unit, _ = on_demand(s3, ut)
        out[key] = entry(v, unit, "AmazonS3", ut, s3["publicationDate"])

    ev = offer(raw, "AWSEvents", region)
    ut = f"{p}ScheduledInvocation"
    v, unit, _ = on_demand(ev, ut, begin="14000000")
    out["scheduler_invocation"] = entry(v, unit, "AWSEvents", ut, ev["publicationDate"], "EventBridge Scheduler, after the first 14 million per month")

    ecr = offer(raw, "AmazonECR", region)
    v, unit, _ = on_demand(ecr, "TimedStorage-ByteHrs" if us else f"{p}TimedStorage-ByteHrs")
    out["ecr_gb_month"] = entry(v, unit, "AmazonECR", "TimedStorage-ByteHrs" if us else f"{p}TimedStorage-ByteHrs", ecr["publicationDate"])

    dt = offer(raw, "AWSDataTransfer", region)
    ut = f"{pre}DataTransfer-Out-Bytes"
    v, unit, _ = on_demand(dt, ut)
    out["egress_internet_gb"] = entry(v, unit, "AWSDataTransfer", ut, dt["publicationDate"], "first 10 TB per month, after the global free 100 GB")

    rds = offer(raw, "AmazonRDS", region)
    ut = f"{pre}InstanceUsage:db.t4g.micro"
    v, unit, _ = on_demand(rds, ut, databaseEngine="PostgreSQL", deploymentOption="Single-AZ")
    micro = {"on_demand": entry(v, unit, "AmazonRDS", ut, rds["publicationDate"])}
    for sku, terms in rds["terms"]["Reserved"].items():
        a = rds["products"][sku]["attributes"]
        if a.get("usagetype") == ut and a.get("databaseEngine") == "PostgreSQL" and a.get("deploymentOption") == "Single-AZ":
            for term in terms.values():
                ta = term["termAttributes"]
                if ta["LeaseContractLength"] == "1yr" and ta["PurchaseOption"] == "No Upfront":
                    for dim in term["priceDimensions"].values():
                        micro["commit_1y"] = entry(float(dim["pricePerUnit"]["USD"]), dim["unit"], "AmazonRDS", ut, rds["publicationDate"],
                                                   "Reserved Instance, 1 year, no upfront")
    out["rds_pg_t4g_micro"] = micro
    ut = f"{pre}RDS:GP3-Storage"
    v, unit, _ = on_demand(rds, ut)
    out["rds_gp3_gb_month"] = entry(v, unit, "AmazonRDS", ut, rds["publicationDate"])

    sp = compute_savings_plan(raw, region, [out["lambda_arm_gb_second"]["usagetype"], out["fargate_arm_vcpu_hour"]["usagetype"],
                                            out["fargate_arm_gb_hour"]["usagetype"]])
    out["lambda_arm_gb_second_commit_1y"] = sp[out["lambda_arm_gb_second"]["usagetype"]]
    out["fargate_arm_vcpu_hour_commit_1y"] = sp[out["fargate_arm_vcpu_hour"]["usagetype"]]
    out["fargate_arm_gb_hour_commit_1y"] = sp[out["fargate_arm_gb_hour"]["usagetype"]]
    return out


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--raw", type=Path, required=True, help="folder for the downloaded offers")
    ap.add_argument("--out", type=Path, default=Path(__file__).resolve().parents[1] / "data" / "prices.json")
    args = ap.parse_args()
    spot = json.loads(fetch("https://spot-bid-advisor.s3.amazonaws.com/spot-advisor-data.json", args.raw / "spot-advisor.json").read_text())
    lam = offer(args.raw, "AWSLambda", "us-east-1")
    free_lambda_gbs = on_demand(lam, "Global-Lambda-GB-Second")
    snapshot = {
        "consulted": CONSULTED,
        "currency": "USD",
        "source": "AWS Price List Bulk API, https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/index.json",
        "free_allowances": {
            "lambda_requests": 1_000_000, "lambda_gb_seconds": 400_000, "egress_internet_gb": 100, "scheduler_invocations": 14_000_000,
            "fargate_ephemeral_gb": 20,
            "note": "Lambda, egress and Scheduler allowances are the zero-price first tiers of the price list; "
                    f"Lambda: '{free_lambda_gbs[2]}'. The first 20 GB of Fargate ephemeral storage are included in the task price.",
        },
        "regions": {r: region_prices(args.raw, r, spot) for r in REGIONS},
    }
    args.out.write_text(json.dumps(snapshot, indent=1) + "\n")
    print("wrote", args.out, args.out.stat().st_size, "bytes")


if __name__ == "__main__":
    main()

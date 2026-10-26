"""Generate the Bronze layer of the pharmacy chain in the local MinIO.

Lesson 4 · ETL: Object Storage to Data Warehouse · Module 8 · Information Systems · Inteli

The script writes, for each ingestion day, what the three sources of the case deliver:

  bronze/source=pos/entity=sale_line/ingestion_date=D/batch_2300.json       newline-delimited JSON
  bronze/source=erp/entity=stock_position/ingestion_date=D/extract.parquet  Parquet, typed
  bronze/source=supplier/entity=delivery/ingestion_date=D/acme_0930.csv     CSV, ';', Latin-1
  bronze/source=erp/entity=store/ingestion_date=FIRST/store.csv             master data, once
  bronze/source=erp/entity=product/ingestion_date=FIRST/product.csv         master data, once

The data is synthetic and deterministic (fixed seed per day). Each source carries the
defects that the Silver layer must treat, and the script prints how many were planted,
so that the pipeline can be checked against known numbers.

Usage:
  python generate_bronze.py                   # 14 days, 2026-10-12 to 2026-10-25
  python generate_bronze.py --day 2026-10-26  # one more day, to test the incremental load
"""

from __future__ import annotations

import argparse
import csv
import io
import json
import os
import random
import tempfile
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

import boto3
import duckdb
from dotenv import load_dotenv

BRT = timezone(timedelta(hours=-3))

STORES = [
    (1, "CMP-01", "Campinas", "Interior"),
    (2, "STS-02", "Santos", "Coast"),
    (3, "SOR-03", "Sorocaba", "Interior"),
    (4, "JUN-04", "Jundiaí", "Interior"),
    (5, "BAU-05", "Bauru", "Interior"),
    (6, "FRA-06", "Franca", "Interior"),
]
N_PRODUCTS = 40
FIRST_DAY = date(2026, 10, 12)
DAYS = 14
OUTAGE_DAY = date(2026, 10, 17)   # JUN-04 loses its connection during this day
OUTAGE_STORE = "JUN-04"


def products() -> list[tuple[int, str, bool, float]]:
    rng = random.Random(2026)
    out = []
    for pid in range(1, N_PRODUCTS + 1):
        continuous = rng.random() < 0.4
        price = round(rng.uniform(6, 120), 2)
        out.append((pid, f"Product {pid:02d}", continuous, price))
    return out


def fake_cpf(rng: random.Random) -> str:
    d = [rng.randint(0, 9) for _ in range(11)]
    return f"{d[0]}{d[1]}{d[2]}.{d[3]}{d[4]}{d[5]}.{d[6]}{d[7]}{d[8]}-{d[9]}{d[10]}"


def dirty_code(code: str, rng: random.Random) -> str:
    """About 10% of the POS lines carry the store code in another case or with spaces."""
    r = rng.random()
    if r < 0.04:
        return code.lower()
    if r < 0.07:
        return f" {code} "
    if r < 0.10:
        return code.title()
    return code


def sale_lines(day: date, per_day: int, counts: dict) -> list[dict]:
    rng = random.Random(f"pos-{day.isoformat()}")
    prods = products()
    lines = []
    seq = {s[1]: 0 for s in STORES}
    for _ in range(per_day):
        store_id, code, _, _ = rng.choice(STORES)
        seq[code] += 1
        pid, _, _, price = rng.choice(prods)
        if rng.random() < 0.003:
            pid = rng.choice([41, 42])                      # orphan product
            counts["orphan_product"] += 1
        qty = rng.choice([1, 1, 1, 2, 2, 3])
        if rng.random() < 0.002:
            qty = rng.choice([0, -1])                       # invalid quantity
            counts["invalid_quantity"] += 1
        ts = datetime(day.year, day.month, day.day, 8, 0, tzinfo=BRT) + timedelta(seconds=rng.randint(0, 13 * 3600))
        if code == "BAU-05":                                # this terminal sends local text dates
            sold_at = ts.strftime("%d/%m/%Y %H:%M:%S")
            counts["br_date_format"] += 1
        else:
            sold_at = ts.isoformat()
        unit_price: float | str = price
        if code == "SOR-03":                                # this terminal sends prices as text
            unit_price = f"{price:.2f}".replace(".", ",")
            counts["comma_decimal"] += 1
        raw_code = dirty_code(code, rng)
        if raw_code != code:
            counts["dirty_store_code"] += 1
        lines.append({
            "sale_id": f"{code}-{day:%Y%m%d}-{seq[code]:05d}",
            "store_code": raw_code,
            "terminal_id": f"{code}-T{rng.randint(1, 3)}",
            "product_id": pid,
            "quantity": qty,
            "unit_price": unit_price,
            "sold_at": sold_at,
            "customer_cpf": fake_cpf(rng),
        })
    return lines


def post_twice(lines: list[dict], day: date, counts: dict) -> list[dict]:
    """About 1% of the lines of a batch are posted twice in the same file."""
    rng = random.Random(f"dup-{day.isoformat()}")
    doubles = rng.sample(lines, k=max(1, len(lines) // 100))
    counts["double_posted"] += len(doubles)
    out = lines + [dict(x) for x in doubles]
    rng.shuffle(out)
    return out


def stock_rows(day: date, counts: dict) -> list[tuple]:
    rng = random.Random(f"erp-{day.isoformat()}")
    extracted_at = datetime(day.year, day.month, day.day, 23, 50)
    rows = []
    for store_id, code, _, _ in STORES:
        for pid in range(1, N_PRODUCTS + 1):
            on_hand: int | None = max(0, int(rng.gauss(12, 5)))
            if rng.random() < 0.06:
                on_hand = 0
            if code == "JUN-04" and rng.random() < 0.2:      # store without daily count
                on_hand = None
                counts["null_on_hand"] += 1
            rows.append((store_id, pid, day, on_hand, extracted_at))
    for i in rng.sample(range(len(rows)), k=1):              # invariant violation
        s, p, d, _, e = rows[i]
        rows[i] = (s, p, d, -rng.randint(1, 3), e)
        counts["negative_on_hand"] += 1
    # audit corrections of the stock two days earlier arrive in today's extract
    if day - timedelta(days=2) >= FIRST_DAY:
        old = day - timedelta(days=2)
        for _ in range(5):
            store_id = rng.choice(STORES)[0]
            pid = rng.randint(1, N_PRODUCTS)
            rows.append((store_id, pid, old, rng.randint(0, 20), extracted_at))
            counts["audit_correction"] += 1
    return rows


def delivery_rows(day: date, counts: dict) -> list[list[str]]:
    rng = random.Random(f"sup-{day.isoformat()}")
    rows = []
    for n in range(rng.randint(15, 25)):
        code = rng.choice(STORES)[1]
        qty = str(rng.randint(5, 60))
        if rng.random() < 0.04:
            qty = ""                                        # missing quantity
            counts["missing_delivery_qty"] += 1
        cost = f"{rng.uniform(3, 90):.2f}".replace(".", ",")
        rows.append([
            f"ACME-{day:%Y%m%d}-{n + 1:03d}",
            "ACME Distribuição Farmacêutica",
            f"  {code}" if rng.random() < 0.1 else code,
            str(rng.randint(1, N_PRODUCTS)),
            qty,
            cost,
            day.strftime("%d/%m/%Y"),
        ])
    return rows


def parquet_bytes(rows: list[tuple]) -> bytes:
    con = duckdb.connect()
    con.execute(
        "CREATE TABLE t (store_id INTEGER, product_id INTEGER, date DATE, on_hand INTEGER, extracted_at TIMESTAMP)"
    )
    con.executemany("INSERT INTO t VALUES (?, ?, ?, ?, ?)", rows)
    with tempfile.TemporaryDirectory() as tmp:
        path = Path(tmp) / "extract.parquet"
        con.execute(f"COPY t TO '{path.as_posix()}' (FORMAT parquet)")
        con.close()
        return path.read_bytes()


def csv_bytes(header: list[str], rows: list[list], sep: str = ",", encoding: str = "utf-8") -> bytes:
    buf = io.StringIO()
    w = csv.writer(buf, delimiter=sep, lineterminator="\n")
    w.writerow(header)
    w.writerows(rows)
    return buf.getvalue().encode(encoding)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--day", type=date.fromisoformat, help="generate only this ingestion day")
    parser.add_argument("--sales-per-day", type=int, default=1500)
    args = parser.parse_args()

    load_dotenv()
    bucket = os.environ.get("LAKE_BUCKET", "pharmacy-lake")
    scheme = "https" if os.environ.get("S3_USE_SSL", "false").lower() == "true" else "http"
    s3 = boto3.client(
        "s3",
        endpoint_url=f"{scheme}://{os.environ['S3_ENDPOINT']}",
        aws_access_key_id=os.environ["S3_ACCESS_KEY"],
        aws_secret_access_key=os.environ["S3_SECRET_KEY"],
        region_name=os.environ.get("S3_REGION", "us-east-1"),
    )
    existing = [b["Name"] for b in s3.list_buckets().get("Buckets", [])]
    if bucket not in existing:
        s3.create_bucket(Bucket=bucket)

    def put(key: str, body: bytes, content_type: str) -> None:
        s3.put_object(Bucket=bucket, Key=key, Body=body, ContentType=content_type)

    days = [args.day] if args.day else [FIRST_DAY + timedelta(days=i) for i in range(DAYS)]
    counts = {k: 0 for k in [
        "sale_lines_sent", "double_posted", "resent_lines", "orphan_product", "invalid_quantity",
        "br_date_format", "comma_decimal", "dirty_store_code", "stock_rows", "null_on_hand",
        "negative_on_hand", "audit_correction", "deliveries", "missing_delivery_qty",
    ]}
    objects = 0

    if not args.day:
        put(f"bronze/source=erp/entity=store/ingestion_date={FIRST_DAY}/store.csv",
            csv_bytes(["store_id", "store_code", "city", "region"], [list(s) for s in STORES]), "text/csv")
        put(f"bronze/source=erp/entity=product/ingestion_date={FIRST_DAY}/product.csv",
            csv_bytes(["product_id", "name", "continuous_use", "list_price"],
                      [[p, n, str(c).lower(), f"{pr:.2f}"] for p, n, c, pr in products()]), "text/csv")
        objects += 2

    for day in days:
        lines = sale_lines(day, args.sales_per_day, counts)
        if day == OUTAGE_DAY:
            # the terminal of JUN-04 sends only 60% of the day before losing its connection ...
            outage = [x for x in lines if x["sale_id"].startswith(OUTAGE_STORE)]
            keep = outage[: int(len(outage) * 0.6)]
            lines = [x for x in lines if not x["sale_id"].startswith(OUTAGE_STORE)] + keep
            # ... and resends the whole day the next morning, in the folder of the next day
            resend = "\n".join(json.dumps(x, ensure_ascii=False) for x in outage).encode("utf-8")
            put(f"bronze/source=pos/entity=sale_line/ingestion_date={day + timedelta(days=1)}/batch_0815_resend.json",
                resend, "application/x-ndjson")
            counts["resent_lines"] += len(outage)
            objects += 1
        lines = post_twice(lines, day, counts)
        counts["sale_lines_sent"] += len(lines)
        body = "\n".join(json.dumps(x, ensure_ascii=False) for x in lines).encode("utf-8")
        put(f"bronze/source=pos/entity=sale_line/ingestion_date={day}/batch_2300.json", body, "application/x-ndjson")

        rows = stock_rows(day, counts)
        counts["stock_rows"] += len(rows)
        put(f"bronze/source=erp/entity=stock_position/ingestion_date={day}/extract.parquet",
            parquet_bytes(rows), "application/vnd.apache.parquet")

        deliveries = delivery_rows(day, counts)
        counts["deliveries"] += len(deliveries)
        header = ["id_entrega", "fornecedor", "loja", "produto", "quantidade", "custo_unitario", "data_entrega"]
        put(f"bronze/source=supplier/entity=delivery/ingestion_date={day}/acme_0930.csv",
            csv_bytes(header, deliveries, sep=";", encoding="latin-1") + b"\n", "text/csv")
        objects += 3

    print(f"Bronze written to s3://{bucket}/bronze/ - {len(days)} day(s) - {objects} objects")
    print("Planted in the data (the Silver layer must account for each one):")
    for k, v in counts.items():
        print(f"  {k:<22}{v:>8}")


if __name__ == "__main__":
    main()

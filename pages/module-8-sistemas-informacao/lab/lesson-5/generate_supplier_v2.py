"""Write the second version of the supplier file into the Bronze layer.

Lesson 5 · Data Warehouses · Module 8 · Information Systems · Inteli

From 2026-10-26 on, the supplier ACME sends its daily file with two more columns,
the lot number (lote) and the expiry date (validade). Everything else stays as in
version 1: ';' as separator, Latin-1, comma as decimal mark and dd/mm/yyyy dates.

  bronze/source=supplier/entity=delivery/ingestion_date=2026-10-26/acme_v2_0930.csv

The data is synthetic and deterministic. The script prints how many rows it wrote and
how many lots expire in less than 90 days after the delivery, which is the expected
answer of the tactical query of Step 04.

Usage:
  python generate_supplier_v2.py                    # day 2026-10-26
  python generate_supplier_v2.py --day 2026-10-27   # another day of version 2
"""

from __future__ import annotations

import argparse
import csv
import io
import os
import random
from datetime import date, timedelta

import boto3
from dotenv import load_dotenv

STORE_CODES = ["CMP-01", "STS-02", "SOR-03", "JUN-04", "BAU-05", "FRA-06"]
N_PRODUCTS = 40
HEADER = ["id_entrega", "fornecedor", "loja", "produto", "quantidade", "custo_unitario",
          "data_entrega", "lote", "validade"]


def rows_for(day: date) -> tuple[list[list[str]], int]:
    rng = random.Random(f"sup-v2-{day.isoformat()}")
    rows, short_expiry = [], 0
    for n in range(rng.randint(18, 24)):
        code = rng.choice(STORE_CODES)
        days_to_expiry = rng.choice([45, 60, 75, 120, 180, 365, 540, 720])
        if days_to_expiry < 90:
            short_expiry += 1
        rows.append([
            f"ACME-{day:%Y%m%d}-{n + 1:03d}",
            "ACME Distribuição Farmacêutica",
            code,
            str(rng.randint(1, N_PRODUCTS)),
            str(rng.randint(5, 60)),
            f"{rng.uniform(3, 90):.2f}".replace(".", ","),
            day.strftime("%d/%m/%Y"),
            f"L{day:%y%m}{rng.randint(1000, 9999)}",
            (day + timedelta(days=days_to_expiry)).strftime("%d/%m/%Y"),
        ])
    return rows, short_expiry


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--day", type=date.fromisoformat, default=date(2026, 10, 26))
    args = parser.parse_args()

    load_dotenv()
    scheme = "https" if os.environ.get("S3_USE_SSL", "false").lower() == "true" else "http"
    s3 = boto3.client(
        "s3",
        endpoint_url=f"{scheme}://{os.environ['S3_ENDPOINT']}",
        aws_access_key_id=os.environ["S3_ACCESS_KEY"],
        aws_secret_access_key=os.environ["S3_SECRET_KEY"],
        region_name=os.environ.get("S3_REGION", "us-east-1"),
    )
    bucket = os.environ.get("LAKE_BUCKET", "pharmacy-lake")

    rows, short_expiry = rows_for(args.day)
    buf = io.StringIO()
    writer = csv.writer(buf, delimiter=";", lineterminator="\n")
    writer.writerow(HEADER)
    writer.writerows(rows)
    key = f"bronze/source=supplier/entity=delivery/ingestion_date={args.day}/acme_v2_0930.csv"
    s3.put_object(Bucket=bucket, Key=key, Body=buf.getvalue().encode("latin-1"), ContentType="text/csv")

    print(f"Written s3://{bucket}/{key}")
    print(f"  deliveries_v2          {len(rows):>6}")
    print(f"  expiry_under_90_days   {short_expiry:>6}")


if __name__ == "__main__":
    main()

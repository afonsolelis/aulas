"""Load the Bronze layer of the Olist case into the local object storage (S3 API).

Lesson 5 · Module 8 · Information Systems · Inteli

The script reads the CSV files of data/olist_raw_csv.zip (the same archive that the
"Raw data" button of the slides downloads) and uploads each one, byte for byte, to

  bronze/source=olist/entity=<entity>/ingestion_date=<D>/<original file name>.csv

The Bronze layer keeps the files exactly as the source delivered them: no column is
renamed, no value is converted and no row is removed. Every defect that the Silver
layer must treat is still there, and the script prints the counts of the ones that the
lab measures, so that the pipeline can be checked against known numbers.

Usage:
  python load_bronze.py                              # ingestion date 2026-11-05
  python load_bronze.py --ingestion-date 2026-11-06  # the same files as a second delivery
  python load_bronze.py --zip other/path.zip
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import io
import os
import sys
import zipfile
from pathlib import Path

import boto3
from botocore.client import Config
from dotenv import load_dotenv

HERE = Path(__file__).resolve().parent

# File of the archive -> entity of the Bronze layout.
ENTITIES = {
    "olist_orders_dataset.csv": "orders",
    "olist_order_items_dataset.csv": "order_items",
    "olist_customers_dataset.csv": "customers",
    "olist_sellers_dataset.csv": "sellers",
    "olist_products_dataset.csv": "products",
    "product_category_name_translation.csv": "product_category_translation",
    "olist_order_payments_dataset.csv": "payments",
    "olist_order_reviews_dataset.csv": "reviews",
}


def s3_client():
    endpoint = os.environ["S3_ENDPOINT"]
    scheme = "https" if os.environ.get("S3_USE_SSL", "false").lower() == "true" else "http"
    return boto3.client(
        "s3",
        endpoint_url=f"{scheme}://{endpoint}",
        aws_access_key_id=os.environ["S3_ACCESS_KEY"],
        aws_secret_access_key=os.environ["S3_SECRET_KEY"],
        region_name=os.environ.get("S3_REGION", "us-east-1"),
        config=Config(s3={"addressing_style": "path"}),  # RustFS accepts path-style only
    )


def ensure_bucket(s3, bucket: str) -> None:
    names = {b["Name"] for b in s3.list_buckets().get("Buckets", [])}
    if bucket not in names:
        s3.create_bucket(Bucket=bucket)


def rows(data: bytes) -> list[dict]:
    return list(csv.DictReader(io.StringIO(data.decode("utf-8-sig"))))


def planted_defects(files: dict[str, bytes]) -> list[tuple[str, int]]:
    """Counts of the defects of the source that the Silver layer must treat."""
    orders = rows(files["olist_orders_dataset.csv"])
    customers = rows(files["olist_customers_dataset.csv"])
    sellers = rows(files["olist_sellers_dataset.csv"])
    products = rows(files["olist_products_dataset.csv"])
    translation = {r["product_category_name"] for r in rows(files["product_category_name_translation.csv"])}
    header = next(csv.reader(io.StringIO(files["olist_products_dataset.csv"].decode("utf-8-sig"))))
    return [
        ("orders 'delivered' without order_delivered_customer_date",
         sum(1 for r in orders if r["order_status"] == "delivered" and not r["order_delivered_customer_date"])),
        ("orders 'delivered' without order_approved_at",
         sum(1 for r in orders if r["order_status"] == "delivered" and not r["order_approved_at"])),
        ("customer zip prefixes with 4 digits (leading zero lost at the source)",
         sum(1 for r in customers if len(r["customer_zip_code_prefix"]) < 5)),
        ("seller zip prefixes with 4 digits (leading zero lost at the source)",
         sum(1 for r in sellers if len(r["seller_zip_code_prefix"]) < 5)),
        ("products without category", sum(1 for r in products if not r["product_category_name"])),
        ("products whose category has no English translation",
         sum(1 for r in products if r["product_category_name"] and r["product_category_name"] not in translation)),
        ("misspelt headers in products (…_lenght)", sum(1 for h in header if h.endswith("_lenght"))),
        ("files that start with a UTF-8 byte order mark",
         sum(1 for data in files.values() if data.startswith(b"\xef\xbb\xbf"))),
    ]


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--zip", default=str(HERE / "data" / "olist_raw_csv.zip"))
    parser.add_argument("--ingestion-date", default="2026-11-05")
    args = parser.parse_args()

    load_dotenv(HERE / ".env")
    bucket = os.environ.get("LAKE_BUCKET", "olist-lake")

    archive = Path(args.zip)
    if not archive.exists():
        print(f"Archive not found: {archive}. Download it with the 'Raw data' button of the slides.")
        return 1

    with zipfile.ZipFile(archive) as zf:
        files = {name: zf.read(name) for name in ENTITIES if name in zf.namelist()}
    missing = sorted(set(ENTITIES) - set(files))
    if missing:
        print("Missing in the archive:", ", ".join(missing))
        return 1

    s3 = s3_client()
    ensure_bucket(s3, bucket)

    print(f"Bronze of the Olist case -> s3://{bucket}/bronze/ (ingestion_date={args.ingestion_date})\n")
    print(f"{'entity':30} {'rows':>9} {'MB':>7}  sha256")
    for name, entity in ENTITIES.items():
        data = files[name]
        key = f"bronze/source=olist/entity={entity}/ingestion_date={args.ingestion_date}/{name}"
        s3.put_object(Bucket=bucket, Key=key, Body=data, ContentType="text/csv")
        n = len(rows(data))
        print(f"{entity:30} {n:>9,} {len(data) / 1e6:>7.1f}  {hashlib.sha256(data).hexdigest()[:16]}…")

    print("\nDefects of the source that the Silver layer must treat:")
    for label, count in planted_defects(files):
        print(f"  {count:>6,}  {label}")
    print(f"\n{len(ENTITIES)} objects written. The Bronze layer is read-only from now on.")
    return 0


if __name__ == "__main__":
    sys.exit(main())

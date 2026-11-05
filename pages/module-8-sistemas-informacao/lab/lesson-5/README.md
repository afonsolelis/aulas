# Lesson 5 · Lab: the hybrid Silver layer and a star schema

Module 8 · Information Systems · Inteli · Thursday, 05/11/2026, 14:00 to 16:00

The professor runs this lab live, with a coding agent, while the slides explain each concept. The four CREATE prompts in full, the theory behind each step and the review questions are in the reading material: `../../materials/lesson-5-material.html`. The checklist of the classroom computer is in `todo.md`.

The code of the pipeline is not here. It is written live, through the prompts, in a folder `lesson_05_dw/` that starts as a copy of this one.

## The data

The case uses the public dataset of Olist, a Brazilian marketplace: 99,441 orders placed between September 2016 and October 2018, with their items, customers, sellers and products. The archive `data/olist_raw_csv.zip` (28 MB) holds eight CSV files exactly as Olist published them, plus the licence and a note on the source. It is the same file that the "Raw data (CSV)" button of the slides downloads.

- Source: <https://github.com/olist/work-at-olist-data/tree/master/datasets>, MIT licence, copyright (c) 2019 @olist. The same data is published on Kaggle as "Brazilian E-Commerce Public Dataset by Olist".
- The geolocation file (61 MB) is left out because the lab does not use it.
- Payments and reviews go to the Bronze layer but not to the Silver layer of the lab; they are left for the groups to practise.

| File | Bronze entity | Rows |
|---|---|---:|
| `olist_orders_dataset.csv` | orders | 99,441 |
| `olist_order_items_dataset.csv` | order_items | 112,650 |
| `olist_customers_dataset.csv` | customers | 99,441 |
| `olist_sellers_dataset.csv` | sellers | 3,095 |
| `olist_products_dataset.csv` | products | 32,951 |
| `product_category_name_translation.csv` | product_category_translation | 71 |
| `olist_order_payments_dataset.csv` | payments | 103,886 |
| `olist_order_reviews_dataset.csv` | reviews | 99,224 |

## Support files

| File | Use |
|---|---|
| `data/olist_raw_csv.zip` | the raw CSV files of the case |
| `load_bronze.py` | uploads the eight files, unchanged, to `bronze/source=olist/entity=<entity>/ingestion_date=2026-11-05/` and prints the defects of the source |
| `docker-compose.yml` | local RustFS (`rustfs/rustfs:1.0.4`, S3 API on port 9000, console on 9001 at `/rustfs/console/`) and ClickHouse (`clickhouse/clickhouse-server:26.8.15.10`, HTTP port 8123) |
| `.env.example` | credentials and client settings; copy to `.env` |
| `requirements.txt` | Python dependencies (DuckDB, boto3, clickhouse-connect, python-dotenv, pytz, pytest) |
| `AGENTS.md` | rules for the coding agent |
| `todo.md` | preparation of the classroom computer (Linux Mint) |

## The architecture

```text
Bronze (RustFS)                         enrich (DuckDB)        lake: silver/enriched/data_tag=<tag>/ingestion_date=<D>/data.parquet
bronze/source=olist/entity=*/...csv --> normalise, aggregate, --> + silver/_manifests/run_<id>.json (SHA-256 per file)
(8 CSV files, unchanged)                derive, deduplicate,       years: strategy, data science, audit (DuckDB)
                                        quarantine                      |
                                                                        v  loaded from the lake files with s3(), never from Bronze
                                                                ClickHouse silver.enriched (TTL 1 year): tactical queries
                                                                        |
                                                                        v  views and refreshable materialized views
                                                                ClickHouse gold: star schema (fact_order_item + 4 dimensions)
```

The enriched table has three columns: `data_ingestao` (when the record entered the platform), `data_linha` (the record in JSON) and `data_tag` (`olist.<entity>.v<N>` or `quarantine.v1`). The one-year window of ClickHouse is a business decision, written in the ADR as a hypothesis to validate with the partner, together with the clock it counts from.

## 1. Prepare

```bash
git clone --depth 1 https://github.com/afonsolelis/aulas.git
cp -r aulas/pages/module-8-sistemas-informacao/lab/lesson-5 ~/lesson_05_dw && cd ~/lesson_05_dw
mkdir -p specs docs/adr sql src tests/fixtures warehouse
printf '.env\n.venv/\n__pycache__/\nwarehouse/\n' > .gitignore
cp .env.example .env              # change S3_SECRET_KEY and CLICKHOUSE_PASSWORD: openssl rand -base64 24
docker compose up -d --wait
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python load_bronze.py             # 8 objects in bronze/, and the defects of the source
echo "@AGENTS.md" > CLAUDE.md && claude
```

If you only want the data, download `data/olist_raw_csv.zip` with the button of the slides and pass it with `python load_bronze.py --zip <path>`.

## 2. Steps

| Step | Files | While the agent works, the slides explain |
|---|---|---|
| 01 | `specs/silver_contract.md`, `docs/adr/ADR-002-hybrid-silver.md`, `sql/clickhouse_enriched.sql` | the Silver layer as a Data Warehouse; the three columns, JSON and tags |
| 02 | `src/config.py`, `src/enrich.py`, `src/lake.py`, `src/clickhouse.py`, `src/load_hybrid.py`, `tests/test_enrich.py` | enrichment; auditability with the lake first |
| 03 | `src/reconcile.py`, ADR section "Measured consequences" | Redshift and ClickHouse; TTL; the clock of the retention |
| 04 | `docs/star_model.md`, `sql/star_clickhouse.sql`, `sql/star_duckdb.sql`, `sql/question.sql` | dimensional modelling; views and materialized views; North against Southeast |

## 3. Reference numbers

Measured on 05/11/2026 with RustFS 1.0.4, DuckDB 2.0.0, ClickHouse 26.8.15.10 and clickhouse-connect 1.12.0.

Defects printed by `load_bronze.py`: 8 orders `delivered` without delivery date; 14 orders `delivered` without approval date; 23,995 customer and 1,027 seller zip prefixes with 4 digits; 610 products without category and 13 whose category has no English translation; 2 misspelt headers (`…_lenght`); 1 file with a UTF-8 byte order mark.

| data_tag | Lake = ClickHouse after Step 02 |
|---|---:|
| `olist.customer.v1` | 99,441 |
| `olist.seller.v1` | 3,095 |
| `olist.product.v1` | 32,951 |
| `olist.order.v1` | 99,433 |
| `olist.order_item.v1` | 112,642 |
| `quarantine.v1` (8 orders and their 8 items) | 16 |
| total, in 6 Parquet files | 347,578 |

Step 02: the whole run took about 2.5 s. Step 03: reconciliation OK for the 6 tags with 0 SHA-256 mismatches; rebuild of ClickHouse from the lake in about 1 s; a TTL counted from `purchased_at` instead of `data_ingestao` would keep 0 of the 99,433 orders.

Step 04: `dim_customer` 99,441, `dim_seller` 3,095, `dim_product` 32,951, `dim_date` 1,096; `fact_order_item` 112,642; `agg_sales_month_region` 107 rows. 96,470 delivered orders. North 1,796 and Southeast 66,193 (2.71 %); for example, 2018-01 North 135 and Southeast 4,816. The same answer came from the aggregate (0.002 s), from the fact with its joins (0.06 s) and from DuckDB over the lake (0.47 s).

## 4. Shut down

```bash
docker compose down          # keeps the volumes
docker compose down -v       # also deletes the lake and the ClickHouse data
```

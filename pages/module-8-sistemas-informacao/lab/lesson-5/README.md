# Lesson 5 · Lab: the hybrid Silver layer

Module 8 · Information Systems · Inteli · Thursday, 05/11/2026, 11:00 to 13:00

The professor runs this lab live, with a coding agent, while the slides explain each concept. The four CREATE prompts in full, the theory behind each step and the review questions are in the reading material: `../../materials/lesson-5-material.html`. The checklist of the classroom computer is in `todo.md`.

The code is not here. It is written live, through the prompts, in a folder `lesson_05_dw/` that starts as a copy of this one.

## Support files

| File | Use |
|---|---|
| `docker-compose.yml` | local RustFS (`rustfs/rustfs:1.0.4`, S3 API on port 9000, console on 9001 at `/rustfs/console/`) and ClickHouse (`clickhouse/clickhouse-server:26.8.15.10`, HTTP port 8123) |
| `.env.example` | credentials and client settings; copy to `.env` |
| `requirements.txt` | Python dependencies (DuckDB, boto3, clickhouse-connect, python-dotenv, pytz, pytest) |
| `AGENTS.md` | rules for the coding agent |
| `generate_bronze.py` | the Bronze layer of Lesson 4 (14 days), unchanged |
| `generate_supplier_v2.py` | version 2 of the supplier file, with `lote` and `validade`, from 2026-10-26 |
| `todo.md` | preparation of the classroom computer (Linux Mint) |

## The architecture

```text
Bronze (RustFS)                enrich (DuckDB)          lake: silver/enriched/data_tag=<tag>/ingestion_date=<D>/data.parquet
bronze/source=.../*.json  -->  normalise, aggregate,  --> + silver/_manifests/run_<id>.json (SHA-256 per file)
bronze/source=.../*.parquet    derive, deduplicate,         years and decades: strategy, data science (DuckDB)
bronze/source=.../*.csv        quarantine                        |
                                                                 v  loaded from the lake files, never from Bronze
                                                         ClickHouse silver.enriched (TTL 1 year): tactical queries
```

The enriched table has three columns: `data_ingestao` (when the record entered the platform), `data_linha` (the record in JSON) and `data_tag` (`<source>.<entity>.v<N>` or `quarantine.v1`). The one-year window of ClickHouse is a business decision, written in the ADR as a hypothesis to validate with the partner.

## 1. Prepare

```bash
cp -r lab/lesson-5 ~/lesson_05_dw && cd ~/lesson_05_dw
mkdir -p specs docs/adr sql src tests/fixtures warehouse
printf '.env\n.venv/\n__pycache__/\nwarehouse/\n' > .gitignore
cp .env.example .env              # change S3_SECRET_KEY and CLICKHOUSE_PASSWORD: openssl rand -base64 24
docker compose up -d --wait
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python generate_bronze.py         # 14 days, 45 objects
echo "@AGENTS.md" > CLAUDE.md && claude
```

## 2. Steps

| Step | Files | While the agent works, the slides explain |
|---|---|---|
| 01 | `specs/silver_contract.md`, `docs/adr/ADR-002-hybrid-silver.md`, `sql/clickhouse_enriched.sql` | the Silver layer as a Data Warehouse; the three columns, JSON and tags |
| 02 | `src/config.py`, `src/enrich.py`, `src/lake.py`, `src/clickhouse.py`, `src/load_hybrid.py`, `tests/test_enrich.py` | enrichment; auditability with the lake first |
| 03 | `src/enrich.py`, `src/reconcile.py`, ADR section "Measured consequences" | Redshift and ClickHouse; TTL; tactical and strategic windows |
| 04 | `sql/silver_3nf.sql`, `sql/silver_data_vault.sql`, `src/models.py`, `sql/queries.sql`, `docs/silver_models.md` | Third Normal Form and Data Vault |

## 3. Reference numbers

Measured on 02/11/2026 with RustFS 1.0.4, DuckDB 2.0.0, ClickHouse 26.8.15.10 and clickhouse-connect 1.11.0. The same counts came out with the MinIO of Lesson 4; RustFS replaces it because the official MinIO image is no longer published, and it speaks the same S3 API (path-style addresses only).

| Moment | Lake | ClickHouse |
|---|---:|---:|
| After Step 02 (14 days) | 24,677 rows, 58 files | 24,677 rows |
| After Step 03 (+ supplier v2 + 2024-10-17) | 26,453 rows, 63 files | 24,695 rows |

| data_tag | After Step 02 | After Step 03, lake | After Step 03, ClickHouse |
|---|---:|---:|---:|
| `pos.sale_line.v1` | 20,891 | 22,385 | 20,891 |
| `erp.stock_position.v1` | 3,346 | 3,585 | 3,346 |
| `supplier.delivery.v1` | 258 | 274 | 258 |
| `supplier.delivery.v2` | | 18 | 18 |
| `erp.store.v1` | 6 | 6 | 6 |
| `erp.product.v1` | 40 | 40 | 40 |
| `quarantine.v1` | 136 | 145 | 136 |

The 1,758 rows of 2024-10-17 stay only in the lake: the TTL removed them already at insert time. Rebuilding ClickHouse from the 63 lake files took 6.8 s, with 0 SHA-256 mismatches.

Step 04: 3NF views store 6, product 40, supplier 1, sale_line 22,385, delivery 292, lot 18; Data Vault hub_sale 22,385, hub_delivery 292, sat_delivery_lot 18. Tactical query (lots expiring in less than 90 days) in ClickHouse: 6 lots. Strategic query (17 October by year and region) in DuckDB over the lake: 4 rows, 2024 and 2026.

## 4. Shut down

```bash
docker compose down          # keeps the volumes
docker compose down -v       # also deletes the lake and the ClickHouse data
```

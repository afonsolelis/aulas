# Lesson 4 · Lab: ETL from Object Storage to a Data Warehouse

Module 8 · Information Systems · Inteli · Thursday, 29/10/2026, 11:00 to 13:00

This is the script of the hands-on part. The explanation of each step and the four CREATE prompts in full are in the reading material of the lesson: `../../materials/lesson-4-material.html`.

The code is not here. It is written live, through the prompts, in the group repository. This folder holds only the support files.

## Support files

| File | Use |
|---|---|
| `docker-compose.yml` | local MinIO (`coollabsio/minio:RELEASE.2025-10-15T17-29-55Z`), S3 API on port 9000 and console on 9001 |
| `.env.example` | MinIO credentials, client settings and the warehouse path; copy to `.env` |
| `requirements.txt` | suggested Python dependencies (DuckDB, boto3, python-dotenv, pytest) |
| `AGENTS.md` | rules for the coding agent in this folder |
| `generate_bronze.py` | writes the Bronze layer of the pharmacy chain into the MinIO and prints the defects it planted |

## The case

The pharmacy chain of the module has six stores and forty products. Three sources deliver files to the Bronze layer every day, each in a different format, and the pipeline of this lesson turns them into the Silver layer of a test Data Warehouse.

```text
bronze/source=pos/entity=sale_line/ingestion_date=YYYY-MM-DD/batch_2300.json         newline-delimited JSON
bronze/source=pos/entity=sale_line/ingestion_date=2026-10-18/batch_0815_resend.json  resend of JUN-04
bronze/source=erp/entity=stock_position/ingestion_date=YYYY-MM-DD/extract.parquet    Parquet, typed
bronze/source=supplier/entity=delivery/ingestion_date=YYYY-MM-DD/acme_0930.csv       CSV, ';', Latin-1
bronze/source=erp/entity=store/ingestion_date=2026-10-12/store.csv                   master data
bronze/source=erp/entity=product/ingestion_date=2026-10-12/product.csv               master data
```

The Silver layer is a DuckDB database file (`warehouse/pharmacy.duckdb`), schema `silver`, with the tables `store`, `product`, `sale_line`, `stock_position`, `delivery`, `quarantine` and `load_log`.

## 1. Prepare the folder in the group repository

At the root of the group repository:

```bash
mkdir -p lesson_04_etl/{specs,src,tests/fixtures,docs/adr,warehouse}
# copy the five support files of this folder (and .env.example) into lesson_04_etl/
cd lesson_04_etl
printf '.env\n.venv/\n__pycache__/\nwarehouse/\n' >> .gitignore
cp .env.example .env
git check-ignore .env            # must print: .env
openssl rand -base64 24          # use it as MINIO_ROOT_PASSWORD and S3_SECRET_KEY in .env
```

## 2. Start the MinIO and generate the Bronze layer

```bash
docker compose up -d --wait
docker compose ps                # STATUS must show (healthy)
python3 -m venv .venv && source .venv/bin/activate     # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python generate_bronze.py        # 14 days, 2026-10-12 to 2026-10-25, 45 objects, 4.4 MiB
docker compose exec minio sh -c 'mc alias set local http://localhost:9000 "$MINIO_ROOT_USER" "$MINIO_ROOT_PASSWORD" >/dev/null && mc ls --recursive local/pharmacy-lake | wc -l'
```

Keep the table that `generate_bronze.py` prints. It is the expected result of the pipeline. Output measured on 26/10/2026:

```text
sale_lines_sent      21112   lines in the 14 batch_2300.json files
double_posted          209   lines posted twice in the same file
resent_lines           241   lines of JUN-04 resent on 2026-10-18
orphan_product          68   product_id 41 or 42
invalid_quantity        41   quantity 0 or -1
br_date_format        3447   sold_at as dd/mm/yyyy HH:MM:SS (BAU-05)
comma_decimal         3580   unit_price as text with comma (SOR-03)
dirty_store_code      2070   store code in lower case, title case or with spaces
stock_rows            3420   rows in the 14 extract.parquet files
null_on_hand           130   JUN-04 without a count
negative_on_hand        14   invariant violations
audit_correction        60   corrections of the stock two days earlier
deliveries             271   rows in the 14 acme_0930.csv files
missing_delivery_qty    13   empty quantidade
```

The console of the MinIO is at http://localhost:9001 (in a Codespace, open the forwarded port).

## 3. Agent

```bash
claude            # or the agent of your choice
```

Open the agent in `lesson_04_etl/`. In Claude Code, first create a `CLAUDE.md` that imports the rules: `echo "@AGENTS.md" > CLAUDE.md`. Other agents read `AGENTS.md` directly or accept it pasted in the context. Run prompts 1 to 4 of the material, one at a time, and do the "Review before moving on" after each one. No API key goes into Git.

| Prompt | Files | While the agent works, the slides explain |
|---|---|---|
| 1 | `specs/spec.md`, `specs/plan.md`, `specs/tasks.md` | ETL and ELT, the Bronze to Silver contract |
| 2 | `src/config.py`, `src/extract.py`, `tests/test_extract.py` | reading Object Storage, formats, partitions |
| 3 | `src/transform.py`, `tests/test_transform.py` | cleaning, formatting, type conversion, enrichment |
| 4 | `src/load.py`, `src/pipeline.py`, `tests/test_load.py`, `docs/adr/ADR-001-full-and-incremental-load.md` | Data Warehouse, full and incremental loads |

## 4. Verification

```bash
pytest -q
python -m src.pipeline full
python generate_bronze.py --day 2026-10-26
python -m src.pipeline incremental
python -m src.pipeline incremental          # must find nothing after the watermark
python -m src.pipeline full                 # must arrive at the same counts
python - <<'EOF'
import duckdb
con = duckdb.connect("warehouse/pharmacy.duckdb", read_only=True)
for t in ["sale_line", "stock_position", "delivery", "quarantine"]:
    print(t, con.sql(f"SELECT count(*) FROM silver.{t}").fetchone()[0])
print(con.sql("SELECT entity, reason, count(*) FROM silver.quarantine GROUP BY ALL ORDER BY ALL"))
print(con.sql("""SELECT store_id, product_id, date, count(*) FROM silver.stock_position
                 GROUP BY ALL HAVING count(*) > 1"""))       # must return no rows
print(con.sql("SELECT * FROM silver.load_log ORDER BY started_at"))
EOF
```

Reference counts, measured on 26/10/2026 with DuckDB 2.0.0:

| Table | After the full load of 14 days | After the incremental load of 2026-10-26 |
|---|---:|---:|
| `silver.sale_line` | 20,891 | 22,380 |
| `silver.stock_position` | 3,346 | 3,585 |
| `silver.delivery` | 258 | 281 |
| `silver.quarantine` | 136 | 150 |

Checklist:

- [ ] for each entity, rows after deduplication = rows in Silver + rows in quarantine
- [ ] one row per `sale_id` of JUN-04 on 2026-10-17, all with `ingestion_date = 2026-10-18`
- [ ] no store code with spaces or lower case in Silver
- [ ] `sold_at` of BAU-05 at the same local time as the text it came from
- [ ] no `customer_cpf` in any table of the warehouse
- [ ] incremental and full loads arrive at the same counts; the second incremental run changes nothing
- [ ] `git status --short` does not list `.env` nor `warehouse/`

## 5. Deliverable

Folder `lesson_04_etl/` in the group repository, with `AGENTS.md`, `specs/` (spec, plan, tasks), `src/` (config, extract, transform, load, pipeline), `tests/` passing and `docs/adr/ADR-001-full-and-incremental-load.md` with the measurements of the group. The warehouse file is not committed: anyone rebuilds it with the generator and the full load.

## 6. Shut down

```bash
docker compose down          # keeps the volume with the local data
docker compose down -v       # also deletes the volume
```

# AGENTS.md · lesson_05_dw

Rules for the coding agent in this folder, whatever agent is used (Claude Code, Codex CLI, OpenCode or another). Read this file before any step.

## Scope

- Project: the Silver layer of the Olist case (a Brazilian marketplace, orders from 2016-09 to 2018-10) as a hybrid Data Warehouse, and a star schema over it. One enriched table (`data_ingestao`, `data_linha`, `data_tag`) is written first to a long-lived lake in the local RustFS, an S3-compatible object storage (Parquet, read and written with DuckDB) and then loaded into ClickHouse, which keeps a one-year window by TTL. The database `gold` of ClickHouse holds the star schema, built with views and refreshable materialized views.
- Work only inside `lesson_05_dw/`.
- One step at a time. Show the plan before editing and stop at the end of the step.

## Steps

| Step | Files |
|---|---|
| 00 | preparation (no prompt); `docs/prompts.md` |
| 01 | `specs/silver_contract.md`, `docs/adr/ADR-002-hybrid-silver.md`, `sql/clickhouse_enriched.sql` |
| 02 | `src/config.py`, `src/enrich.py`, `src/lake.py`, `src/clickhouse.py`, `src/load_hybrid.py`, `tests/test_enrich.py` |
| 03 | `src/reconcile.py`, section "Measured consequences" of the ADR |
| 04 | `docs/star_model.md`, `sql/star_clickhouse.sql`, `sql/star_duckdb.sql`, `sql/question.sql` |

Each step reads the files of the previous ones. No code in `src/` before Step 02.

## Prompt log

At the end of each step, append to `docs/prompts.md` a section with the number and name of the step, the date, the prompt received copied literally and the list of files created or changed. Never record secrets; if a prompt contains one, stop and warn.

## Sources of truth

- Precedence: `specs/silver_contract.md` > `docs/adr/ADR-002-hybrid-silver.md` > the prompt of the step.
- `docker-compose.yml`, `.env.example`, `requirements.txt` and `load_bronze.py` of this folder. The loader defines the Bronze layout and prints the defects of the source that the Silver layer must account for.
- `data/olist_raw_csv.zip` holds the raw CSV files of Olist (MIT licence). Never edit it.
- If two documents contradict each other, stop and ask.

## Content rules

- Do not invent numbers, SLAs, volumes or limits. A value without a source receives the mark "hypothesis, validation pending".
- The retention of ClickHouse is a business parameter. Write it as a hypothesis to validate with the partner, never as a technical fact.
- Separate fact, gap and assumption. Preserve existing IDs (ADR-002).
- Mermaid without semicolons in labels.

## Data rules

- Bronze is read-only. Only `load_bronze.py` writes under `bronze/`.
- RustFS accepts only path-style addresses: DuckDB uses `URL_STYLE 'path'` and `USE_SSL false`.
- The three columns keep exactly these names: `data_ingestao`, `data_linha`, `data_tag`.
- Every CSV column is read as text and converted explicitly. Zip prefixes are strings of 5 characters, never numbers.
- Timestamps of the source are local time of Brazil without offset; in `data_linha` they carry the offset of America/Sao_Paulo on that date (`-03:00`, or `-02:00` under the daylight saving time that Brazil had until 2019).
- `data_ingestao` is the ingestion date of the Bronze object, not the date of the order. The date of the business is `purchased_at`, inside `data_linha`.
- Payments and reviews stay in the Bronze; only the five tags of the contract and `quarantine.v1` enter the Silver layer.
- Every record read from Bronze ends in exactly one tag, including `quarantine.v1` with a reason.
- Order of a load: lake, then ClickHouse from the lake files, then the manifest. ClickHouse never holds a row that the lake does not hold.
- In ClickHouse, `data_linha` is of type `JSON`, never `String`. Every INSERT uses `input_format_try_infer_dates = 0`, `input_format_try_infer_datetimes = 0` and `async_insert = 0`.
- The secret of RustFS in DuckDB is created at the start of each session; never `CREATE PERSISTENT SECRET`.
- ClickHouse reads the lake with its `s3()` table function at `S3_ENDPOINT_FROM_CLICKHOUSE` (`http://rustfs:9000`, inside the compose network), never at `localhost`.
- In the star schema, dimensions are views; only the fact and the aggregate are stored, as refreshable materialized views. After each load, refresh the fact, wait for it, then refresh the aggregate: a manual refresh does not cascade through `DEPENDS ON`.

## Secrets

- Credentials only in `.env`, which is never committed.
- Do not read or print the contents of `.env`. Use the names of the variables.
- To open the ClickHouse client, use the variables of the container:
  `docker compose exec clickhouse sh -c 'clickhouse-client --user "$CLICKHOUSE_USER" --password "$CLICKHOUSE_PASSWORD"'`.

## Allowed commands

- `python`, `pytest`, `pip install -r requirements.txt`
- `python load_bronze.py`
- `docker compose up -d --wait`, `docker compose ps`, `docker compose logs <service>`
- `docker compose exec clickhouse ...` for the DDL of `sql/`, for queries and for `SYSTEM REFRESH VIEW` / `SYSTEM WAIT VIEW` of the database `gold`
- `git status`, `git diff`

Ask for authorisation before: deleting objects or buckets, `DROP` of a table or database, `docker compose down -v`, installing packages outside `requirements.txt`, committing or pushing.

## Gates

- Unit tests do not access the network; they use small fixtures in `tests/fixtures/`.
- Do not change a test to make it pass. If the test is wrong, stop and explain.
- Gate of Step 02: for each `data_tag`, rows in the lake = rows in ClickHouse.
- Gate of Step 03: for each `data_tag`, rows in the lake inside the TTL window = rows in ClickHouse, and every SHA-256 of the last manifest matches the file.
- Gate of Step 04: the question answered from `gold.agg_sales_month_region`, from `gold.fact_order_item` and from DuckDB over the lake gives the same numbers.

# AGENTS.md · lesson_05_dw

Rules for the coding agent in this folder, whatever agent is used (Claude Code, Codex CLI, OpenCode or another). Read this file before any step.

## Scope

- Project: the Silver layer of the pharmacy chain as a hybrid Data Warehouse. One enriched table (`data_ingestao`, `data_linha`, `data_tag`) is written first to a long-lived lake in the local MinIO (Parquet, read and written with DuckDB) and then loaded into ClickHouse, which keeps a one-year window by TTL.
- Work only inside `lesson_05_dw/`.
- One step at a time. Show the plan before editing and stop at the end of the step.

## Steps

| Step | Files |
|---|---|
| 00 | preparation (no prompt); `docs/prompts.md` |
| 01 | `specs/silver_contract.md`, `docs/adr/ADR-002-hybrid-silver.md`, `sql/clickhouse_enriched.sql` |
| 02 | `src/config.py`, `src/enrich.py`, `src/lake.py`, `src/clickhouse.py`, `src/load_hybrid.py`, `tests/test_enrich.py` |
| 03 | `src/enrich.py` (supplier version 2), `src/reconcile.py`, section "Measured consequences" of the ADR |
| 04 | `sql/silver_3nf.sql`, `sql/silver_data_vault.sql`, `src/models.py`, `sql/queries.sql`, `docs/silver_models.md` |

Each step reads the files of the previous ones. No code in `src/` before Step 02.

## Prompt log

At the end of each step, append to `docs/prompts.md` a section with the number and name of the step, the date, the prompt received copied literally and the list of files created or changed. Never record secrets; if a prompt contains one, stop and warn.

## Sources of truth

- Precedence: `specs/silver_contract.md` > `docs/adr/ADR-002-hybrid-silver.md` > the prompt of the step.
- `docker-compose.yml`, `.env.example`, `requirements.txt`, `generate_bronze.py` and `generate_supplier_v2.py` of this folder. The generators define the Bronze layout and print the numbers that the Silver layer must account for.
- If two documents contradict each other, stop and ask.

## Content rules

- Do not invent numbers, SLAs, volumes or limits. A value without a source receives the mark "hypothesis, validation pending".
- The retention of ClickHouse is a business parameter. Write it as a hypothesis to validate with the partner, never as a technical fact.
- Separate fact, gap and assumption. Preserve existing IDs (ADR-002).
- Mermaid without semicolons in labels.

## Data rules

- Bronze is read-only. Only the generators write under `bronze/`.
- The three columns keep exactly these names: `data_ingestao`, `data_linha`, `data_tag`.
- `customer_cpf` never reaches the Silver layer, not even in quarantine.
- Every record read from Bronze ends in exactly one tag, including `quarantine.v1` with a reason.
- Order of a load: lake, then ClickHouse from the lake files, then the manifest. ClickHouse never holds a row that the lake does not hold.
- In ClickHouse, `data_linha` is of type `JSON`, never `String`. Every INSERT uses `input_format_try_infer_dates = 0`, `input_format_try_infer_datetimes = 0` and `async_insert = 0`.
- The secret of the MinIO in DuckDB is created at the start of each session; never `CREATE PERSISTENT SECRET`.

## Secrets

- Credentials only in `.env`, which is never committed.
- Do not read or print the contents of `.env`. Use the names of the variables.
- To open the ClickHouse client, use the variables of the container:
  `docker compose exec clickhouse sh -c 'clickhouse-client --user "$CLICKHOUSE_USER" --password "$CLICKHOUSE_PASSWORD"'`.

## Allowed commands

- `python`, `pytest`, `pip install -r requirements.txt`
- `python generate_bronze.py`, `python generate_bronze.py --day YYYY-MM-DD`, `python generate_supplier_v2.py`
- `docker compose up -d --wait`, `docker compose ps`, `docker compose logs <service>`
- `docker compose exec clickhouse ...` for the DDL of `sql/` and for queries
- `git status`, `git diff`

Ask for authorisation before: deleting objects or buckets, `DROP` of a table or database, `docker compose down -v`, installing packages outside `requirements.txt`, committing or pushing.

## Gates

- Unit tests do not access the network; they use small fixtures in `tests/fixtures/`.
- Do not change a test to make it pass. If the test is wrong, stop and explain.
- Gate of Step 02: for each `data_tag`, rows in the lake = rows in ClickHouse.
- Gate of Step 03: for each `data_tag`, rows in the lake inside the TTL window = rows in ClickHouse, and every SHA-256 of the last manifest matches the file.

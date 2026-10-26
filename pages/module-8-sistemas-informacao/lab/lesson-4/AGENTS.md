# AGENTS.md · lesson_04_etl

Rules for the coding agent in this folder, whatever agent the group uses (Claude Code, Codex CLI, OpenCode or another). Read this file before any step.

## Scope

- Project: ETL of the pharmacy chain, from the Bronze layer in Object Storage (local MinIO, bucket `pharmacy-lake`) to the Silver layer in a test Data Warehouse (a DuckDB database file).
- Work only inside `lesson_04_etl/`.
- Follow the SDD sequence of the session: `specs/spec.md`, `specs/plan.md` and `specs/tasks.md` (prompt 1), then `src/extract.py` (prompt 2), `src/transform.py` (prompt 3) and `src/load.py` with `src/pipeline.py` (prompt 4).
- One prompt at a time. Show the plan before editing and stop at the end of the step.

## Sources of truth

- The files in `specs/`, in this order of precedence: spec > plan > tasks.
- `docker-compose.yml`, `.env.example`, `requirements.txt` and `generate_bronze.py` of this folder. The generator defines the Bronze layout and prints the number of planted defects; the pipeline must account for each of them.
- If two documents contradict each other, stop and ask.

## Content rules

- Do not invent numbers, SLAs, volumes or limits. A value without a source receives the mark "hypothesis — validation pending".
- Separate fact, gap and assumption.
- Preserve existing IDs (RF-01, RNF-01, T-01, ADR-001).
- Every technical choice points to an RF or an RNF.

## Data rules

- Bronze is read-only. The pipeline never writes, moves or deletes objects under `bronze/`.
- The extraction reads Bronze as text (explicit columns as `VARCHAR`, or `all_varchar=true`), except Parquet, which keeps its own types. Types are applied in the transformation, with `try_cast` or `try_strptime`, never with a cast that aborts the run.
- Every row read from Bronze ends in exactly one place: a Silver table or `silver.quarantine`, with a reason. A row never disappears silently.
- The incremental extraction lists the partitions (`glob`) and reads only the files of partitions newer than the watermark. It does not rely on a `WHERE` over the partition column to avoid reading the other files.
- `customer_cpf` never reaches the warehouse, not even in the quarantine.
- Every Silver row carries its lineage: `source_file`, `ingestion_date`, `run_id` and `loaded_at`.

## Secrets

- Credentials only in `.env`, which is never committed.
- Never write secrets in code, tests, logs, prompts or commits.
- Do not read or print the contents of `.env`. Use the names of the variables.

## Allowed commands

- `python`, `pytest`, `pip install -r requirements.txt`
- `python generate_bronze.py` and `python generate_bronze.py --day YYYY-MM-DD`
- `docker compose up -d --wait`, `docker compose ps`, `docker compose logs minio`, `docker compose exec minio mc ls ...` and `mc cat ...` (read only)
- `git status`, `git diff`

Ask for authorisation before: deleting objects or buckets, deleting the warehouse file, installing packages outside `requirements.txt`, committing or pushing.

## Gates

- Unit tests do not access the network; they use small fixtures in `tests/fixtures/` (a few lines of each source, with one example of each defect).
- Integration tests use the local MinIO and a temporary warehouse file.
- A task is marked as done in `specs/tasks.md` only with its test passing and the verification command written down.

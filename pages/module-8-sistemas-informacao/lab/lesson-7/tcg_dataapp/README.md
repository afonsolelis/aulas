# tcg-dataapp

The model of Lesson 6, automated as an installable Python package. One command collects the prices that TCGplayer published for the Pokémon TCG sets of 2026, loads them into a local DuckDB file and builds the whole gold layer, the frozen and live reports, the five questions and the Parquet files of the marts.

Every date is Unix time in seconds (UTC).

## Install and run

```bash
python3 -m venv .venv && source .venv/bin/activate
pip install -e '.[dev]'
tcg-dataapp run              # about 40 s; the archives of tcgcsv are downloaded once per date
tcg-dataapp status           # rows of db_ingestion and the last run
tcg-dataapp run --with-today # also the prices of today, from the live API
pytest                       # 9 tests, without network
```

The run writes `warehouse/tcg.duckdb`, `out/report.md` and `out/marts/*.parquet`. The settings come from environment variables: `TCG_DB_PATH`, `TCG_OUT_DIR`, `TCG_SETS`, `TCG_PRICE_DATES`, `TCG_FROZEN_MONTH`, `TCG_RETRIES`, `TCG_RETRY_DELAY` (see `src/tcg_dataapp/config.py`).

To run every day at 06:00 UTC without an orchestrator, a line of crontab is enough; Lesson 8 replaces it with Prefect:

```cron
0 6 * * * cd /path/to/project && .venv/bin/tcg-dataapp run --with-today >> out/cron.log 2>&1
```

## Layers

Each layer depends only on the layer below it.

| Layer | Module | Does |
|---|---|---|
| views | `views/questions.py`, `views/report.py` | the five questions, `out/report.md` and the Parquet files, always read from gold |
| processors | `processors/gold.py`, `processors/quality.py`, `processors/sql/*.sql` | the gold layer as views, the monthly frozen reports and the checks that stop the run |
| etls | `etls/tcgcsv.py`, `etls/extract.py`, `etls/landing.py` | the client of tcgcsv.com, the extraction and the idempotent load into `db_ingestion` |

`pipeline.py` wires the layers into tasks with dependencies, retries and a log in `ops.pipeline_runs`; `cli.py` is the command `tcg-dataapp`.

## The pipeline

```text
extract_sets ─▶ extract_products ─┬▶ extract_prices_2026-03-01 ─┐
                                  ├▶ ...                         ├▶ build_gold ─▶ check_quality ─┬▶ freeze_reports ─┐
                                  └▶ extract_prices_2026-11-07 ─┘                                 └▶ export_marts ───┴▶ write_report
```

- A task runs only after every task it depends on succeeded; a failure is retried `TCG_RETRIES` times with a growing pause, and a task that still fails skips its dependents.
- Every attempt is a row of `ops.pipeline_runs` (run, task, attempt, status, start and end in Unix time, detail).
- Loading a batch (one tag at one timestamp) replaces it, so a rerun never duplicates rows. The prices of today are loaded as the batch of noon UTC, so two runs on the same day keep one price per product.
- Every run captures the catalogue again; the dimensions keep the last version of each set and product (`QUALIFY row_number() ... = 1`), so the grain of the fact holds.
- A frozen report is created once per month, from the last capture of that month, and never rebuilt.

## Reference numbers (07/11/2026, DuckDB 2.0.0)

First run: 7 sets, 1,490 products, 5,951 prices in 5 captures; `gold.fact_price` 5,951 rows = 5,951 keys of the grain; 524 cells in the cube; `report.mv_card_price_2026_09` 1,226 rows, with the Pikachu ex 276/217 at US$ 1,049.08. A second run keeps the fact at 5,951 rows and the frozen report as it was. With `--with-today` on 08/11/2026: 7,782 prices in 6 captures, the same after a second run on the same day.

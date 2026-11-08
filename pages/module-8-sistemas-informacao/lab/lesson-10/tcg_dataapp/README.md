# tcg-dataapp 0.4.0 · instrumented for Prometheus

The model of Lesson 6, automated as an installable Python package in Lesson 7 and instrumented with metrics in Lesson 10. One command collects the prices that TCGplayer published for the Pokémon TCG sets of 2026, loads them into a local DuckDB file and builds the whole gold layer, the frozen and live reports, the five questions and the Parquet files of the marts.

Every date is Unix time in seconds (UTC).

## Install and run

```bash
python3 -m venv .venv && source .venv/bin/activate
pip install -e '.[dev]'
tcg-dataapp run              # about 40 s; the archives of tcgcsv are downloaded once per date
tcg-dataapp status           # rows of db_ingestion and the last run
tcg-dataapp run --with-today # also the prices of today, from the live API
tcg-dataapp run --push localhost:9091   # also push the metrics of the run to a Pushgateway
tcg-dataapp metrics          # the exporter: /metrics on port 9108 with the state of the warehouse
tcg-dataapp metrics --once   # one scrape, printed
pytest                       # 14 tests, without network
```

The run writes `warehouse/tcg.duckdb`, `out/report.md`, `out/marts/*.parquet` and `out/metrics.prom`. The settings come from environment variables: `TCG_DB_PATH`, `TCG_OUT_DIR`, `TCG_SETS`, `TCG_PRICE_DATES`, `TCG_FROZEN_MONTH`, `TCG_RETRIES`, `TCG_RETRY_DELAY`, and, for the metrics, `TCG_PUSHGATEWAY`, `TCG_INSTANCE` and `TCG_METRICS_PORT` (see `src/tcg_dataapp/config.py`).

## Metrics (Lesson 10)

`telemetry.py` reaches Prometheus in two ways, because the DataApp has two kinds of process.

| Process | How Prometheus gets the numbers | Metrics |
|---|---|---|
| `tcg-dataapp run`, a batch of about 30 to 40 s | the run pushes to a Pushgateway at the end (`pushadd`, group `job=tcg_dataapp, instance=<TCG_INSTANCE>`), and Prometheus scrapes the Pushgateway | `tcg_task_attempts_total`, `tcg_task_duration_seconds`, `tcg_task_rows`, `tcg_source_request_duration_seconds` (histogram), `tcg_source_request_errors_total`, `tcg_quality_value`, `tcg_run_success`, `tcg_run_duration_seconds`, `tcg_run_failed_tasks`, `tcg_run_last_completion_timestamp_seconds`, `tcg_run_last_success_timestamp_seconds` |
| `tcg-dataapp metrics`, a long-running exporter | Prometheus scrapes it; at each scrape it reads the DuckDB file | `tcg_ingestion_rows`, `tcg_ingestion_last_timestamp_seconds`, `tcg_ingestion_batches`, `tcg_gold_fact_rows`, `tcg_gold_fact_grain_keys`, `tcg_pipeline_last_run_tasks`, `tcg_pipeline_last_run_end_timestamp_seconds`, `tcg_warehouse_readable` |

The time of the last success is pushed only after a successful run, so a failed run does not erase it. DuckDB accepts one writer process and no reader while it writes, so a scrape during a run reports `tcg_warehouse_readable 0` instead of failing. The monitoring stack (Prometheus, Pushgateway, Grafana, rules and dashboard) is in `../stack/`.

To run every day at 06:00 UTC without an orchestrator, a line of crontab is enough; Lesson 8 replaces it with Prefect:

```cron
0 6 * * * cd /path/to/project && .venv/bin/tcg-dataapp run --with-today --push localhost:9091 >> out/cron.log 2>&1
```

## Layers

Each layer depends only on the layer below it.

| Layer | Module | Does |
|---|---|---|
| views | `views/questions.py`, `views/report.py` | the five questions, `out/report.md` and the Parquet files, always read from gold |
| processors | `processors/gold.py`, `processors/quality.py`, `processors/sql/*.sql` | the gold layer as views, the monthly frozen reports and the checks that stop the run |
| etls | `etls/tcgcsv.py`, `etls/extract.py`, `etls/landing.py` | the client of tcgcsv.com, the extraction and the idempotent load into `db_ingestion` |

`pipeline.py` wires the layers into tasks with dependencies, retries and a log in `ops.pipeline_runs`; `telemetry.py` turns each run and the state of the warehouse into metrics; `cli.py` is the command `tcg-dataapp`.

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

## Reference numbers of Lesson 10 (08/11/2026, DuckDB 2.0.0, prometheus-client 0.26.0)

A run with `--push`: 12 tasks ok in 25.1 s (`tcg_run_duration_seconds`), the same 5,951 prices and 524 cells; 13 requests to tcgcsv.com, with a mean of 2.97 s per archive. A second run with `--with-today`: 7,782 prices in 6 captures, 30.3 s. A run with `TCG_BASE_URL=http://127.0.0.1:9`: `tcg_run_success 0`, 12 tasks failed or skipped, and `TcgRunFailed` firing in Prometheus.

## Reference numbers of Lesson 7 (07/11/2026, DuckDB 2.0.0)

First run: 7 sets, 1,490 products, 5,951 prices in 5 captures; `gold.fact_price` 5,951 rows = 5,951 keys of the grain; 524 cells in the cube; `report.mv_card_price_2026_09` 1,226 rows, with the Pikachu ex 276/217 at US$ 1,049.08. A second run keeps the fact at 5,951 rows and the frozen report as it was. With `--with-today` on 08/11/2026: 7,782 prices in 6 captures, the same after a second run on the same day.

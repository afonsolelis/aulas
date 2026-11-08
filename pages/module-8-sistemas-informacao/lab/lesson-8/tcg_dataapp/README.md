# tcg-dataapp 0.2.0

The model of Lesson 6, automated as an installable Python package in Lesson 7 and orchestrated by Prefect 3 in Lesson 8. One command collects the prices that TCGplayer published for the Pokémon TCG sets of 2026, loads them into a local DuckDB file and builds the whole gold layer, the frozen and live reports, the five questions and the Parquet files of the marts.

Every date is Unix time in seconds (UTC).

## Install and run

```bash
python3 -m venv .venv && source .venv/bin/activate
pip install -e '.[dev]'
tcg-dataapp flow               # the pipeline as a Prefect flow, once (about 17 s)
tcg-dataapp flow --with-today  # also the prices of today, from the live API
tcg-dataapp run                # the hand-written runner of Lesson 7, kept for comparison (about 40 s)
tcg-dataapp status             # rows of db_ingestion and the last run
pytest                         # 14 tests, without network
```

Without a server, `tcg-dataapp flow` starts a temporary Prefect server, runs the flow and stops it. The settings come from environment variables: `TCG_DB_PATH`, `TCG_OUT_DIR`, `TCG_SETS`, `TCG_PRICE_DATES`, `TCG_FROZEN_MONTH`, `TCG_RETRIES`, `TCG_RETRY_DELAY` (see `src/tcg_dataapp/config.py`).

## Every day at 06:00 UTC, with the UI

The deployment replaces the crontab line of Lesson 7. Three terminals, in the folder of the project and with the virtual environment active:

```bash
# terminal 1: the server, its database and the UI at http://127.0.0.1:4200
prefect server start

# terminal 2: the deployment 'daily', served by this process (Ctrl+C stops it)
prefect config set PREFECT_API_URL=http://127.0.0.1:4200/api
tcg-dataapp serve                    # cron 0 6 * * *, with_today=True
# tcg-dataapp serve --cron "*/15 * * * *"   to watch it run every 15 minutes

# terminal 3: a run now, without waiting for the schedule
prefect deployment run 'tcg-dataapp/daily'
prefect flow-run ls --limit 5
```

The cron has no timezone, so 06:00 is UTC (03:00 in São Paulo). In the UI, the page of a flow run shows the graph of its task runs, the state of each one (Completed, Cached, Failed, NotReady), the retries and the logs.

## The flow

```text
extract_sets ─▶ extract_products ──────────────────────────┐
fetch_prices_2026-03-01 ─▶ load_prices_2026-03-01 ─┐        │
fetch_prices_2026-05-01 ─▶ load_prices_2026-05-01 ─┤        │
fetch_prices_2026-07-01 ─▶ load_prices_2026-07-01 ─┼────────┴▶ build_gold ─▶ check_quality ─┬▶ freeze_reports ─┐
fetch_prices_2026-09-01 ─▶ load_prices_2026-09-01 ─┤                                        └▶ export_marts ───┴▶ write_report
fetch_prices_2026-11-07 ─▶ load_prices_2026-11-07 ─┘
```

| Task | Retries | Cache | Why |
|---|---|---|---|
| `extract_sets`, `extract_products`, `extract_prices_today` | `TCG_RETRIES`, pause 2, 4, 8 s | none | the network fails for reasons outside the code; they write, so they are not cached |
| `fetch_prices_<day>` | `TCG_RETRIES`, pause 2, 4, 8 s | `INPUTS + TASK_SOURCE`, result persisted | the archive of a past day never changes; a rerun reads it from the cache |
| `load_prices_<day>` | 3 | none | a write; `load_batch` replaces the batch, so a retry is safe |
| `build_gold`, `freeze_reports`, `write_report` | 0 | none | a wrong model does not become right by running again |
| `check_quality` | 2, except for a `QualityError` | none | the retry condition refuses to retry a broken grain |

- The downloads depend on nothing and start at once, in parallel; each write waits only for what it needs.
- Each task opens its own DuckDB connection, because tasks run in threads.
- A task whose upstream failed ends `NotReady` and never runs; the flow fails and names the tasks that did not complete.
- The state hooks `on_completion` and `on_failure` write one row per task run to `ops.pipeline_runs` (attempt = number of runs of the task), the same table as the runner of Lesson 7.

## Layers

| Layer | Module | Does |
|---|---|---|
| views | `views/questions.py`, `views/report.py` | the five questions, `out/report.md` and the Parquet files, always read from gold |
| processors | `processors/gold.py`, `processors/quality.py`, `processors/sql/*.sql` | the gold layer as views, the monthly frozen reports and the checks that stop the run |
| etls | `etls/tcgcsv.py`, `etls/extract.py`, `etls/landing.py` | the client of tcgcsv.com, the extraction and the idempotent load into `db_ingestion` |

`flows.py` (Lesson 8) and `pipeline.py` (Lesson 7) both call the same layers; neither changes them.

## Reference numbers (08/11/2026, Prefect 3.9.2, DuckDB 2.0.0, Python 3.14)

- First `tcg-dataapp flow`: 17 task runs completed, about 9 s from the first task to the last (17.4 s with the temporary server); 7 sets, 1,490 products, 5,951 prices in 5 captures; 5,951 rows = 5,951 keys of the grain; 524 cells; `report.mv_card_price_2026_09` created with 1,226 rows, Pikachu ex 276/217 at US$ 1,049.08. The runner of Lesson 7 took about 40 s, because it downloads the five archives one after the other.
- Second run: the five downloads end `Cached`; the fact keeps 5,951 rows, the frozen report is kept; 13.1 s in all, most of it the catalogue.
- `TCG_BASE_URL=https://tcgcsv.invalid TCG_RETRIES=2 TCG_RETRY_DELAY=1`: six network tasks fail three times (pauses of 1 and 2 s), the eleven tasks downstream end `NotReady`, the flow ends `Failed` after 3 s and nothing is written.
- Deployment `tcg-dataapp/daily` triggered by hand: 18 task runs (the five downloads `Cached`), 7,782 prices in 6 captures, 697 cells; the next three runs scheduled at 06:00 UTC.

# tcg-dataapp 0.5.0

The model of Lesson 6, automated as an installable Python package in Lesson 7, now with a Streamlit app in the views layer (Lesson 11). One command collects the prices that TCGplayer published for the Pokémon TCG sets of 2026, loads them into a local DuckDB file and builds the gold layer, the frozen and live reports, the five questions and the Parquet files of the marts; a second command opens the app that explains the DataApp and lets its users explore it.

Every date is Unix time in seconds (UTC) in the warehouse. The app converts it to a calendar day, in UTC, only when it draws it.

## Install and run

```bash
python3 -m venv .venv && source .venv/bin/activate
pip install -e '.[dev,app]'
tcg-dataapp run              # about 25 s; the archives of tcgcsv are downloaded once per date
tcg-dataapp app              # http://localhost:8501, from this folder (the theme is in .streamlit/)
tcg-dataapp status           # rows of db_ingestion and the last run
pytest                       # 22 tests, without network
```

Without the extra `app`, the package works as in Lesson 7 and `tests/test_app.py` is skipped.

## The app

`views/app.py` has three tabs and reads the warehouse through a read-only connection, only through the functions of `views/dashboard.py`, which never import Streamlit and are tested alone.

| Tab | Shows | Reads |
|---|---|---|
| Technical infographic | size of the model, the last run, the DAG of the last run and the lineage of the warehouse | `gold.*`, `ops.pipeline_runs`, `ops.pipeline_tasks`, `duckdb_views()`, `duckdb_tables()` |
| Ranking and drill-down | ranked bars over the frozen report or the live view; a click drills set › rarity › card; buttons roll up; the result is checked against the cube | `report.mv_card_price_<month>`, `report.v_card_price_latest`, `gold.agg_price_cube` |
| Prices over time | market value of each set, or the five most valuable cards of one set, with one series highlighted and the others as context | `mart_collectors.set_value`, `mart_collectors.card_price` |

Two small changes below the views give the infographic its metadata: `pipeline.py` keeps the graph of each run in `ops.pipeline_tasks`, and `freeze_month` writes the source of each frozen table in its comment, because a table created by `CREATE TABLE AS` does not keep the query that made it.

Accessibility choices: every chart has an alt text, a table view and a sentence that states its conclusion; the status of a task is written in its box; there is one y axis per chart, one accent colour (`#2f8f78`) and the rest in the ink and greys of the Inteli palette; the dates are drawn on a UTC scale, so a capture at 00:00 UTC is not shown as the evening before in São Paulo.

## Layers

| Layer | Module | Does |
|---|---|---|
| views | `views/app.py`, `views/dashboard.py`, `views/questions.py`, `views/report.py` | the app, the five questions, `out/report.md` and the Parquet files, always read from gold |
| processors | `processors/gold.py`, `processors/quality.py`, `processors/sql/*.sql` | the gold layer as views, the monthly frozen reports and the checks that stop the run |
| etls | `etls/tcgcsv.py`, `etls/extract.py`, `etls/landing.py` | the client of tcgcsv.com, the extraction and the idempotent load into `db_ingestion` |

## Reference numbers (08/11/2026, DuckDB 2.0.0, Streamlit 1.67.0)

Run of the rehearsal: 12 tasks ok in about 25 s; 7 sets, 1,273 cards, 5,951 prices in 5 captures, 524 cells in the cube; the lineage has 13 objects and 20 edges. Frozen report of September: highest price by set led by ME: Ascended Heroes (US$ 1,049.08, the Pikachu ex 276/217), and the 5 groups agree with the cube at grouping_id 3. On the last capture (07/11/2026) the most valuable card is Mew - R/RGB (ME: 30th Celebration, Holofoil) at US$ 4,492.45, and ME: 30th Celebration holds 65.3% of the market value of the seven sets. `pytest`: 22 tests in about 10 s.

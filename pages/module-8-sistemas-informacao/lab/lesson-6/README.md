# Lesson 6 · Lab: dimensional modelling in the browser

Module 8 · Information Systems · Inteli · Tuesday, 10/11/2026 · one hour of demonstration and one hour in groups

The lab is the page `index.html` of this folder, published with the module. It runs DuckDB compiled to WebAssembly (DuckDB-WASM 1.32.0, DuckDB 1.4.3) inside the browser, so nothing is installed. The theory of each step, the answers and the work of the second hour are in the reading material: `../../materials/lesson-6-material.html`.

## How the page works

1. On the first visit it downloads `data/db_ingestion.json.gz` (131 KB) and keeps it, in base64, in the localStorage of the browser (about 343 KB counted in UTF-16, of about 5 MB per site).
2. It creates the table `db_ingestion` from that copy and replays every statement that created, changed or dropped an object, which is also kept in the localStorage. The model survives a reload or the closing of the tab.
3. "Prompt" opens the CREATE prompt of a step (`prompts/`); "Reference SQL" loads the SQL of the professor (`sql/`). Ctrl+Enter runs every statement of the editor and shows one result per statement.
4. "Drop the model" removes every object except `db_ingestion`; "Forget everything" also removes the data and the draft of the editor.
5. The drill-down explorer at the bottom reads `report.mv_card_price_2026_09` (frozen in September) or `report.v_card_price_latest` (last capture) and draws ranked bars by the dimensions checked (set, rarity, card, variant). Clicking a bar drills down along set › rarity › card, the chips of the path roll up, and the side panel shows the SQL of the view and checks that the same level of `gold.agg_price_cube` (its `grouping_id`) gives the same numbers.

## The data

Every date of the lab is Unix time, in seconds since 1970-01-01 UTC: `timestamp` in the landing table, `date_unix` (00:00 UTC of the day) in `gold.dim_date` and in the fact, `released_at` in `gold.dim_set` and `captured_at` in the mart and the reports. Month, quarter and year are labels of the hierarchy.


`db_ingestion(timestamp BIGINT, data_json JSON, data_tag VARCHAR)`, captured on 07/11/2026 from tcgcsv.com, the public daily mirror of the catalogue and the prices of TCGplayer (category 3, Pokémon):

| data_tag | One record is | Rows |
|---|---|---:|
| `tcgplayer.set.v1` | a set released in 2026 | 7 |
| `tcgplayer.product.v1` | a product: 1,273 cards and 217 sealed products | 1,490 |
| `tcgplayer.price.v1` | the prices of a product in one printing, on 01/03, 01/05, 01/07, 01/09 and 07/11/2026 | 5,951 |

`data/db_ingestion.json` is the same file uncompressed (2.2 MB), for the groups who want to load it elsewhere. `capture/capture_tcgplayer.py` rebuilds both files (professor only; needs `py7zr`).

## Steps

The whole gold layer (dimensions, fact and cube) and the mart are views. Only the reports of step 04 that are frozen in September store data, as tables built with `CREATE TABLE ... AS`, because DuckDB has no materialized view.

| Step | Prompt | Reference | Checks |
|---|---|---|---|
| 01 · 10 min | `prompts/01_dimensions.md` | `sql/01_dimensions.sql` | 7 sets, 1,490 products (1,273 cards), 3 variants, 5 dates |
| 02 · 6 min | `prompts/02_fact.md` | `sql/02_fact.sql` | the fact is a view; 5,951 rows = 5,951 keys of the grain; 49 without market price |
| 03 · 10 min | `prompts/03_cube_and_mart.md` | `sql/03_cube_and_mart.sql` | cube and mart are views; 524 cells in 8 levels; US$ 18,989.68 on 07/11 |
| 04 · 7 min | `prompts/04_reports.md` | `sql/04_reports.sql` | Pikachu ex 276/217: 1,049.08 frozen in September; 571.17 live, 600.00 after a simulated capture |
| 05 · 7 min | `prompts/05_questions.md` | `sql/05_questions.sql` | only Pikachu ex 276/217 appreciated: +18.9 %, +US$ 90.59 |
| second hour | `prompts/06_your_data_clickhouse.md` | — | the partner data in `lab.gNN_` on shrek2 (`http://10.8.8.10:8123/play`) |

## Rehearsal

Measured on 07/11/2026 in Chromium headless (DuckDB-WASM 1.32.0) and confirmed with the Python package `duckdb==1.4.3`: the five reference files run without error, and a reload replays the statements of the model in order, so the reports of September stay frozen.

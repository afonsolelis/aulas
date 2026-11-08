# Lesson 6 · Lab: dimensional modelling in the browser

Module 8 · Information Systems · Inteli · Tuesday, 10/11/2026 · one hour of demonstration and one hour in groups

The lab is the page `index.html` of this folder, published with the module. It runs DuckDB compiled to WebAssembly (DuckDB-WASM 1.32.0, DuckDB 1.4.3) inside the browser, so nothing is installed. The theory of each step, the answers and the work of the second hour are in the reading material: `../../materials/lesson-6-material.html`.

## How the page works

1. On the first visit it downloads `data/db_ingestion.json.gz` (132 KB) and keeps it, in base64, in the localStorage of the browser (about 343 KB counted in UTF-16, of about 5 MB per site).
2. It creates the table `db_ingestion` from that copy and replays every statement that created, changed or dropped an object, which is also kept in the localStorage. The model survives a reload or the closing of the tab.
3. "Prompt" opens the CREATE prompt of a step (`prompts/`); "Reference SQL" loads the SQL of the professor (`sql/`). Ctrl+Enter runs every statement of the editor and shows one result per statement.
4. "Drop the model" removes every object except `db_ingestion`; "Forget everything" also removes the data and the draft of the editor.

## The data

`db_ingestion(timestamp TIMESTAMP, data_json JSON, data_tag VARCHAR)`, captured on 07/11/2026 from tcgcsv.com, the public daily mirror of the catalogue and the prices of TCGplayer (category 3, Pokémon):

| data_tag | One record is | Rows |
|---|---|---:|
| `tcgplayer.set.v1` | a set released in 2026 | 7 |
| `tcgplayer.product.v1` | a product: 1,273 cards and 217 sealed products | 1,490 |
| `tcgplayer.price.v1` | the prices of a product in one printing, on 01/03, 01/05, 01/07, 01/09 and 07/11/2026 | 5,951 |

`data/db_ingestion.json` is the same file uncompressed (2.3 MB), for the groups who want to load it elsewhere. `build/capture_tcgplayer.py` rebuilds both files (professor only; needs `py7zr`).

## Steps

| Step | Prompt | Reference | Checks |
|---|---|---|---|
| 01 · 12 min | `prompts/01_dimensions.md` | `sql/01_dimensions.sql` | 7 sets, 1,490 products (1,273 cards), 3 variants, 5 dates |
| 02 · 8 min | `prompts/02_fact.md` | `sql/02_fact.sql` | 5,951 rows = 5,951 keys of the grain; 49 without market price |
| 03 · 12 min | `prompts/03_cube_and_mart.md` | `sql/03_cube_and_mart.sql` | 524 cells in 8 levels; US$ 18,989.68 on 07/11 |
| 04 · 10 min | `prompts/04_questions.md` | `sql/04_questions.sql` | only Pikachu ex 276/217 appreciated: +18.9 %, +US$ 90.59 |
| second hour | `prompts/05_your_data_clickhouse.md` | — | the partner data in `lab.gNN_` on shrek2 (`http://10.8.8.10:8123/play`) |

## Rehearsal

Measured on 07/11/2026 in Chromium headless (DuckDB-WASM 1.32.0) and confirmed with the Python package `duckdb==1.4.3`: the four reference files run without error, in about 0.1 s each, and a reload replays the 11 statements of the model.

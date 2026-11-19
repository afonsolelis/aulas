-- Tradeline telemetry harmonisation lab · no-login starter (DuckDB)
-- Tradeline is a fictional company and every file is synthetic.
-- Run from the folder that holds the CSV files:
--   duckdb tradeline.duckdb < starter_duckdb.sql
-- The script only lands the files in a bronze schema, as text, with the source
-- file and the load time. Typing, harmonisation and the gold layer are the lab.

CREATE SCHEMA IF NOT EXISTS bronze;

-- Brazil uses a semicolon separator and a comma as decimal mark.
CREATE OR REPLACE TABLE bronze.checkout_events_br AS
SELECT *, 'checkout_events_br.csv' AS _source_file, now() AS _loaded_at
FROM read_csv('checkout_events_br.csv', delim = ';', header = true, all_varchar = true);

CREATE OR REPLACE TABLE bronze.checkout_events_mx AS
SELECT *, 'checkout_events_mx.csv' AS _source_file, now() AS _loaded_at
FROM read_csv('checkout_events_mx.csv', header = true, all_varchar = true);

CREATE OR REPLACE TABLE bronze.checkout_events_co AS
SELECT *, 'checkout_events_co.csv' AS _source_file, now() AS _loaded_at
FROM read_csv('checkout_events_co.csv', header = true, all_varchar = true);

CREATE OR REPLACE TABLE bronze.checkout_events_za AS
SELECT *, 'checkout_events_za.csv' AS _source_file, now() AS _loaded_at
FROM read_csv('checkout_events_za.csv', header = true, all_varchar = true);

CREATE OR REPLACE TABLE bronze.checkout_events_do AS
SELECT *, 'checkout_events_do.csv' AS _source_file, now() AS _loaded_at
FROM read_csv('checkout_events_do.csv', header = true, all_varchar = true);

CREATE OR REPLACE TABLE bronze.fx_rates AS
SELECT *, 'fx_rates.csv' AS _source_file, now() AS _loaded_at
FROM read_csv('fx_rates.csv', header = true, all_varchar = true);

CREATE OR REPLACE TABLE bronze.dim_retailer AS
SELECT *, 'dim_retailer.csv' AS _source_file, now() AS _loaded_at
FROM read_csv('dim_retailer.csv', header = true, all_varchar = true);

CREATE OR REPLACE TABLE bronze.local_reported_kpis AS
SELECT *, 'local_reported_kpis.csv' AS _source_file, now() AS _loaded_at
FROM read_csv('local_reported_kpis.csv', header = true, all_varchar = true);

CREATE OR REPLACE TABLE bronze.orchestration_graph AS
SELECT *, 'orchestration_graph.csv' AS _source_file, now() AS _loaded_at
FROM read_csv('orchestration_graph.csv', header = true, all_varchar = true);

-- First look: rows and distinct event names per market.
SELECT 'BR' AS market, count(*) AS n_rows, count(DISTINCT nome_evento) AS n_event_names FROM bronze.checkout_events_br
UNION ALL SELECT 'MX', count(*), count(DISTINCT event_type) FROM bronze.checkout_events_mx
UNION ALL SELECT 'CO', count(*), count(DISTINCT event) FROM bronze.checkout_events_co
UNION ALL SELECT 'ZA', count(*), count(DISTINCT evt) FROM bronze.checkout_events_za
UNION ALL SELECT 'DO', count(*), count(DISTINCT estado) FROM bronze.checkout_events_do;

-- Lesson 6 · Step 04 · Reports frozen in time and reports always current
--
-- Reference of the professor for prompt 04.
--
-- The gold layer and the mart are views, so they always show the last
-- capture. A report sometimes has to stay as it was published: the prices
-- of September go to the partner on 01/09 and must not change afterwards.
-- DuckDB has no materialized view; a materialized report is a table built
-- with CREATE TABLE ... AS, which stores the result of that moment and keeps
-- it until someone builds it again. A live report is a normal view.

CREATE SCHEMA IF NOT EXISTS report;

-- Materialized, frozen: what the market looked like in September 2026.
CREATE OR REPLACE TABLE report.mv_card_price_2026_09 AS
SELECT set_name, card, rarity, variant, market_price
FROM mart_collectors.card_price
WHERE strftime(date, '%Y-%m') = '2026-09';

CREATE OR REPLACE TABLE report.mv_set_value_2026_09 AS
SELECT set_name, prices, market_value
FROM mart_collectors.set_value
WHERE strftime(date, '%Y-%m') = '2026-09';

-- Normal views, live: always the last capture that arrived.
CREATE OR REPLACE VIEW report.v_card_price_latest AS
SELECT date, set_name, card, rarity, variant, market_price
FROM mart_collectors.card_price
WHERE date = (SELECT max(date) FROM mart_collectors.card_price);

CREATE OR REPLACE VIEW report.v_set_value_latest AS
SELECT date, set_name, prices, market_value
FROM mart_collectors.set_value
WHERE date = (SELECT max(date) FROM mart_collectors.set_value);

-- Before: the Pikachu ex 276/217 in the frozen report and in the live one.
SELECT 'before' AS moment,
       (SELECT market_price FROM report.mv_card_price_2026_09 WHERE card = 'Pikachu ex - 276/217') AS frozen_september,
       (SELECT market_price FROM report.v_card_price_latest  WHERE card = 'Pikachu ex - 276/217') AS live_latest,
       (SELECT max(date) FROM report.v_card_price_latest)                                          AS live_date;

-- A new capture arrives in the landing table. This record is SIMULATED for
-- the demonstration: a price of US$ 600.00 on 10/11/2026.
INSERT INTO db_ingestion VALUES (
    TIMESTAMP '2026-11-10 12:00:00',
    '{"productId":676088,"lowPrice":560.0,"midPrice":690.0,"highPrice":5000.0,"marketPrice":600.0,"directLowPrice":null,"subTypeName":"Holofoil"}',
    'tcgplayer.price.v1');

-- After: the view followed the new capture; the materialized report did not.
SELECT 'after' AS moment,
       (SELECT market_price FROM report.mv_card_price_2026_09 WHERE card = 'Pikachu ex - 276/217') AS frozen_september,
       (SELECT market_price FROM report.v_card_price_latest  WHERE card = 'Pikachu ex - 276/217') AS live_latest,
       (SELECT max(date) FROM report.v_card_price_latest)                                          AS live_date;

-- Remove the simulated capture, so that the next steps use only real data.
DELETE FROM db_ingestion WHERE timestamp = TIMESTAMP '2026-11-10 12:00:00';

-- What each object of the model keeps.
SELECT schema_name, table_name AS object, 'table (materialized)' AS kind, estimated_size AS rows
FROM duckdb_tables() WHERE schema_name IN ('gold', 'mart_collectors', 'report')
UNION ALL
SELECT schema_name, view_name, 'view (computed at every read)', NULL
FROM duckdb_views() WHERE schema_name IN ('gold', 'mart_collectors', 'report') AND NOT internal
ORDER BY schema_name, kind, object;

-- Lesson 6 · Step 01 · Dimensions over the landing table
--
-- Reference of the professor for prompt 01. In class the coding agent writes
-- its own version and the professor runs it in the lab page.
-- Everything reads db_ingestion, where each record is a JSON object with
-- the field names of TCGplayer.
--
-- Dimensions are views: they store no copy and always show the current
-- state of db_ingestion. Every date is Unix time, in seconds since
-- 1970-01-01 UTC, as the column timestamp of db_ingestion.

CREATE SCHEMA IF NOT EXISTS gold;

-- The extended attributes of a product arrive as a list of {name, value}.
CREATE OR REPLACE MACRO gold.attr(j, attr_name) AS
    list_filter(from_json(json_extract(j, '$.extendedData'), '[{"name":"VARCHAR","value":"VARCHAR"}]'),
                lambda e: e.name = attr_name)[1].value;

-- Set (collection): one row per set released in 2026.
CREATE OR REPLACE VIEW gold.dim_set AS
SELECT
    CAST(data_json->>'groupId' AS INTEGER)              AS set_id,
    data_json->>'name'                                  AS set_name,
    data_json->>'abbreviation'                          AS set_code,
    CAST(epoch(CAST(data_json->>'publishedOn' AS TIMESTAMP)) AS BIGINT) AS released_at,
    strftime(CAST(data_json->>'publishedOn' AS TIMESTAMP), '%Y-%m')     AS release_month
FROM db_ingestion
WHERE data_tag = 'tcgplayer.set.v1';

-- Product: a single card (it has a collector number) or a sealed product.
-- Hierarchy of the card: set > rarity > card.
CREATE OR REPLACE VIEW gold.dim_product AS
SELECT
    CAST(data_json->>'productId' AS INTEGER)            AS product_id,
    CAST(data_json->>'groupId' AS INTEGER)              AS set_id,
    data_json->>'name'                                  AS product_name,
    CASE WHEN gold.attr(data_json, 'Number') IS NULL THEN 'sealed' ELSE 'card' END AS kind,
    gold.attr(data_json, 'Number')                      AS number,
    coalesce(gold.attr(data_json, 'Rarity'), 'n/a')     AS rarity,
    gold.attr(data_json, 'Card Type')                   AS card_type,
    TRY_CAST(gold.attr(data_json, 'HP') AS INTEGER)     AS hp,
    gold.attr(data_json, 'Stage')                       AS stage
FROM db_ingestion
WHERE data_tag = 'tcgplayer.product.v1';

-- Variant: the printing of a card, which TCGplayer prices separately.
CREATE OR REPLACE VIEW gold.dim_variant AS
SELECT DISTINCT data_json->>'subTypeName' AS variant
FROM db_ingestion
WHERE data_tag = 'tcgplayer.price.v1';

-- Date of capture, with the hierarchy year > quarter > month > day. The key
-- date_unix is the Unix time of 00:00 UTC of the day of the capture.
CREATE OR REPLACE VIEW gold.dim_date AS
SELECT DISTINCT
    timestamp // 86400 * 86400                            AS date_unix,
    strftime(epoch_ms(timestamp * 1000), '%Y-%m')         AS month,
    year(epoch_ms(timestamp * 1000)) || '-Q' || quarter(epoch_ms(timestamp * 1000)) AS quarter,
    year(epoch_ms(timestamp * 1000))                      AS year
FROM db_ingestion
WHERE data_tag = 'tcgplayer.price.v1';

-- Check: 7 sets, 1,490 products (1,273 cards), 3 variants, 5 dates.
SELECT 'dim_set' AS dimension, count(*) AS rows FROM gold.dim_set
UNION ALL SELECT 'dim_product', count(*) FROM gold.dim_product
UNION ALL SELECT 'dim_product (cards)', count(*) FROM gold.dim_product WHERE kind = 'card'
UNION ALL SELECT 'dim_variant', count(*) FROM gold.dim_variant
UNION ALL SELECT 'dim_date', count(*) FROM gold.dim_date;

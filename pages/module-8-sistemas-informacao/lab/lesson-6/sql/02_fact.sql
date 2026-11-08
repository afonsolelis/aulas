-- Lesson 6 · Step 02 · The fact, as a view, and the test of the grain
--
-- Reference of the professor for prompt 02.
--
-- gold.fact_price is a periodic snapshot: one product, in one variant, on
-- one date of capture. Like every object of gold it is a view: it keeps no
-- copy, reads db_ingestion at every query and always shows the last
-- capture that arrived. Its prices are semi-additive: the market price of
-- all the cards of a set on one date adds up to the cost of the set, but
-- adding the same card over several dates means nothing.

CREATE OR REPLACE VIEW gold.fact_price AS
SELECT
    CAST(strftime(i.timestamp, '%Y%m%d') AS INTEGER)   AS date_key,
    CAST(i.data_json->>'productId' AS INTEGER)          AS product_id,
    p.set_id,
    i.data_json->>'subTypeName'                         AS variant,
    CAST(i.data_json->>'marketPrice' AS DECIMAL(10, 2)) AS market_price,
    CAST(i.data_json->>'lowPrice' AS DECIMAL(10, 2))    AS low_price,
    CAST(i.data_json->>'midPrice' AS DECIMAL(10, 2))    AS mid_price,
    CAST(i.data_json->>'highPrice' AS DECIMAL(10, 2))   AS high_price,
    date_diff('day', s.released_on, CAST(i.timestamp AS DATE)) AS days_since_release
FROM db_ingestion AS i
JOIN gold.dim_product AS p ON p.product_id = CAST(i.data_json->>'productId' AS INTEGER)
JOIN gold.dim_set     AS s ON s.set_id = p.set_id
WHERE i.data_tag = 'tcgplayer.price.v1';

-- The test of the grain: rows = distinct (date, product, variant).
SELECT count(*) AS rows,
       count(DISTINCT (date_key, product_id, variant)) AS grain_keys,
       count(*) FILTER (WHERE market_price IS NULL)    AS without_market_price
FROM gold.fact_price;

-- Prices per date and set: the sets released later appear later.
SELECT d.date, s.set_code, count(*) AS prices
FROM gold.fact_price AS f
JOIN gold.dim_date AS d USING (date_key)
JOIN gold.dim_set  AS s USING (set_id)
GROUP BY ALL ORDER BY d.date, s.set_code;

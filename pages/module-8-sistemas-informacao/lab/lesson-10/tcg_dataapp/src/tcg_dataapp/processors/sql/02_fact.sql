-- tcg_dataapp · processors · 02 · The fact, as a view (from Lesson 6)
--
-- gold.fact_price is a periodic snapshot: one product, in one variant, on
-- one date of capture. Like every object of gold it is a view: it keeps no
-- copy, reads db_ingestion at every query and always shows the last
-- capture that arrived. Its prices are semi-additive: the market price of
-- all the cards of a set on one date adds up to the cost of the set, but
-- adding the same card over several dates means nothing.

CREATE OR REPLACE VIEW gold.fact_price AS
SELECT
    i.timestamp // 86400 * 86400                        AS date_unix,
    CAST(i.data_json->>'productId' AS INTEGER)          AS product_id,
    p.set_id,
    i.data_json->>'subTypeName'                         AS variant,
    CAST(i.data_json->>'marketPrice' AS DECIMAL(10, 2)) AS market_price,
    CAST(i.data_json->>'lowPrice' AS DECIMAL(10, 2))    AS low_price,
    CAST(i.data_json->>'midPrice' AS DECIMAL(10, 2))    AS mid_price,
    CAST(i.data_json->>'highPrice' AS DECIMAL(10, 2))   AS high_price,
    (i.timestamp // 86400 * 86400 - s.released_at) // 86400 AS days_since_release
FROM db_ingestion AS i
JOIN gold.dim_product AS p ON p.product_id = CAST(i.data_json->>'productId' AS INTEGER)
JOIN gold.dim_set     AS s ON s.set_id = p.set_id
WHERE i.data_tag = 'tcgplayer.price.v1';

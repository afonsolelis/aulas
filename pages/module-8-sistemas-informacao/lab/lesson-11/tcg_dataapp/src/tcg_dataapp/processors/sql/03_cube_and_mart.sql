-- tcg_dataapp · processors · 03 · The cube and the mart of the collectors, all views (from Lesson 6)
--
-- The cube is a view too: the whole gold layer is computed at query time
-- from db_ingestion, so it is always current. The cube crosses set, rarity
-- and variant on every date. It groups by
-- set_name and not by set_code, because the code 30C belongs to two sets
-- (ME: 30th Celebration and its Classic Collection): a natural key that
-- repeats would merge them.
--
-- The cube crosses set, rarity and variant on every date (date_unix). Because the price
-- is semi-additive, the date stays in every grouping: GROUP BY date_unix and
-- CUBE of the other three. A cell answers "on this date, how much did the
-- cards of this set, of this rarity, in this variant cost?".

CREATE OR REPLACE VIEW gold.agg_price_cube AS
SELECT
    f.date_unix,
    grouping(s.set_name, p.rarity, f.variant) AS grouping_id,
    coalesce(s.set_name, 'all')               AS set_name,
    coalesce(p.rarity, 'all')                 AS rarity,
    coalesce(f.variant, 'all')                AS variant,
    count(*)                                  AS prices,
    sum(f.market_price)                       AS market_value,
    round(avg(f.market_price), 2)             AS avg_market_price,
    max(f.market_price)                       AS max_market_price
FROM gold.fact_price AS f
JOIN gold.dim_product AS p USING (product_id)
JOIN gold.dim_set     AS s ON s.set_id = f.set_id
WHERE p.kind = 'card' AND f.market_price IS NOT NULL
GROUP BY f.date_unix, CUBE (s.set_name, p.rarity, f.variant);

-- A data mart for the collectors area: friendly names, one view per question.
CREATE SCHEMA IF NOT EXISTS mart_collectors;

CREATE OR REPLACE VIEW mart_collectors.card_price AS
SELECT f.date_unix AS captured_at, d.month, s.set_code, s.set_name, s.released_at,
       p.product_name AS card, p.number, p.rarity, f.variant, f.market_price, f.days_since_release
FROM gold.fact_price AS f
JOIN gold.dim_date    AS d USING (date_unix)
JOIN gold.dim_product AS p USING (product_id)
JOIN gold.dim_set     AS s ON s.set_id = f.set_id
WHERE p.kind = 'card';

CREATE OR REPLACE VIEW mart_collectors.set_value AS
SELECT c.date_unix AS captured_at, d.month, c.set_name, c.prices, c.market_value
FROM gold.agg_price_cube AS c
JOIN gold.dim_date AS d USING (date_unix)
WHERE c.grouping_id = 3;

-- Lesson 6 · Step 03 · The cube and a data mart for collectors
--
-- Reference of the professor for prompt 03.
--
-- The cube crosses set, rarity and variant on every date. It groups by
-- set_name and not by set_code, because the code 30C belongs to two sets
-- (ME: 30th Celebration and its Classic Collection): a natural key that
-- repeats would merge them.
--
-- The cube crosses set, rarity and variant on every date. Because the price
-- is semi-additive, the date stays in every grouping: GROUP BY date_key and
-- CUBE of the other three. A cell answers "on this date, how much did the
-- cards of this set, of this rarity, in this variant cost?".

CREATE OR REPLACE TABLE gold.agg_price_cube AS
SELECT
    f.date_key,
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
GROUP BY f.date_key, CUBE (s.set_name, p.rarity, f.variant);

-- A data mart for the collectors area: friendly names, one view per question.
CREATE SCHEMA IF NOT EXISTS mart_collectors;

CREATE OR REPLACE VIEW mart_collectors.card_price AS
SELECT d.date, s.set_code, s.set_name, s.released_on, p.product_name AS card, p.number,
       p.rarity, f.variant, f.market_price, f.days_since_release
FROM gold.fact_price AS f
JOIN gold.dim_date    AS d USING (date_key)
JOIN gold.dim_product AS p USING (product_id)
JOIN gold.dim_set     AS s ON s.set_id = f.set_id
WHERE p.kind = 'card';

CREATE OR REPLACE VIEW mart_collectors.set_value AS
SELECT d.date, c.set_name, c.prices, c.market_value
FROM gold.agg_price_cube AS c
JOIN gold.dim_date AS d USING (date_key)
WHERE c.grouping_id = 3;

-- Size of the cube by level.
SELECT grouping_id,
       CASE grouping_id
           WHEN 0 THEN 'set x rarity x variant' WHEN 1 THEN 'set x rarity'
           WHEN 2 THEN 'set x variant'          WHEN 3 THEN 'set'
           WHEN 4 THEN 'rarity x variant'       WHEN 5 THEN 'rarity'
           WHEN 6 THEN 'variant'                WHEN 7 THEN 'all cards' END AS level,
       count(*) AS cells
FROM gold.agg_price_cube
GROUP BY ALL ORDER BY grouping_id;

-- Why the date stays in the grouping: the value of all cards on the last
-- date is meaningful; the sum of that value over the five dates is not.
SELECT
    (SELECT market_value FROM gold.agg_price_cube WHERE grouping_id = 7 AND date_key = 20261107) AS value_on_2026_11_07,
    (SELECT sum(market_value) FROM gold.agg_price_cube WHERE grouping_id = 7)                    AS sum_over_dates_meaningless;

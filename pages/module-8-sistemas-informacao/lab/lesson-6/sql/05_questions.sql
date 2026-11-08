-- Lesson 6 · Step 05 · Five questions, one OLAP operation each
--
-- Reference of the professor for prompt 05. Every question reads the cube or
-- the mart, never db_ingestion.

-- Q1 · Roll-up: from the card to the rarity. On 07/11/2026, how much is
--      the average card of each rarity worth?
SELECT rarity, prices, avg_market_price, max_market_price
FROM gold.agg_price_cube
WHERE date_key = 20261107 AND grouping_id = 5
ORDER BY avg_market_price DESC;

-- Q2 · Slice: one set. Which are the five most expensive cards of
--      Ascended Heroes on 07/11/2026?
SELECT card, rarity, variant, market_price
FROM mart_collectors.card_price
WHERE set_code = 'ASC' AND date = DATE '2026-11-07'
ORDER BY market_price DESC LIMIT 5;

-- Q3 · Pivot: sets as rows, dates as columns. How did the market value of
--      one copy of every card of each set change? (semi-additive: it adds
--      cards inside a date, never dates)
PIVOT (SELECT set_name, strftime(date, '%m-%d') AS day, market_value FROM mart_collectors.set_value)
ON day USING sum(market_value)
GROUP BY set_name
ORDER BY set_name;

-- Q4 · Dice and pivot: the four lowest rarities, the three variants, the
--      last date. How much does each printing of the same rarity cost?
PIVOT (SELECT rarity, variant, avg_market_price
       FROM gold.agg_price_cube
       WHERE date_key = 20261107 AND grouping_id = 4
         AND rarity IN ('Common', 'Uncommon', 'Rare', 'Double Rare'))
ON variant IN ('Normal', 'Reverse Holofoil', 'Holofoil') USING max(avg_market_price)
GROUP BY rarity
ORDER BY rarity;

-- Q5 · The question of the session. Which cards appreciated most between
--      their first capture and 07/11/2026? Cards that cost at least US$ 5 at
--      the first capture, so that a few cents do not become 100 %.
WITH first_and_last AS (
    SELECT set_code, card, rarity, variant,
           arg_min(market_price, date) AS first_price,
           min(date)                   AS first_date,
           arg_max(market_price, date) AS last_price
    FROM mart_collectors.card_price
    WHERE market_price IS NOT NULL
    GROUP BY ALL
    HAVING count(*) >= 2
)
SELECT set_code, card, rarity, variant, first_date, first_price, last_price,
       last_price - first_price                         AS gain_usd,
       round(100 * (last_price / first_price - 1), 1)  AS gain_pct
FROM first_and_last
WHERE first_price >= 5
ORDER BY gain_pct DESC
LIMIT 10;

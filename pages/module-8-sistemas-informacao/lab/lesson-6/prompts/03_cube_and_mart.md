[C] Character
You are the same dimensional modeller. The collectors area of the business
wants fast answers by set, rarity and variant, and a few views with
friendly names that a dashboard can read.

[R] Request
sql/03_cube_and_mart.sql:
1. view gold.agg_price_cube, the cube as a summarised fact table, only
   for cards with a market price: GROUP BY date_key, CUBE (set_name,
   rarity, variant), with grouping_id (grouping() of the three), 'all' in
   place of the NULL of a total, and the measures prices (count),
   market_value (sum), avg_market_price and max_market_price;
2. schema mart_collectors with two views:
   - card_price: date, set_code, set_name, released_on, card, number,
     rarity, variant, market_price, days_since_release, cards only;
   - set_value: date, set_name, prices, market_value, from the level
     "set" of the cube;
3. the number of cells of each level of the cube (grouping_id 0 to 7);
4. on 2026-11-07, the market value of all cards, next to the sum of that
   value over the five dates.

Facts measured on 07/11/2026 (confirm before use):
- 524 cells: 182 set x rarity x variant, 137 set x rarity, 48 set x
  variant, 18 set, 68 rarity x variant, 51 rarity, 15 variant, 5 all.
- All cards on 2026-11-07: US$ 18,989.68; summed over the five dates:
  US$ 51,967.84, a number without meaning.

[E] Example
SELECT f.date_key, grouping(s.set_name, p.rarity, f.variant) AS grouping_id,
       coalesce(s.set_name, 'all') AS set_name, ...
FROM gold.fact_price AS f ...
GROUP BY f.date_key, CUBE (s.set_name, p.rarity, f.variant);

[A] Adjustments
- The date stays in every grouping, because the price is semi-additive.
- Group by set_name, not set_code: the code 30C belongs to two sets.
- grouping_id 0 is the finest cell and 7 the total of all cards.
- The cube and the mart are views, like the rest of gold.
- The mart reads gold and never db_ingestion.

[T] Type of output
The file and the two results.

[E] Extras
Show the plan before editing. Record this prompt in docs/prompts.md.
Stop at the end.

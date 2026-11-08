[C] Character
You are the same dimensional modeller. Every object of gold and of the
mart is a view, so the model always shows the last capture. The collectors
area also needs reports that stay as they were published.

[R] Request
sql/04_reports.sql, schema report:
1. two materialized reports frozen in September 2026, as tables built with
   CREATE TABLE ... AS from the mart:
   - report.mv_card_price_2026_09: set_name, card, rarity, variant,
     market_price of the capture of 2026-09;
   - report.mv_set_value_2026_09: set_name, prices, market_value of the
     same capture;
2. two live reports, as normal views over the last capture:
   - report.v_card_price_latest and report.v_set_value_latest, with the
     date of the capture;
3. a demonstration in three statements: the market price of
   "Pikachu ex - 276/217" in the frozen report and in the live one; an
   INSERT into db_ingestion of a SIMULATED price record of that card
   (productId 676088, Holofoil, marketPrice 600.0, timestamp
   2026-11-10 12:00:00); the same comparison again; then a DELETE of the
   simulated record;
4. a final SELECT that lists every object of gold, mart_collectors and
   report with its kind (table or view).

Facts measured on 07/11/2026 (confirm before use):
- The frozen report keeps 1,226 card prices and the value of 5 sets.
- Pikachu ex 276/217: 1,049.08 in September (frozen), 571.17 on
  2026-11-07 (live); after the simulated capture the live view shows
  600.00 on 2026-11-10 and the frozen report still 1,049.08.

[E] Example
CREATE OR REPLACE TABLE report.mv_set_value_2026_09 AS
SELECT set_name, prices, market_value
FROM mart_collectors.set_value
WHERE strftime(date, '%Y-%m') = '2026-09';

[A] Adjustments
- DuckDB has no materialized view: the materialized report is a table,
  and refreshing it means running its CREATE again.
- The live views filter the last date with max(date), never a fixed date.
- Mark the INSERT as simulated in a comment, and remove it at the end.

[T] Type of output
The file and the results of the two comparisons.

[E] Extras
Show the plan before editing. Record this prompt in docs/prompts.md.
Stop at the end.

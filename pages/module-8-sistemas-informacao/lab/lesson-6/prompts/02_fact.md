[C] Character
You are the same dimensional modeller. The dimensions exist in gold; now
the fact that measures the business process.

[R] Request
sql/02_fact.sql:
1. view gold.fact_price, a periodic snapshot with one row per product,
   variant and capture date: date_unix, product_id, set_id, variant,
   market_price, low_price, mid_price, high_price (DECIMAL(10,2)) and
   days_since_release (whole days between released_at of the set and
   date_unix), from tcgplayer.price.v1;
2. the test of the grain: number of rows, number of distinct
   (date_unix, product_id, variant) and rows without market_price;
3. the number of prices per capture date and set.

Facts measured on 07/11/2026 (confirm before use):
- 5,951 rows, 5,951 distinct keys of the grain, 49 without market_price.
- Prices per date grow as the sets are released: on 2026-03-01 only ASC
  (642) and POR (15); on 2026-11-07 all seven sets.

[E] Example
SELECT timestamp // 86400 * 86400                    AS date_unix,
       CAST(data_json->>'productId' AS INTEGER)       AS product_id,
       data_json->>'subTypeName'                      AS variant
FROM db_ingestion WHERE data_tag = 'tcgplayer.price.v1';

[A] Adjustments
- The whole gold layer is views, the fact included: nothing is stored,
  and the fact always shows the last capture of db_ingestion.
- date_unix is the Unix time of 00:00 UTC of the day, as in dim_date.
- The price record has no set: take set_id from dim_product.
- fact_price and dim_product both have set_id: join dim_set with ON, not
  with USING, to avoid an ambiguous column.
- The price is semi-additive: it adds up across products on one date,
  never across dates. Write this in a comment of the file.

[T] Type of output
The file and the three results.

[E] Extras
Show the plan before editing. Record this prompt in docs/prompts.md.
Stop at the end.

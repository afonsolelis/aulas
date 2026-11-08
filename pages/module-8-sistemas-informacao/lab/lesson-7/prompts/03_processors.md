[C] Character
You are the same engineer. The landing table is filled; now the layer
that turns it into the gold layer of Lesson 6.

[R] Request
In src/tcg_dataapp/processors/:
1. sql/01_dimensions.sql, 02_fact.sql and 03_cube_and_mart.sql: the SQL of
   Lesson 6 (lab/lesson-6/sql), without its check queries, every object a
   view; sql/04_live_reports.sql with report.v_card_price_latest and
   report.v_set_value_latest.
2. gold.py: build_gold(con), which runs the four files statement by
   statement from the package data (importlib.resources), and
   freeze_month(con, month), which creates report.mv_card_price_<YYYY_MM>
   and report.mv_set_value_<YYYY_MM> as tables from the LAST capture of
   that month, only if they do not exist yet, and returns created, kept or
   no data for each one.
3. quality.py: check_gold(con), which raises QualityError when a tag of
   db_ingestion is empty, when the grain of gold.fact_price is broken or
   when a price has no set, and otherwise returns the numbers it measured.

Facts measured on 07/11/2026 (confirm before use):
- fact_rows 5,951 = fact_grain_keys 5,951; fact_without_set 0; dates 5;
  cube_cells 524; mv_card_price_2026_09 created with 1,226 rows.
- After a second run, db_ingestion has the catalogue twice (14 set
  records, 2,980 product records) and the fact still 5,951 rows.

[E] Example
QUALIFY row_number() OVER (PARTITION BY data_json->>'productId'
                           ORDER BY timestamp DESC) = 1

[A] Adjustments
- Every run captures the catalogue again: dim_set and dim_product keep
  only the last version of each id, or the grain of the fact breaks.
- A frozen report is never replaced; a month with two captures uses the
  last one, because the price is semi-additive.
- The month must match YYYY-MM before it reaches the name of a table.

[T] Type of output
The files and the numbers returned by check_gold and freeze_month.

[E] Extras
Show the plan before editing. Record this prompt in docs/prompts.md.
Stop at the end.

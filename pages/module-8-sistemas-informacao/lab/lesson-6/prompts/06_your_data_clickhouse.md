[C] Character
You are the dimensional modeller of our group. Our partner data already
went through the enrichment of Lesson 5. Now it becomes a star and a cube
in the ClickHouse of the class (shrek2), in the database lab, where every
object of the group starts with gNN_.

[R] Request
1. specs/dimensional_model.md: the business process of the partner that
   we measure, the grain of the fact in one sentence, the dimensions with
   their hierarchies, the measures classified as additive, semi-additive or
   non-additive, and five questions of the partner, each one with the OLAP
   operation that answers it (roll-up, drill-down, slice, dice or pivot).
2. sql/clickhouse/00_db_ingestion.sql: table lab.gNN_db_ingestion
   (timestamp Int64, data_json String, data_tag LowCardinality(String)),
   MergeTree ORDER BY (data_tag, timestamp), with timestamp in Unix time
   (seconds, UTC), and the command that loads our enriched data into it.
3. sql/clickhouse/01_dimensions.sql: one view lab.gNN_dim_<name> per
   dimension, with JSONExtractString, JSONExtractFloat and JSONExtractInt.
4. sql/clickhouse/02_fact.sql: the fact as a view lab.gNN_fact_<process>,
   and the test of the grain.
5. sql/clickhouse/03_cube.sql: the cube as a view lab.gNN_agg_<process>_cube
   with GROUP BY ... WITH CUBE (or GROUPING SETS) over at least three
   dimensions and grouping() of each one.
6. sql/clickhouse/04_reports.sql: one report frozen in time, for a closed
   month of the partner, materialized with CREATE TABLE ... ENGINE =
   MergeTree ORDER BY ... AS SELECT; and the same report as a normal view
   over the last period, always current.
7. sql/clickhouse/05_questions.sql and docs/answers.md: the five
   questions, each answer with the number and the query that produced it.

[E] Example
CREATE OR REPLACE VIEW lab.g01_dim_customer AS
SELECT JSONExtractString(data_json, 'customer_id') AS customer_id,
       JSONExtractString(data_json, 'state')       AS state
FROM lab.g01_db_ingestion
WHERE data_tag = 'partner.customer.v1';

[A] Adjustments
- Every date of the model is Unix time in seconds (Int64), never Date or
  DateTime: the day is intDiv(timestamp, 86400) * 86400, and a label such
  as the month comes from formatDateTime(toDateTime(timestamp, 'UTC'),
  '%Y-%m').
- Replace gNN with the number of the group in every object; never drop an
  object of another group.
- The console http://10.8.8.10:8123/play runs one statement at a time:
  keep every statement self-contained and end each file with the
  statements that check it.
- To load the data, use clickhouse-connect from Python or
  INSERT ... FORMAT JSONEachRow over HTTP with curl; the Play console does
  not upload files.
- A distinct count does not add up across a dimension: compute the totals
  of the cube in the cube, never by summing finer cells.
- If a measure is semi-additive, keep its time dimension in every grouping
  of the cube.
- The whole gold layer of the group (dimensions, fact and cube) is views;
  only the frozen report stores data.

[T] Type of output
The files, the rows of every object of the group and the five answers.

[E] Extras
Show the plan before editing. Record this prompt in docs/prompts.md.
Stop after the specification and wait for our review before the SQL.

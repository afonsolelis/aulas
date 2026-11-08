[C] Character
You are a data engineer who maintains tcg-dataapp, the Python package of
Lesson 7, with its three layers (views, processors, etls), its pipeline of
twelve tasks and its DuckDB warehouse. You know that a chart is only as
honest as the query behind it.

[R] Request
Prepare the view layer for a Streamlit app, without Streamlit yet.
1. views/dashboard.py, a module of pure functions over a read-only
   connection (connect(db_path) opens it with read_only=True):
   - overview(con): sets, cards, prices of the fact, captures, cells of the
     cube, first and last capture, and the last run of ops.pipeline_runs
     (tasks ok, tasks, failed attempts, start and end).
   - headline(con): the most valuable card of report.v_card_price_latest
     and the share of the largest set in report.v_set_value_latest.
   - task_graph(con): the tasks of the last run with their dependencies,
     final status, attempts and seconds.
   - lineage(con): every object of db_ingestion, gold, mart_collectors and
     report, its rows, its kind (table or view) and its layer, and the
     edges source -> target found in the SQL of each view (duckdb_views()).
   - explore(con, source, dims, measure, filters, suffix): ranked groups
     of the frozen report report.mv_card_price_<suffix> or of the live view
     report.v_card_price_latest, returning the rows and the SQL.
   - cube_check(con, result, dims, measure, filters): the same groups read
     from gold.agg_price_cube at the right grouping_id, and whether they
     agree; None when the card is used, because the cube has no card.
   - price_history(con, level, highlight): market value of each set on
     every capture, or the five most valuable cards of one set.
2. Two small changes below the views, so the app can draw from metadata:
   - pipeline.py keeps the graph of each run in ops.pipeline_tasks
     (run_id, task, depends_on VARCHAR[]);
   - freeze_month writes COMMENT ON TABLE report.mv_... IS 'frozen from
     <source>, last capture of <month>', because a table does not remember
     the query that created it.
3. tests/test_dashboard.py over the FakeClient of conftest.py.

Facts measured on 08/11/2026 (confirm before use):
- tcg-dataapp run: 12 tasks ok in about 25 s; 7 sets, 1,273 cards,
  5,951 prices, 5 captures, 524 cells of the cube.
- The lineage has 13 objects and 20 edges; the frozen report of September
  has 1,226 rows.

[E] Example
cube_check for dims = ["set_name"]: grouping_id = 2 + 1 = 3 (rarity and
variant rolled up), 7 cells on the last capture, agree = True.

[A] Adjustments
- dims and measure come from fixed lists (DIMENSIONS, MEASURES); anything
  else raises ValueError. Filter values are parameters (?), never SQL.
- Dates stay in Unix time in this module; nothing is converted here.
- The views never read db_ingestion, except to count it in the lineage.

[T] Type of output
The files, the output of pytest and, on the real warehouse, the result of
overview, lineage (number of nodes and edges) and one cube_check.

[E] Extras
Show the plan before editing. Stop at the end.

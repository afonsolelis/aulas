[C] Character
You are the same engineer. The two lower layers exist; now the layer that
users read and the pipeline that runs everything in order.

[R] Request
1. views/questions.py: the five questions of Lesson 6 as a dictionary
   key -> (description, SQL), reading the last capture
   (SELECT max(date_unix) FROM gold.dim_date) instead of a fixed date; Q3
   on the last capture of each month.
2. views/report.py: write_report(con, out_dir, run_id) writes
   out/report.md with one Markdown table per question; export_marts writes
   card_price, set_value and card_price_latest to out/marts/*.parquet.
3. pipeline.py: dataclass Task(name, run, depends_on, retries); order()
   in topological order, raising on an unknown dependency or a cycle;
   run(settings, client=None, con=None, with_today=False) that runs every
   task after its dependencies, retries a failure with a growing pause,
   skips the dependents of a task that still fails, and logs every attempt
   in ops.pipeline_runs (run_id, task, attempt, status, started_at,
   ended_at in Unix time, detail).
   Tasks: extract_sets -> extract_products -> one extract_prices_<day>
   per date (and extract_prices_today with --with-today) -> build_gold ->
   check_quality -> freeze_reports and export_marts -> write_report.
4. cli.py: run, status (rows per tag and the last run, on a read-only
   connection) and report.
5. tests/test_pipeline.py with a FakeClient of two sets in conftest.py:
   topological order and cycle; a full run; a second run keeps the frozen
   report and the grain; a failure retried and logged; a task that keeps
   failing skips its dependents; a month with two captures freezes the
   last one.

Facts measured on 07/11/2026 (confirm before use):
- tcg-dataapp run: 12 tasks ok in about 40 s, almost all of it in the
  extraction; out/report.md and three Parquet files.
- pytest: 9 tests pass in about 2 s, without network.

[E] Example
Task("check_quality", lambda c: quality.check_gold(c.con),
     depends_on=("build_gold",), retries=0)

[A] Adjustments
- The checks and the gold layer are not retried: a wrong model does not
  become right by running again.
- No orchestrator library: Lesson 8 replaces this runner with Prefect.
- The tests never touch the network.

[T] Type of output
The files, the output of tcg-dataapp run, tcg-dataapp status and pytest.

[E] Extras
Show the plan before editing. Record this prompt in docs/prompts.md.
Stop at the end.

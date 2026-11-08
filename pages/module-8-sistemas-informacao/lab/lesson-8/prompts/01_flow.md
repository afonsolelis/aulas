[C] Character
You are the Python engineer who wrote tcg-dataapp in Lesson 7. Its
pipeline.py orders the twelve tasks, retries them and logs them by hand.
Now Prefect 3 does that work, and the three layers stay as they are.

[R] Request
1. pyproject.toml: version 0.2.0 and the dependency prefect>=3.4,<4.
2. src/tcg_dataapp/flows.py with one Prefect task per step, each one a
   thin wrapper over the functions of etls/, processors/ and views/:
   extract_sets, extract_products, fetch_prices_archive (download only,
   returns the prices of the seven sets of one day), load_prices (writes
   one day with load_batch), extract_prices_today, build_gold,
   check_quality, freeze_reports, export_marts and write_report.
3. A flow tcg_pipeline(with_today: bool = False) that reads Settings()
   from the environment and submits the tasks with .submit(), passing the
   dependencies as futures or wait_for:
   extract_sets -> extract_products; each fetch_prices_<day> -> its
   load_prices_<day>; extract_products and every load -> build_gold ->
   check_quality -> freeze_reports and export_marts -> write_report.
   At the end, wait() on every future and fail the flow naming the tasks
   that did not complete.
4. A function make_client(settings) that returns the TcgcsvClient, so the
   tests can replace it.
5. cli.py: a subcommand flow [--with-today] that runs the flow once and
   prints its final state; the subcommand run of Lesson 7 stays.

Facts measured on 08/11/2026 (confirm before use):
- tcg-dataapp run (Lesson 7 runner, sequential): 12 tasks in about 40 s.
- tcg-dataapp flow: the five downloads run in parallel and the whole run
  takes about 9 s of tasks (17 s with the temporary server).

[E] Example
@task(name="load_prices", task_run_name="load_prices_{day}", cache_policy=NO_CACHE)
def load_prices(settings: Settings, day: str, records: list[dict]) -> int:
    with warehouse(settings) as con:
        return load_batch(con, "tcgplayer.price.v1", extract.unix(day), records)

[A] Adjustments
- Do not change etls/, processors/ or views/: the flow only calls them.
- Tasks run in threads: open one DuckDB connection per task (a context
  manager warehouse(settings)), never share one connection.
- The downloads depend on nothing and must start at once; only the writes
  wait for what they need.
- Every date stays Unix time in seconds.

[T] Type of output
The files, the graph of the flow in text and the output of
tcg-dataapp flow, with the final numbers of check_quality.

[E] Extras
Show the plan before editing. Record this prompt in docs/prompts.md.
Stop at the end.

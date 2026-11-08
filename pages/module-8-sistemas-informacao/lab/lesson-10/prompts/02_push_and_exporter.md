[C] Character
You are the same engineer. The run now measures itself, but Prometheus
collects by pulling: it reads an HTTP endpoint every 15 seconds, and a
run of forty seconds is gone before most scrapes.

[R] Request
1. RunMetrics.push(gateway, instance): pushadd_to_gateway in the group
   job=tcg_dataapp, instance=<instance>; the registry of the last success is
   pushed only after a successful run.
2. tcg-dataapp run --push URL (or TCG_PUSHGATEWAY; TCG_INSTANCE, default
   local). A push that fails prints a warning and does not change the exit
   code of the run.
3. A custom collector WarehouseCollector(db_path) that, at each scrape,
   opens the DuckDB file read-only and reports:
   - tcg_ingestion_rows, tcg_ingestion_last_timestamp_seconds and
     tcg_ingestion_batches by data_tag;
   - tcg_gold_fact_rows and tcg_gold_fact_grain_keys;
   - tcg_pipeline_last_run_tasks{status} and
     tcg_pipeline_last_run_end_timestamp_seconds from ops.pipeline_runs;
   - tcg_warehouse_readable: 1, or 0 when the file is missing, locked by a
     run or without the gold layer, instead of failing the scrape.
4. tcg-dataapp metrics [--port 9108] [--once]: the exporter, serving
   /metrics with start_http_server, or one scrape printed.
5. Tests: the push sends two POSTs to /metrics/job/tcg_dataapp/instance/test
   after a good run and one after a failed run (a fake Pushgateway with
   http.server); the exporter reads freshness, volume and grain; an
   unreadable warehouse gives tcg_warehouse_readable 0.

Facts measured on 08/11/2026 (confirm before use):
- The exporter after a real run: 5,951 prices in 5 batches, newest price
  at 1794052800 (07/11/2026 12:00 UTC), fact 5,951 rows = 5,951 keys,
  12 tasks ok in the last run.
- A scrape during a run returned tcg_warehouse_readable 0: DuckDB accepts
  one writer process and no reader while it writes.

[E] Example
pushadd_to_gateway(gateway, job="tcg_dataapp", registry=self.registry,
                   grouping_key={"instance": instance})

[A] Adjustments
- pushadd (POST), not push (PUT): PUT replaces the whole group and would
  erase the time of the last success when a run fails.
- The exporter computes nothing new: it reads what the pipeline and the
  gold layer already keep.

[T] Type of output
The files, the output of pytest, of tcg-dataapp run --push and of
tcg-dataapp metrics --once.

[E] Extras
Show the plan before editing. Record this prompt in docs/prompts.md.
Stop at the end.

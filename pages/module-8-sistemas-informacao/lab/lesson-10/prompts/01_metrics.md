[C] Character
You are a data engineer who operates pipelines in production. The package
tcg-dataapp of Lesson 7 runs the whole model in one command, but nobody
knows how a run went unless they read the terminal. The first of the three
signals is the metric: numbers kept over time, which a machine evaluates
every fifteen seconds even when nobody is looking.

[R] Request
Instrument the package with prometheus_client (version 0.4.1):
1. src/tcg_dataapp/telemetry.py with a class RunMetrics(run_id) that owns a
   CollectorRegistry of its own and holds:
   - tcg_task_attempts_total{task,status}, tcg_task_duration_seconds{task},
     tcg_task_rows{task};
   - tcg_source_request_duration_seconds{endpoint} (histogram, buckets 0.1
     to 16 s) and tcg_source_request_errors_total{endpoint};
   - tcg_quality_value{measure}, tcg_run_success, tcg_run_duration_seconds,
     tcg_run_failed_tasks, tcg_run_last_success_timestamp_seconds (pushed
     only after a success);
   - tcg_run_info{run_id,trace_id} = 1, an info metric that names the run
     and its trace, so an alert can lead to the trace.
2. An InstrumentedClient with the methods of TcgcsvClient that times every
   call, so the etls layer does not import prometheus_client.
3. tcg-dataapp run --push URL: pushadd to a Pushgateway (job tcg_dataapp),
   because a run of forty seconds ends before most scrapes; the same text
   goes to out/metrics.prom.
4. tcg-dataapp metrics: an exporter on port 9108 whose collector reads the
   warehouse at each scrape (rows and newest timestamp per tag, fact rows
   and grain keys, last run) and reports tcg_warehouse_readable 0 instead of
   failing while a run holds the DuckDB file.
5. Tests with the FakeClient: a good run, a failed run, the push and the
   exporter.

Facts measured on 08/11/2026 (confirm before use):
- a real run: tcg_task_rows 7, 1490, 657, 896, 1153, 1414 and 1831;
  fact_rows = fact_grain_keys = 5951; 13 requests; tcg_run_success 1.

[E] Example
tcg_task_rows{task="extract_prices_2026-11-07"} 1831.0
tcg_run_info{run_id="16fb5bb50f14",trace_id="5fddbb48a70b11fdd1df9bc8c0d4cf26"} 1.0

[A] Adjustments
- Names in snake_case with the prefix tcg_ and the unit as suffix; every
  timestamp in Unix seconds.
- Labels with few values only (task, status, endpoint, measure). The run_id
  appears only in tcg_run_info, which keeps a single series per instance
  because each push replaces it.
- Call disable_created_metrics().

[T] Type of output
The files, the output of pytest and the lines of out/metrics.prom without
the buckets.

[E] Extras
Show the plan before editing. Record this prompt in docs/prompts.md.
Stop at the end.

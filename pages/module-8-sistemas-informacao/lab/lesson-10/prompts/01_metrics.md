[C] Character
You are a data engineer who operates pipelines in production. The package
tcg-dataapp of Lesson 7 runs the whole model in one command, but nobody
knows how a run went unless they read the terminal. Now every run must
describe itself in numbers that Prometheus can read.

[R] Request
Instrument the package with prometheus_client (version 0.4.0):
1. src/tcg_dataapp/telemetry.py with a class RunMetrics(run_id) that owns a
   CollectorRegistry of its own (never the global one) and holds:
   - tcg_task_attempts_total{task,status}: counter of attempts by outcome
     (success, failed, skipped);
   - tcg_task_duration_seconds{task} and tcg_task_rows{task}: gauges of the
     last attempt and of the rows written by each extraction;
   - tcg_source_request_duration_seconds{endpoint}: histogram of the
     requests to tcgcsv.com (groups, products, prices, archive), buckets
     0.1 to 16 s, and tcg_source_request_errors_total{endpoint};
   - tcg_quality_value{measure}: the numbers of check_quality;
   - tcg_run_success, tcg_run_duration_seconds, tcg_run_failed_tasks and
     tcg_run_last_completion_timestamp_seconds;
   - tcg_run_last_success_timestamp_seconds, in a second registry, set only
     when the run succeeds.
2. A wrapper InstrumentedClient with the same methods as TcgcsvClient that
   times every call into the histogram, so the etls layer does not import
   prometheus_client.
3. pipeline.run creates a RunMetrics, wraps the client and calls
   metrics.attempt(task, status, seconds, result) after each attempt and
   metrics.finish(failed) at the end.
4. tcg-dataapp run writes the metrics to out/metrics.prom in the text
   format.
5. tests/test_telemetry.py, with the FakeClient of Lesson 7: a good run
   reports rows, requests, quality and success; a failed run reports the
   failure and no success time.

Facts measured on 08/11/2026 (confirm before use):
- out/metrics.prom of a real run: tcg_task_rows 7, 1490, 657, 896, 1153,
  1414 and 1831; tcg_quality_value fact_rows = fact_grain_keys = 5951;
  13 requests (1 groups, 7 products, 5 archives); tcg_run_success 1.

[E] Example
tcg_task_rows{task="extract_prices_2026-11-07"} 1831.0
tcg_source_request_duration_seconds_count{endpoint="archive"} 5.0
tcg_run_success 1.0

[A] Adjustments
- Names in snake_case with the prefix tcg_ and the unit as suffix
  (_seconds, _total); every timestamp in Unix seconds.
- Labels with few values only: task, status, endpoint, measure. Never the
  run_id or a product as a label, because each new value is a new series.
- Call disable_created_metrics(): the *_created series are noise in a job
  that lives forty seconds.

[T] Type of output
The files, the output of pytest and the lines of out/metrics.prom without
the buckets.

[E] Extras
Show the plan before editing. Record this prompt in docs/prompts.md.
Stop at the end.

# Queries of the three signals

The questions of the lesson, with the values returned on 08/11/2026. Metrics are asked in PromQL (Prometheus), traces in TraceQL (Tempo) and logs in LogQL (Loki); the identifiers in the answers lead from one signal to the next.

## Metrics · PromQL

| Question | PromQL | Value |
|---|---|---|
| Did the last run succeed? | `tcg_run_success{job="tcg_dataapp"}` | 1 after a good run; 0 after the run with `source_down` |
| Which run and which trace do the series describe? | `tcg_run_info{job="tcg_dataapp"}` | `run_id="e44b5b8a34eb"`, `trace_id="5d1d4930…"` |
| How long ago was the last success? | `time() - tcg_run_last_success_timestamp_seconds{job="tcg_dataapp"}` | 2.35 min |
| How old is the newest price? | `tcg:price_freshness_seconds` | 0 after `--with-today` (the price of today is stored at noon UTC) |
| Is the grain intact? | `tcg_gold_fact_rows - tcg_gold_fact_grain_keys` | 0 |
| Which three tasks took longest? | `topk(3, tcg_task_duration_seconds)` | extract_products 9.52 s, extract_prices_2026-11-07 8.12 s, extract_prices_today 6.83 s |
| How far is each SLI from its SLO? | `tcg_controller_error{job="tcg_controller"}` | freshness_s −35,293; run_duration_s −80; source_error_rate −0.5 |
| What has the controller done? | `tcg_controller_actions_total` | hold 10, probe 2, quarantine 2, open_breaker 1, rerun 1, resolve 1 |
| Is a person needed? | `tcg_controller_escalated == 1` | 1 after the persistent bad batch |

## Traces · TraceQL

| Question | TraceQL | Value |
|---|---|---|
| Which runs failed? | `{resource.service.name="tcg-dataapp" && name="tcg_dataapp.run" && status=error}` | the traces of the runs with `source_down` and `duplicate_prices` |
| Which task failed, and how many attempts did it make? | the trace by its id, span `task extract_sets` | status ERROR, three events "attempt failed", the exception `ConnectionError` |
| Which ticks of the controller started a rerun? | `{name="control.tick" && span.tcg.decision="rerun"}` | one trace of 41 spans, with the whole run under `control.act rerun` |
| Which requests to the source are slow? | `{name=~"tcgcsv.*" && duration > 3s}` | the archives of the past dates |

## Logs · LogQL

| Question | LogQL | Value |
|---|---|---|
| What did the failing span write? | `{service_name="tcg-dataapp"} \| span_id="ba8fc2d7eb92ef1c"` | three lines `task attempt failed`, attempts 1, 2 and 3 |
| Every line of one run | `{service_name="tcg-dataapp"} \| trace_id="5d1d493014dd2ecc409d7593266173a2"` | 17 lines: 4 errors, 12 warnings (skipped tasks), 1 start |
| Every decision of the controller | `{service_name="tcg-dataapp"} \| event="control.tick"` | one line per tick, with action, reason and outcome |

## Notes

- `histogram_quantile` estimates a quantile from the buckets, interpolating inside the bucket. The pushed histogram holds only the last run, so `rate()` over it means nothing.
- Loki stores the attributes of an OpenTelemetry log record as structured metadata, so `trace_id`, `span_id`, `run_id` and `event` are filtered with `|` after the stream selector, and they are not labels of the stream.
- `tcg_run_info` keeps the cardinality at one series per instance, because each push replaces it. A `run_id` as a label of every metric would create one series per run.

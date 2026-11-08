# PromQL of the DataApp

The questions of step 03, with the values returned on 08/11/2026 after a real run pushed at 11:27 UTC and the exporter on.

| Question | PromQL | Value |
|---|---|---|
| Did the last run succeed? | `tcg_run_success{job="tcg_dataapp"}` | 1 |
| How long ago was the last success? | `time() - tcg_run_last_success_timestamp_seconds{job="tcg_dataapp"}` | 62 s |
| When was the last push received? | `time() - push_time_seconds{job="tcg_dataapp"}` | 62 s |
| How old is the newest price? | `tcg:price_freshness_seconds` | 84,499 s (23.5 h); 0 after `--with-today` |
| Is the grain intact? | `tcg_gold_fact_rows - tcg_gold_fact_grain_keys` | 0 |
| Which three tasks took longest? | `topk(3, tcg_task_duration_seconds)` | extract_products 7.25 s, extract_prices_2026-11-07 3.47 s, extract_prices_2026-07-01 3.43 s |
| How many prices were loaded? | `sum(tcg_task_rows{task=~"extract_prices_.*"})` | 5,951 |
| Mean time of each kind of request | `tcg_source_request_duration_seconds_sum / tcg_source_request_duration_seconds_count` | groups 0.70 s, products 0.95 s, archive 2.97 s |
| p95 of each kind of request | `tcg:source_request_duration_seconds:p95` | groups 0.98 s, products 1.82 s, archive 3.9 s |
| Could the exporter read the warehouse in the last 5 minutes? | `min_over_time(tcg_warehouse_readable[5m])` | 0: a scrape fell during a run |

## Notes

- `histogram_quantile` estimates the quantile from the buckets, interpolating inside the bucket: one request of 0.70 s in the bucket from 0.5 to 1 s gives a p95 of 0.975 s.
- The pushed histogram holds only the last run, so `rate()` over it means nothing. To follow a distribution over time, the process must live longer than the scrape, as the exporter does.
- `push_time_seconds` is added by the Pushgateway to every group; it tells when the last push arrived, successful or not.

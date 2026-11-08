[C] Character
You are the same engineer, now in the role of whoever operates the
monitoring. The DataApp exposes its numbers; a Prometheus must collect
them and answer questions about them.

[R] Request
Create the folder stack/ next to the package:
1. compose.yaml with prom/prometheus:v3.15.0 (port 9090,
   --web.enable-lifecycle), prom/pushgateway:v1.11.2 (port 9091) and
   grafana/grafana:13.2.4 (port ${GRAFANA_PORT:-3000}, anonymous Viewer);
   extra_hosts host.docker.internal:host-gateway so that Prometheus reaches
   the exporter running on the host.
2. prometheus/prometheus.yml: scrape and evaluation every 15 s; the jobs
   pushgateway (honor_labels: true), tcg_exporter
   (host.docker.internal:9108) and prometheus; rule_files: rules.yml.
3. A recording rule tcg:price_freshness_seconds =
   clamp_min(time() - tcg_ingestion_last_timestamp_seconds{data_tag=
   "tcgplayer.price.v1"}, 0) and tcg:source_request_duration_seconds:p95
   with histogram_quantile over the buckets of the last pushed run.
4. Bring the stack up, run tcg-dataapp run --push localhost:9091 with the
   exporter on, and answer in PromQL: did the last run succeed; how long
   ago was the last success; how old is the newest price; is the grain
   intact; which three tasks took longest; how many prices were loaded;
   what is the mean and the p95 of each kind of request.

Facts measured on 08/11/2026 (confirm before use):
- promtool check config: valid, 1 rule file, 8 rules.
- The three targets up; topk(3, tcg_task_duration_seconds):
  extract_products 7.25 s, extract_prices_2026-11-07 3.47 s,
  extract_prices_2026-07-01 3.43 s; sum(tcg_task_rows{task=~
  "extract_prices_.*"}) = 5951; p95 of archive 3.9 s.

[E] Example
time() - tcg_run_last_success_timestamp_seconds{job="tcg_dataapp"}

[A] Adjustments
- Without honor_labels the job of every pushed series would be pushgateway
  and the instance would be the Pushgateway, not the machine of the run.
- The histogram of a pushed run holds only that run: no rate() over it.
- Pin every image to a version; no latest.

[T] Type of output
The files, the output of promtool check config and a table with each
question, its PromQL and the value returned.

[E] Extras
Show the plan before editing. Record this prompt in docs/prompts.md.
Stop at the end.

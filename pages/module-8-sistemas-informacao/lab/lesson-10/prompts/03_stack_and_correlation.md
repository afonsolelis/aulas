[C] Character
You are the same data engineer, now responsible for the place where the
three signals are read. A person on call receives an alert and must reach
the line that explains it in less than a minute: from the alert to the
metric, from the metric to the trace, from the failing span to its log lines.

[R] Request
Write stack/ with Docker Compose and verify the path of correlation:
1. compose.yaml with Prometheus v3.15.0, Pushgateway v1.11.2, the
   OpenTelemetry collector contrib 0.141.0 (OTLP on 4317 and 4318), Tempo
   2.10.10 (traces), Loki 3.6.3 (logs, with its OTLP endpoint) and Grafana
   13.2.4, with anonymous access and viewers allowed in Explore.
2. otel/config.yaml: the traces pipeline exports to Tempo, the logs
   pipeline to http://loki:3100/otlp.
3. grafana/provisioning/datasources/datasources.yml:
   - Tempo with tracesToLogsV2 to Loki, filtering by the span:
     {service_name="tcg-dataapp"} | span_id="${__span.spanId}";
   - Loki with a derived field on the structured metadata trace_id that
     opens the trace in Tempo.
4. prometheus.yml (Pushgateway with honor_labels, the exporter) and
   rules.yml with the recording rule tcg:price_freshness_seconds and the
   alerts TcgRunFailed, TcgNoSuccessfulRun, TcgRunTooSlow, TcgPricesStale,
   TcgGrainBroken and TcgExporterDown. The description of TcgRunFailed
   reads the run_id and the trace_id from tcg_run_info with the template
   function query.
5. The dashboard: the panels of the run, a table of tcg_run_info whose
   trace_id is a link to Tempo, a table of traces with an error and a panel
   of the error and warning lines from Loki.
6. A run that fails on purpose (TCG_FAULT=source_down) and the path, with
   the commands and the answers: alert → trace_id → span with status ERROR
   → its log lines in Loki.

Facts measured on 08/11/2026 (confirm before use):
- a good run with --with-today: 38 spans in Tempo, 15 log lines in Loki;
- the failed run: TcgRunFailed fired with "Run e44b5b8a34eb, trace
  5d1d4930...", the span task extract_sets had 3 events "attempt failed",
  and Loki returned its 3 lines by span_id.

[E] Example
curl -s -G localhost:3100/loki/api/v1/query_range \
  --data-urlencode 'query={service_name="tcg-dataapp"} | span_id="ba8fc2d7eb92ef1c"'

[A] Adjustments
- promtool check config and promtool test rules must pass, run from the
  image of Prometheus; rules_test.yml covers TcgRunFailed with its trace.
- Port 3000 may be taken: GRAFANA_PORT=3001.
- docker compose down -v at the end.

[T] Type of output
The files, the output of promtool, and a table with the four hops of the
path (where, query or click, what it returned).

[E] Extras
Show the plan before editing. Record this prompt in docs/prompts.md.
Stop at the end.

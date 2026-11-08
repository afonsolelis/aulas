[C] Character
You are the same engineer. The numbers are in Prometheus; now a person
must read them at a glance, and the system must warn when nobody is
looking.

[R] Request
1. Alerting rules in prometheus/rules.yml, each with severity and summary:
   - TcgRunFailed: tcg_run_success == 0 (critical);
   - TcgNoSuccessfulRun: no success for more than 26 h (critical);
   - TcgRunTooSlow: tcg_run_duration_seconds > 120 (warning);
   - TcgPricesStale: tcg:price_freshness_seconds > 36 h for 5 m (warning);
   - TcgGrainBroken: tcg_gold_fact_rows != tcg_gold_fact_grain_keys
     (critical);
   - TcgExporterDown: up == 0 or tcg_warehouse_readable == 0 for 2 m.
2. prometheus/rules_test.yml for promtool test rules: a failed run fires
   TcgRunFailed and a good run resolves it; prices without news fire
   TcgPricesStale only after 36 h plus 5 m; one row above the grain fires
   TcgGrainBroken.
3. Grafana provisioned from files: the datasource Prometheus (uid
   prometheus) and the dashboard "TCG DataApp" (uid tcg-dataapp), with five
   stats (last run, since the last success, price freshness, rows above the
   grain, run duration), the duration of each task, the rows of each
   extraction, the rows of db_ingestion by tag and the p95 of the requests.
4. Make a run fail on purpose (TCG_BASE_URL=http://127.0.0.1:9) with
   --push, watch TcgRunFailed fire, then run again and watch it resolve.

Facts measured on 08/11/2026 (confirm before use):
- promtool test rules: SUCCESS.
- The failed run (12 tasks failed or skipped) fired TcgRunFailed within
  one evaluation; the good run afterwards resolved it.

[E] Example
- alert: TcgRunFailed
  expr: tcg_run_success{job="tcg_dataapp"} == 0
  labels: {severity: critical}

[A] Adjustments
- Alert on symptoms that someone must act on, not on every number.
- Each threshold says where it comes from: a daily run plus two hours; three
  times the reference run of about 40 s.
- Colours of the dashboard from the palette of the course.

[T] Type of output
The files, the output of promtool test rules, the list of alerts at
/api/v1/alerts after each run and a screenshot of the dashboard.

[E] Extras
Show the plan before editing. Record this prompt in docs/prompts.md.
Stop at the end.

# Lesson 10 · Lab: metrics and telemetry of the DataApp

Module 8 · Information Systems · Inteli · Wednesday, 09/12/2026

The package `tcg_dataapp` of Lesson 7 runs the whole model in one command, but a run is only described by what it prints in the terminal. In this lesson the coding agent instruments the package with Prometheus metrics, brings up a monitoring stack with Prometheus, a Pushgateway and Grafana, answers questions about the runs in PromQL and writes the alerts that warn when the data stops arriving, when a run fails and when the grain of the fact breaks.

The reference is in two folders: `tcg_dataapp/`, the package in version 0.4.0 with `telemetry.py`, and `stack/`, the monitoring stack. In class the professor builds both live with the four CREATE prompts of `prompts/` and compares each step with the reference.

## Prepare

```bash
git clone --depth 1 https://github.com/afonsolelis/aulas.git
cp -r aulas/pages/module-8-sistemas-informacao/lab/lesson-7/tcg_dataapp ~/lesson_10_metrics   # the package before the metrics
cd ~/lesson_10_metrics
python3 -m venv .venv && source .venv/bin/activate && pip install -e '.[dev]'
docker compose version          # Docker with Compose v2 for the stack
claude                          # or the coding agent of your choice
```

## Steps

| Step | Prompt | Builds | Checks |
|---|---|---|---|
| 01 | `prompts/01_run_metrics.md` | `telemetry.py` (`RunMetrics`, `InstrumentedClient`), the hooks in `pipeline.py`, `out/metrics.prom` | `tcg_task_rows` 7, 1490, 657, 896, 1153, 1414, 1831; `tcg_run_success 1`; tests pass |
| 02 | `prompts/02_push_and_exporter.md` | `--push`, `WarehouseCollector`, `tcg-dataapp metrics` | two POSTs after a good run, one after a failed run; `tcg_warehouse_readable 0` during a run |
| 03 | `prompts/03_stack_and_promql.md` | `stack/compose.yaml`, `prometheus.yml`, the recording rules | three targets up; the questions of `stack/promql.md` answered |
| 04 | `prompts/04_dashboard_and_alerts.md` | the alerting rules, `rules_test.yml`, the Grafana dashboard | `promtool test rules` SUCCESS; `TcgRunFailed` fires and resolves |

## The reference

```bash
cd tcg_dataapp && pip install -e '.[dev]' && pytest     # 14 passed, without network
cd ../stack && docker compose up -d                     # Prometheus :9090, Pushgateway :9091, Grafana :3000
cd ../tcg_dataapp
tcg-dataapp metrics &                                   # the exporter on :9108
tcg-dataapp run --push localhost:9091                   # the run, pushed
open http://localhost:3000                              # dashboard "TCG DataApp"
docker compose -f ../stack/compose.yaml down -v         # at the end
```

`promtool` comes inside the image of Prometheus, so the rules can be checked without installing it:

```bash
cd stack/prometheus
docker run --rm -v "$PWD":/p -w /p --entrypoint promtool prom/prometheus:v3.15.0 check config prometheus.yml
docker run --rm -v "$PWD":/p -w /p --entrypoint promtool prom/prometheus:v3.15.0 test rules rules_test.yml
```

If port 3000 is taken, `GRAFANA_PORT=3001 docker compose up -d`.

## Measured on 08/11/2026

- Run with `--push`: 12 tasks ok, `tcg_run_duration_seconds` 25.1 s; `extract_products` the slowest task (7.25 s); 13 requests to tcgcsv.com, archives with a mean of 2.97 s and a p95 of 3.9 s.
- Exporter: 5,951 prices in 5 batches, the newest at 1794052800 (07/11/2026 12:00 UTC), fact 5,951 rows = 5,951 keys. Two of three scrapes made during a run returned `tcg_warehouse_readable 0`.
- A run against `http://127.0.0.1:9` failed with 12 tasks failed or skipped; `TcgRunFailed` fired at the next evaluation and was resolved by the next good run.
- With `--with-today` before noon UTC, the newest price is stored at 12:00 of the day, in the future: the raw age was −1,841 s, which is why `tcg:price_freshness_seconds` uses `clamp_min(..., 0)`.

## The second hour

Each group instruments one service of its own DataApp, the pipeline of Lesson 7 or the one orchestrated in Lesson 8, with the same four prompts adapted to the partner data: the metrics of each run pushed to a Pushgateway, an exporter or a query for the freshness and the volume of the data, a Grafana dashboard and at least three alerting rules with their `promtool` tests.

# Lesson 10 · Lab: metrics, traces, logs and the closed loop of the DataApp

Module 8 · Information Systems · Inteli · Wednesday, 09/12/2026

The package `tcg_dataapp` of Lesson 7 runs the whole model in one command, but a run is only described by what it prints in the terminal. In this lesson the coding agent makes the DataApp observable with the three signals: metrics in Prometheus, traces in Tempo and structured logs in Loki, all read in Grafana and linked by the `run_id`, the `trace_id` and the `span_id`. Then it closes the loop: a controller reads the indicators (SLIs), compares them with the objectives (SLOs) and acts on the DataApp, within guardrails, escalating to a person only when it cannot correct the DataApp.

Observability alone does not close the loop. Metrics, traces and logs are the sensor and the display, and an alert hands the decision to a person. The loop is closed by the comparison with the setpoint and by the action on the process, which `control.py` performs.

The reference is in two folders: `tcg_dataapp/`, the package in version 0.4.1 (`telemetry.py`, `observability.py`, `control.py`, `faults.py`), and `stack/`, the observability stack. In class the professor builds both live with the four CREATE prompts of `prompts/` and compares each step with the reference.

## Prepare

```bash
git clone --depth 1 https://github.com/afonsolelis/aulas.git
cp -r aulas/pages/module-8-sistemas-informacao/lab/lesson-7/tcg_dataapp ~/lesson_10_observability   # the package before this lesson
cd ~/lesson_10_observability
python3 -m venv .venv && source .venv/bin/activate && pip install -e '.[dev]'
docker compose version          # Docker with Compose v2 for the stack
claude                          # or the coding agent of your choice
```

## Steps

| Step | Prompt | Builds | Checks |
|---|---|---|---|
| 01 | `prompts/01_metrics.md` | `telemetry.py`, `--push`, the exporter `tcg-dataapp metrics`, `tcg_run_info` | `tcg_task_rows` 7, 1490, 657, 896, 1153, 1414, 1831; tests pass |
| 02 | `prompts/02_traces_and_logs.md` | `observability.py`, the spans of run, task, request and SQL file, the JSON log | a run is one trace; the log line of a failure has the `span_id` of its task |
| 03 | `prompts/03_stack_and_correlation.md` | `stack/`: collector, Tempo, Loki, Prometheus, Grafana, the links between them, the alerts | `promtool` SUCCESS; alert → trace → span → log line in a failed run |
| 04 | `prompts/04_closed_loop.md` | `control.py`, `faults.py`, `tcg-dataapp control`, the loop tests | 25 tests pass; the rehearsals of `source_down` and `duplicate_prices` |
| 05 | `prompts/05_your_dataapp.md` | second hour: the DataApp of the group | three signals, three tested alerts and one loop for one SLO |

## The reference

```bash
cd tcg_dataapp && pip install -e '.[dev]' && pytest           # 25 passed, without network
cd ../stack && docker compose up -d                           # GRAFANA_PORT=3001 if 3000 is taken
cd ../tcg_dataapp
export TCG_OTLP_ENDPOINT=http://localhost:4318 TCG_PUSHGATEWAY=localhost:9091
tcg-dataapp metrics &                                         # the exporter on :9108
tcg-dataapp run --with-today                                  # metrics pushed, trace and logs sent
TCG_FAULT=source_down TCG_RETRIES=2 TCG_RETRY_DELAY=1 tcg-dataapp run --with-today   # a failure on purpose
TCG_FAULT=source_down TCG_BREAKER_BACKOFF=20 TCG_BREAKER_MAX_OPENS=3 \
  tcg-dataapp control --interval 10 --ticks 9                 # the loop, with short guardrails
tcg-dataapp control --acknowledge                             # a person takes over
docker compose -f ../stack/compose.yaml down -v               # at the end
```

`promtool` comes inside the image of Prometheus:

```bash
cd stack/prometheus
docker run --rm -v "$PWD":/p -w /p --entrypoint promtool prom/prometheus:v3.15.0 check config prometheus.yml
docker run --rm -v "$PWD":/p -w /p --entrypoint promtool prom/prometheus:v3.15.0 test rules rules_test.yml
```

## Measured on 08/11/2026

The stack of six containers on Docker; Python 3.12, OpenTelemetry SDK 1.45.2, DuckDB 2.0.0.

- **A good run** with `--with-today`: 13 tasks ok in 30.6 s, 7,782 prices in 6 captures, 697 cells in the cube. Tempo received one trace of 38 spans (1 run, 13 tasks, 20 requests, 4 SQL files); Loki received the 15 log lines of the run, each one with its `trace_id`.
- **A failure on purpose** (`TCG_FAULT=source_down`, 2 retries): the run failed in 3.0 s and its trace had 17 spans.
  - `TcgRunFailed` fired with the description "Run e44b5b8a34eb, trace 5d1d4930…", read from `tcg_run_info`.
  - In Tempo, the span `task extract_sets` had the status ERROR, three events "attempt failed" and the exception.
  - Its button "Logs for this span" opened exactly its three lines in Loki, and the `trace_id` of each line opened the trace again.
- **Closed loop, source down** (backoff of 20 s, ticks every 10 s, escalation at the third opening). Nine ticks:
  - `open_breaker`, then `hold`;
  - `probe` failed, breaker reopened for 40 s, then three `hold`;
  - `probe` failed, breaker reopened for 80 s, and the controller escalated to a person;
  - two more `hold`.

  No rerun was attempted against the source while it was down. `TcgControllerEscalated` fired. After a person ran the DataApp again, the next tick was `resolve` and the one after it `none`.
- **Closed loop, bad batch, transient**: a run with `TCG_FAULT=duplicate_prices` broke the grain (9,613 rows for 7,782 keys).
  - The first tick quarantined 3 batches (5,159 rows). Gold went back to 5,951 rows = 5,951 keys, and the frozen report of September kept its 1,226 rows.
  - The second tick reran the DataApp, and the run succeeded with 7,782 rows.
  - The third tick found every SLI within its SLO.
- **Closed loop, bad batch, persistent**: the same fault again, within six hours.
  - The second quarantine also escalated, and the following ticks held without rerunning.
  - Gold stayed at 5,951 = 5,951.
- **A tick that reruns** is one trace of 41 spans: `control.tick`, `control.sense`, `control.act rerun` and, under it, the whole run.

## The second hour

Each group applies the method to its own DataApp (the package of Lesson 7 or the flow of Lesson 8) with prompt 05:
- the three signals, with the identifiers that link them;
- the stack, with three alerting rules tested by `promtool`;
- one closed loop for one SLO, with its setpoint, sensor, actuator, guardrails and a test that breaks the DataApp on purpose.

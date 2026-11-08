# tcg-dataapp 0.4.1 · observable and controlled in closed loop

The model of Lesson 6, automated as an installable Python package in Lesson 7. In Lesson 10 it gains the three signals of observability and a controller that closes the loop on its objectives. One command collects the prices that TCGplayer published for the Pokémon TCG sets of 2026, loads them into a local DuckDB file and builds the whole gold layer, the frozen and live reports, the five questions and the Parquet files of the marts.

Every date is Unix time in seconds (UTC).

## Install and run

```bash
python3 -m venv .venv && source .venv/bin/activate
pip install -e '.[dev]'
tcg-dataapp run --with-today           # about 30 s; metrics, trace and JSON log of the run
tcg-dataapp status                     # rows of db_ingestion and the last run
tcg-dataapp metrics                    # the exporter: /metrics on port 9108 with the state of the warehouse
tcg-dataapp control --interval 300     # the closed loop; --once for cron; --acknowledge after a person takes over
pytest                                 # 25 tests, without network
```

The run writes `warehouse/tcg.duckdb`, `out/report.md`, `out/marts/*.parquet`, `out/metrics.prom` and `out/logs/tcg-dataapp.jsonl`. The settings come from environment variables (see `src/tcg_dataapp/config.py`):

| Group | Variables |
|---|---|
| data | `TCG_DB_PATH`, `TCG_OUT_DIR`, `TCG_SETS`, `TCG_PRICE_DATES`, `TCG_FROZEN_MONTH`, `TCG_RETRIES`, `TCG_RETRY_DELAY` |
| signals | `TCG_PUSHGATEWAY`, `TCG_INSTANCE`, `TCG_METRICS_PORT`, `TCG_OTLP_ENDPOINT` |
| setpoints | `TCG_SLO_FRESHNESS` (129600 s), `TCG_SLO_FRESHNESS_OK` (108000 s), `TCG_SLO_RUN_DURATION` (120 s), `TCG_SLO_SOURCE_ERRORS` (0.5) |
| guardrails | `TCG_CONTROL_MAX_ACTIONS` (3), `TCG_CONTROL_WINDOW` (21600 s), `TCG_CONTROL_COOLDOWN` (600 s), `TCG_BREAKER_BACKOFF` (300 s), `TCG_BREAKER_MAX_OPENS` (4), `TCG_ESCALATION_WEBHOOK` |
| rehearsal | `TCG_FAULT`: `source_down` or `duplicate_prices` |

## The three signals

| Signal | Module | What it records | Where it goes |
|---|---|---|---|
| metrics | `telemetry.py` | numbers of each run (attempts, durations, rows, requests, quality, outcome, `tcg_run_info{run_id,trace_id}`) and of the warehouse (freshness, volume, grain) | Pushgateway (the run) and scrape of the exporter → Prometheus |
| traces | `observability.py` | one span `tcg_dataapp.run`, one `task <name>` per task, one `tcgcsv.<endpoint>` per request, one `sql <file>` per SQL file; failures as status ERROR, events and exceptions | OTLP → collector → Tempo |
| logs | `observability.py` | JSON lines (`run.start`, `task.ok`, `task.fail`, `task.skip`, `run.end`) with `run_id`, `trace_id` and `span_id` | `out/logs/tcg-dataapp.jsonl`; OTLP → collector → Loki |

The signals meet in their identifiers. The alert `TcgRunFailed` reads the `trace_id` from `tcg_run_info`; the trace shows the span with the error; the `span_id` of that span selects its log lines in Loki, and the `trace_id` of a log line opens the trace again. The stack and the links between the datasources are in `../stack/`.

## The closed loop

`control.py` implements a feedback controller over the DataApp.

```text
 setpoint (SLO) ──▶ (comparator: SLI − SLO) ──▶ controller: decide() ──▶ actuators ──▶ plant: DataApp + tcgcsv.com
        ▲                                                                                        │
        └──────────────────────── sensor: sense(), the SLIs read from the warehouse ◀────────────┘
```

| Failure | Actuator | Guardrail | When it escalates |
|---|---|---|---|
| data older than 36 h (leaves the state only below 30 h) | rerun with the prices of today | 600 s of cooldown, 3 reruns per 6 h | when the budget is spent |
| the source fails | circuit breaker: hold, then probe after a backoff that doubles | no rerun while it is open | at the fourth opening |
| a batch breaks the quality gate | quarantine every batch that is not in the last good state, rebuild and check gold; the frozen reports are not touched | protection is not limited by the budget | at the second quarantine in 6 h |
| the run is slow | none: measured and alerted only | | the alert goes to a person |

An escalation happens once and holds every automatic action until the SLIs are back within the SLOs or a person runs `tcg-dataapp control --acknowledge`. Each tick is a span `control.tick` (the rerun that it starts is its child), one JSON log line, one row of `ops.controller_actions` with its `trace_id`, and the metrics `tcg_controller_*`, pushed as `job=tcg_controller`.

## Layers

| Layer | Module | Does |
|---|---|---|
| views | `views/questions.py`, `views/report.py` | the five questions, `out/report.md` and the Parquet files, always read from gold |
| processors | `processors/gold.py`, `processors/quality.py`, `processors/sql/*.sql` | the gold layer as views, the monthly frozen reports and the checks that stop the run |
| etls | `etls/tcgcsv.py`, `etls/extract.py`, `etls/landing.py` | the client of tcgcsv.com, the extraction and the idempotent load into `db_ingestion` |

`pipeline.py` wires the layers into tasks with dependencies, retries and a log in `ops.pipeline_runs`, and records `ops.good_batches` after a good run; `telemetry.py`, `observability.py` and `control.py` are the cross-cutting modules of Lesson 10; `cli.py` is the command `tcg-dataapp`. The processors and the etls call only the OpenTelemetry API; the SDK is configured by the command line.

## Reference numbers (08/11/2026, DuckDB 2.0.0, OpenTelemetry SDK 1.45.2)

- A good run with `--with-today`: 13 tasks ok in 30.6 s, 7,782 prices in 6 captures, 697 cells; 38 spans in Tempo and 15 log lines in Loki.
- A run with `TCG_FAULT=source_down` and 2 retries: failed in 3.0 s, 17 spans, `TcgRunFailed` firing with the run and the trace in its description.
- The controller against the source down, with a backoff of 20 s and escalation at the third opening:

  ```text
  open_breaker · hold · probe (fails, 40 s) · hold · hold · hold · probe (fails, 80 s, escalated) · hold · hold
  ```

  Then `resolve` after a person reran the DataApp.
- The controller against a duplicated batch: quarantine of 3 batches (5,159 rows), gold back to 5,951 = 5,951 keys, the frozen report kept at 1,226 rows. Then:
  - a successful rerun when the fault was transient;
  - an immediate escalation when the same fault recurred within six hours.

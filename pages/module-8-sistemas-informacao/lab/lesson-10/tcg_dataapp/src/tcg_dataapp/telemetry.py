"""Metrics of the DataApp in the Prometheus format (traces and logs are in observability.py).

Two ways of reaching Prometheus, because the DataApp has two kinds of process:

    RunMetrics   the batch run (tcg-dataapp run) lives for about forty seconds,
                 shorter than the scrape interval, so it records its metrics while
                 it runs and pushes them to a Pushgateway at the end; it also writes
                 them to out/metrics.prom, in the text format.
    WarehouseCollector
                 the exporter (tcg-dataapp metrics) is a long-running process that
                 Prometheus scrapes; at every scrape it reads the state of the
                 warehouse (freshness, volume, grain, last run) from the DuckDB file.

Every timestamp is Unix time in seconds, which is also what Prometheus uses.
Every metric lives in a registry of its own, never in the global one, so the
tests can create as many as they need.
"""
from __future__ import annotations

import time
from pathlib import Path

import duckdb
from opentelemetry.trace import SpanKind, Status, StatusCode
from prometheus_client import CollectorRegistry, Counter, Gauge, Histogram, disable_created_metrics, generate_latest
from prometheus_client.exposition import pushadd_to_gateway
from prometheus_client.core import GaugeMetricFamily

from tcg_dataapp.observability import tracer

# The *_created series (when each counter started) only add noise to a job that lives forty seconds.
disable_created_metrics()

JOB = "tcg_dataapp"
SOURCE_BUCKETS = (0.1, 0.25, 0.5, 1, 2, 4, 8, 16)


class RunMetrics:
    """The metrics of one run of the pipeline."""

    def __init__(self, run_id: str):
        self.run_id = run_id
        self.registry = CollectorRegistry()
        r = self.registry
        self.task_attempts = Counter("tcg_task_attempts", "Attempts of each task in this run, by outcome",
                                     ["task", "status"], registry=r)
        self.task_duration = Gauge("tcg_task_duration_seconds", "Duration of the last attempt of each task",
                                   ["task"], registry=r)
        self.task_rows = Gauge("tcg_task_rows", "Rows written to db_ingestion by each extraction task", ["task"], registry=r)
        self.source_latency = Histogram("tcg_source_request_duration_seconds",
                                        "Duration of the requests to tcgcsv.com, by kind of request",
                                        ["endpoint"], buckets=SOURCE_BUCKETS, registry=r)
        self.source_errors = Counter("tcg_source_request_errors", "Requests to tcgcsv.com that raised an error",
                                     ["endpoint"], registry=r)
        self.quality = Gauge("tcg_quality_value", "Numbers measured by check_quality", ["measure"], registry=r)
        self.run_success = Gauge("tcg_run_success", "1 when every task of the run succeeded, 0 otherwise", registry=r)
        self.run_duration = Gauge("tcg_run_duration_seconds", "Duration of the whole run", registry=r)
        self.run_failed_tasks = Gauge("tcg_run_failed_tasks", "Tasks that failed or were skipped in the run", registry=r)
        # An info metric: always 1, its labels say which run (and which trace) the series above describe.
        # One series per instance, replaced at every push, so the cardinality stays at one.
        self.run_info = Gauge("tcg_run_info", "Identifiers of the last run: run_id and trace_id, to open its trace",
                              ["run_id", "trace_id"], registry=r)
        self.run_completion = Gauge("tcg_run_last_completion_timestamp_seconds",
                                    "Unix time at which the last run ended, successful or not", registry=r)
        # Pushed only after a successful run, so a failure does not erase it.
        self.success_registry = CollectorRegistry()
        self.run_last_success = Gauge("tcg_run_last_success_timestamp_seconds",
                                      "Unix time at which the last successful run ended",
                                      registry=self.success_registry)
        self.succeeded = False
        self._started = time.perf_counter()

    # hooks called by the pipeline
    def attempt(self, task: str, status: str, seconds: float | None = None, result: object = None) -> None:
        self.task_attempts.labels(task=task, status=status).inc()
        if seconds is not None:
            self.task_duration.labels(task=task).set(seconds)
        if status == "success" and task.startswith("extract_") and isinstance(result, int):
            self.task_rows.labels(task=task).set(result)
        if status == "success" and task == "check_quality" and isinstance(result, dict):
            for measure in ("fact_rows", "fact_grain_keys", "fact_without_set", "dates", "cube_cells"):
                if measure in result:
                    self.quality.labels(measure=measure).set(result[measure])

    def finish(self, failed: list[str], trace_id: str = "") -> None:
        now = time.time()
        self.run_info.labels(run_id=self.run_id, trace_id=trace_id).set(1)
        self.run_duration.set(time.perf_counter() - self._started)
        self.run_failed_tasks.set(len(failed))
        self.run_success.set(0 if failed else 1)
        self.run_completion.set(now)
        self.succeeded = not failed
        if self.succeeded:
            self.run_last_success.set(now)

    # the client of the source, wrapped so that every request is measured
    def instrument(self, client):
        return InstrumentedClient(client, self)

    # exposition
    def text(self) -> str:
        body = generate_latest(self.registry)
        if self.succeeded:
            body += generate_latest(self.success_registry)
        return body.decode()

    def write(self, path: Path) -> Path:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(self.text(), encoding="utf-8")
        return path

    def push(self, gateway: str, instance: str = "local") -> None:
        """Push to a Pushgateway, in the group job=tcg_dataapp, instance=<instance>.

        pushadd (HTTP POST) replaces only the metrics with the names being pushed, so
        tcg_run_last_success_timestamp_seconds, pushed only after a success, keeps
        the time of the last good run when a run fails.
        """
        key = {"instance": instance}
        pushadd_to_gateway(gateway, job=JOB, registry=self.registry, grouping_key=key, timeout=10)
        if self.succeeded:
            pushadd_to_gateway(gateway, job=JOB, registry=self.success_registry, grouping_key=key, timeout=10)


class InstrumentedClient:
    """Same methods as TcgcsvClient. Each call is one child span (tcgcsv.<endpoint>), timed
    into tcg_source_request_duration_seconds and, when it raises, counted in
    tcg_source_request_errors_total and recorded in the span with status ERROR."""

    METHODS = {"groups": "groups", "products": "products", "prices_today": "prices", "prices_archive": "archive"}

    def __init__(self, client, metrics: RunMetrics):
        self._client = client
        self._metrics = metrics

    def __getattr__(self, name):
        target = getattr(self._client, name)
        endpoint = self.METHODS.get(name)
        if endpoint is None or not callable(target):
            return target

        base = getattr(self._client, "base_url", "")

        def call(*args, **kwargs):
            t0 = time.perf_counter()
            with tracer().start_as_current_span(f"tcgcsv.{endpoint}", kind=SpanKind.CLIENT,
                                                record_exception=False, set_status_on_exception=False) as span:
                span.set_attribute("http.request.method", "GET")
                span.set_attribute("server.address", base.split("//")[-1].split("/")[0])
                span.set_attribute("tcg.endpoint", endpoint)
                if args:
                    span.set_attribute("tcg.argument", str(args[0]))
                try:
                    result = target(*args, **kwargs)
                except Exception as error:
                    self._metrics.source_errors.labels(endpoint=endpoint).inc()
                    span.record_exception(error)
                    span.set_status(Status(StatusCode.ERROR, f"{type(error).__name__}: {error}"))
                    raise
                finally:
                    self._metrics.source_latency.labels(endpoint=endpoint).observe(time.perf_counter() - t0)
                size = sum(len(v) for v in result.values()) if isinstance(result, dict) else len(result)
                span.set_attribute("tcg.records", size)
                return result

        return call


class WarehouseCollector:
    """A custom collector: reads the warehouse at each scrape, as an exporter does.

    The DuckDB file accepts one writer process at a time, so while a run is
    writing the scrape cannot open it; the collector then reports
    tcg_warehouse_readable 0 instead of failing the whole scrape. The same
    happens when the file exists but the gold layer was never built.
    """

    def __init__(self, db_path: Path):
        self.db_path = Path(db_path)

    def collect(self):
        readable = GaugeMetricFamily("tcg_warehouse_readable", "1 when the exporter could read the DuckDB file at this scrape")
        if not self.db_path.exists():
            readable.add_metric([], 0)
            yield readable
            return
        try:
            con = duckdb.connect(str(self.db_path), read_only=True)
        except duckdb.Error:
            readable.add_metric([], 0)
            yield readable
            return
        try:
            families = list(self._read(con))
        except duckdb.Error:  # a warehouse without the gold layer yet, after a run that failed early
            families = []
        finally:
            con.close()
        yield from families
        readable.add_metric([], 1 if families else 0)
        yield readable

    def _read(self, con):
        rows = GaugeMetricFamily("tcg_ingestion_rows", "Rows of db_ingestion, by data tag", labels=["data_tag"])
        last = GaugeMetricFamily("tcg_ingestion_last_timestamp_seconds",
                                 "Unix time of the newest record of db_ingestion, by data tag", labels=["data_tag"])
        batches = GaugeMetricFamily("tcg_ingestion_batches", "Distinct capture timestamps, by data tag", labels=["data_tag"])
        for tag, n, newest, distinct in con.execute(
                "SELECT data_tag, count(*), max(timestamp), count(DISTINCT timestamp) FROM db_ingestion GROUP BY 1 ORDER BY 1").fetchall():
            rows.add_metric([tag], n)
            last.add_metric([tag], newest)
            batches.add_metric([tag], distinct)
        yield rows
        yield last
        yield batches

        fact_rows, fact_keys = con.execute(
            "SELECT count(*), count(DISTINCT (date_unix, product_id, variant)) FROM gold.fact_price").fetchone()
        g = GaugeMetricFamily("tcg_gold_fact_rows", "Rows of gold.fact_price")
        g.add_metric([], fact_rows)
        yield g
        g = GaugeMetricFamily("tcg_gold_fact_grain_keys", "Distinct keys (date, product, variant) of gold.fact_price")
        g.add_metric([], fact_keys)
        yield g

        status = GaugeMetricFamily("tcg_pipeline_last_run_tasks", "Task attempts of the last run in ops.pipeline_runs, by status",
                                   labels=["status"])
        ended = GaugeMetricFamily("tcg_pipeline_last_run_end_timestamp_seconds", "Unix time of the end of the last run")
        last_run = con.execute("SELECT run_id FROM ops.pipeline_runs ORDER BY started_at DESC, rowid DESC LIMIT 1").fetchone()
        if last_run:
            for st, n in con.execute("SELECT status, count(*) FROM ops.pipeline_runs WHERE run_id = ? GROUP BY 1 ORDER BY 1",
                                     [last_run[0]]).fetchall():
                status.add_metric([st], n)
            ended.add_metric([], con.execute("SELECT max(ended_at) FROM ops.pipeline_runs WHERE run_id = ?",
                                             [last_run[0]]).fetchone()[0])
        yield status
        yield ended


def exporter_registry(db_path: Path) -> CollectorRegistry:
    registry = CollectorRegistry()
    registry.register(WarehouseCollector(db_path))
    return registry


def serve(db_path: Path, port: int, addr: str = "0.0.0.0"):
    """Start the HTTP endpoint /metrics of the exporter; returns the server and its thread."""
    from prometheus_client import start_http_server

    return start_http_server(port, addr=addr, registry=exporter_registry(db_path))



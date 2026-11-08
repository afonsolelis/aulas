"""Lesson 10: the metrics of a run, the push to a Pushgateway and the exporter of the warehouse."""
import threading
from http.server import BaseHTTPRequestHandler, HTTPServer

import duckdb
from prometheus_client import generate_latest
from prometheus_client.parser import text_string_to_metric_families

from tcg_dataapp import pipeline, telemetry

from conftest import FakeClient


def samples(text: str) -> dict:
    """{(name, frozenset(labels)): value} of a text exposition."""
    out = {}
    for family in text_string_to_metric_families(text):
        for s in family.samples:
            out[(s.name, frozenset(s.labels.items()))] = s.value
    return out


def value(text, name, **labels):
    return samples(text).get((name, frozenset(labels.items())))


def test_a_good_run_reports_rows_requests_quality_and_success(settings):
    ctx = pipeline.run(settings, client=FakeClient(), echo=lambda _: None)
    text = ctx.metrics.text()
    assert value(text, "tcg_run_success") == 1
    assert value(text, "tcg_run_failed_tasks") == 0
    assert value(text, "tcg_task_rows", task="extract_sets") == 2
    assert value(text, "tcg_task_rows", task="extract_products") == 4
    assert value(text, "tcg_task_attempts_total", task="build_gold", status="success") == 1
    # one request for the groups, one archive per date
    assert value(text, "tcg_source_request_duration_seconds_count", endpoint="groups") == 1
    assert value(text, "tcg_source_request_duration_seconds_count", endpoint="archive") == 2
    assert value(text, "tcg_quality_value", measure="fact_rows") == value(text, "tcg_quality_value", measure="fact_grain_keys") == 6
    assert value(text, "tcg_run_last_success_timestamp_seconds") > 1.7e9


def test_a_failed_run_reports_the_failure_and_no_success_time(settings):
    ctx = pipeline.run(settings, client=FakeClient(fail_times=5), echo=lambda _: None)
    text = ctx.metrics.text()
    assert value(text, "tcg_run_success") == 0
    assert value(text, "tcg_task_attempts_total", task="extract_sets", status="failed") == 2  # retries=1
    assert value(text, "tcg_task_attempts_total", task="write_report", status="skipped") == 1
    assert value(text, "tcg_source_request_errors_total", endpoint="groups") == 2
    assert "tcg_run_last_success_timestamp_seconds" not in text


class Gateway(BaseHTTPRequestHandler):
    received: list = []

    def do_POST(self):  # noqa: N802 - name required by http.server
        body = self.rfile.read(int(self.headers["Content-Length"]))
        Gateway.received.append((self.path, body.decode()))
        self.send_response(200)
        self.end_headers()

    def log_message(self, *args):
        pass


def push_and_collect(ctx) -> list:
    Gateway.received = []
    server = HTTPServer(("127.0.0.1", 0), Gateway)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    try:
        ctx.metrics.push(f"127.0.0.1:{server.server_port}", instance="test")
    finally:
        server.shutdown()
    return Gateway.received


def test_the_push_keeps_the_last_success_when_a_run_fails(settings):
    good = push_and_collect(pipeline.run(settings, client=FakeClient(), echo=lambda _: None))
    assert [path for path, _ in good] == ["/metrics/job/tcg_dataapp/instance/test"] * 2
    assert "tcg_run_last_success_timestamp_seconds" in good[1][1]
    bad = push_and_collect(pipeline.run(settings, client=FakeClient(fail_times=5), echo=lambda _: None))
    assert len(bad) == 1 and "tcg_run_success 0.0" in bad[0][1]


def test_the_exporter_reads_freshness_volume_and_grain(settings):
    pipeline.run(settings, client=FakeClient(), echo=lambda _: None)
    text = generate_latest(telemetry.exporter_registry(settings.db_path)).decode()
    assert value(text, "tcg_warehouse_readable") == 1
    assert value(text, "tcg_ingestion_rows", data_tag="tcgplayer.price.v1") == 6
    assert value(text, "tcg_ingestion_batches", data_tag="tcgplayer.price.v1") == 2
    assert value(text, "tcg_ingestion_last_timestamp_seconds", data_tag="tcgplayer.price.v1") == 1788264000  # 2026-09-01 12:00 UTC
    assert value(text, "tcg_gold_fact_rows") == value(text, "tcg_gold_fact_grain_keys") == 6
    assert value(text, "tcg_pipeline_last_run_tasks", status="success") == 9


def test_the_exporter_reports_an_unreadable_warehouse_instead_of_failing(settings, tmp_path):
    text = generate_latest(telemetry.exporter_registry(tmp_path / "missing.duckdb")).decode()
    assert value(text, "tcg_warehouse_readable") == 0
    pipeline.run(settings, client=FakeClient(fail_times=5), echo=lambda _: None)  # a file without the gold layer
    text = generate_latest(telemetry.exporter_registry(settings.db_path)).decode()
    assert value(text, "tcg_warehouse_readable") == 0
    pipeline.run(settings, client=FakeClient(), echo=lambda _: None)
    writer = duckdb.connect(str(settings.db_path))  # a run in progress holds the file
    try:
        text = generate_latest(telemetry.exporter_registry(settings.db_path)).decode()
    finally:
        writer.close()
    assert value(text, "tcg_warehouse_readable") == 0

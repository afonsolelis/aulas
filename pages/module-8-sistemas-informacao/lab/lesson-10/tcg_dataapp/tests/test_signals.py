"""Lesson 10: the three signals of one run, and how they point at each other."""
import io
import json
import logging

from opentelemetry.trace import StatusCode

from tcg_dataapp import pipeline
from tcg_dataapp.observability import JsonFormatter, RunIdFilter, logger

from conftest import FakeClient


def by_name(finished, name):
    return [s for s in finished if s.name == name]


def test_a_run_is_one_trace_with_tasks_requests_and_sql_files(settings, spans):
    ctx = pipeline.run(settings, client=FakeClient(), echo=lambda _: None)
    finished = spans.get_finished_spans()
    (root,) = by_name(finished, "tcg_dataapp.run")
    assert root.parent is None and root.attributes["tcg.run_id"] == ctx.run_id
    assert {f"{s.context.trace_id:032x}" for s in finished} == {ctx.trace_id}
    tasks = [s for s in finished if s.name.startswith("task ")]
    assert len(tasks) == 9 and all(s.parent.span_id == root.context.span_id for s in tasks)
    (sets_task,) = by_name(finished, "task extract_sets")
    (groups,) = by_name(finished, "tcgcsv.groups")
    assert groups.parent.span_id == sets_task.context.span_id and groups.attributes["tcg.records"] == 3
    (build,) = by_name(finished, "task build_gold")
    sql = [s for s in finished if s.name.startswith("sql ")]
    assert len(sql) == 4 and all(s.parent.span_id == build.context.span_id for s in sql)
    assert root.status.status_code != StatusCode.ERROR


def test_a_failure_marks_the_span_records_the_exception_and_skips_downstream(settings, spans):
    pipeline.run(settings, client=FakeClient(fail_times=5), echo=lambda _: None)
    finished = spans.get_finished_spans()
    (task,) = by_name(finished, "task extract_sets")
    assert task.status.status_code == StatusCode.ERROR
    assert [e.name for e in task.events].count("attempt failed") == 2          # retries=1
    assert any(e.name == "exception" for e in task.events)
    failed_requests = [s for s in by_name(finished, "tcgcsv.groups") if s.status.status_code == StatusCode.ERROR]
    assert len(failed_requests) == 2
    (skipped,) = by_name(finished, "task write_report")
    assert skipped.attributes["tcg.status"] == "skipped"
    (root,) = by_name(finished, "tcg_dataapp.run")
    assert root.status.status_code == StatusCode.ERROR


def test_every_log_line_carries_the_run_the_trace_and_the_span(settings, spans):
    stream = io.StringIO()
    handler = logging.StreamHandler(stream)
    handler.setFormatter(JsonFormatter())
    log = logger()
    log.addHandler(handler)
    log.addFilter(RunIdFilter())
    log.setLevel(logging.INFO)
    try:
        ctx = pipeline.run(settings, client=FakeClient(fail_times=5), echo=lambda _: None)
    finally:
        log.removeHandler(handler)
    lines = [json.loads(line) for line in stream.getvalue().splitlines()]
    assert {line["run_id"] for line in lines} == {ctx.run_id}
    assert {line["trace_id"] for line in lines} == {ctx.trace_id}
    fail = [line for line in lines if line["event"] == "task.fail"]
    assert len(fail) == 2 and fail[0]["task"] == "extract_sets" and fail[0]["error"].startswith("ConnectionError")
    (task,) = by_name(spans.get_finished_spans(), "task extract_sets")
    assert fail[0]["span_id"] == f"{task.context.span_id:016x}"   # the log line of the failing span
    assert lines[-1]["event"] == "run.end" and lines[-1]["level"] == "error"


def test_the_metric_tcg_run_info_gives_the_trace_of_the_run(settings, spans):
    ctx = pipeline.run(settings, client=FakeClient(), echo=lambda _: None)
    text = ctx.metrics.text()
    assert f'tcg_run_info{{run_id="{ctx.run_id}",trace_id="{ctx.trace_id}"}} 1.0' in text

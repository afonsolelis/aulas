"""Traces and structured logs of the DataApp, with OpenTelemetry.

Metrics are in telemetry.py (Prometheus). This module adds the other two signals:

    traces  one span per run, one per task, and child spans for every request to
            tcgcsv.com and every SQL file of the gold layer; a failure sets the
            status of the span to ERROR and records the exception as a span event.
    logs    one JSON object per line, written to out/logs/tcg-dataapp.jsonl, with the
            run_id, the trace_id and the span_id of the span that was active when
            the line was written; with an OTLP endpoint, the same records also go
            to the collector, which delivers them to Loki.

The three signals meet in two identifiers: the run_id (in the logs, in
ops.pipeline_runs and in the metric tcg_run_info) and the trace_id (in the
spans, in the logs and in tcg_run_info). From an alert, the metric gives the
trace_id; the trace gives the failing span; the span_id gives the log line.

The rest of the package calls only the OpenTelemetry API (trace.get_tracer),
which does nothing until setup() installs a provider. So the tests install
their own provider with an in-memory exporter, and a run without a collector
still writes its JSON logs.
"""
from __future__ import annotations

import contextvars
import json
import logging
import time
from pathlib import Path

from opentelemetry import trace

from tcg_dataapp import __version__

SERVICE = "tcg-dataapp"
LOGGER = "tcg_dataapp"

# The run that is executing, so that every log line can carry it.
current_run_id: contextvars.ContextVar[str] = contextvars.ContextVar("current_run_id", default="")

# Attributes of a LogRecord that are not fields given by the caller in extra=.
_STANDARD = set(vars(logging.LogRecord("", 0, "", 0, "", (), None))) | {"message", "asctime", "taskName"}


def tracer():
    return trace.get_tracer(LOGGER, __version__)


def logger() -> logging.Logger:
    return logging.getLogger(LOGGER)


def ids() -> tuple[str, str]:
    """(trace_id, span_id) of the active span, in hexadecimal, or ("", "") outside a span."""
    ctx = trace.get_current_span().get_span_context()
    if not ctx.is_valid:
        return "", ""
    return f"{ctx.trace_id:032x}", f"{ctx.span_id:016x}"


class JsonFormatter(logging.Formatter):
    """One JSON object per line: time in Unix seconds, level, message, run and trace context, extra fields."""

    def format(self, record: logging.LogRecord) -> str:
        trace_id, span_id = ids()
        line = {
            "ts": round(record.created, 3),
            "level": record.levelname.lower(),
            "logger": record.name,
            "msg": record.getMessage(),
            "service": SERVICE,
            "run_id": current_run_id.get(),
            "trace_id": trace_id,
            "span_id": span_id,
        }
        for key, value in vars(record).items():
            if key not in _STANDARD and key not in line:
                line[key] = value if isinstance(value, (str, int, float, bool)) or value is None else str(value)
        if record.exc_info:
            line["exception"] = self.formatException(record.exc_info)
        return json.dumps(line, ensure_ascii=False)


class RunIdFilter(logging.Filter):
    """Adds run_id as an attribute of every record, so that the OTLP handler exports it too."""

    def filter(self, record: logging.LogRecord) -> bool:
        if not getattr(record, "run_id", ""):
            record.run_id = current_run_id.get()
        return True


_configured = False


def setup(log_path: Path | None, otlp_endpoint: str = "", instance: str = "local") -> None:
    """Install the providers once per process: JSON logs to a file and, with an endpoint, OTLP export.

    otlp_endpoint is the base URL of an OpenTelemetry collector (http://localhost:4318);
    traces go to /v1/traces and logs to /v1/logs, by HTTP and protobuf.
    """
    global _configured
    if _configured:
        return
    _configured = True
    log = logger()
    log.setLevel(logging.INFO)
    log.propagate = False
    log.addFilter(RunIdFilter())
    if log_path is not None:
        log_path.parent.mkdir(parents=True, exist_ok=True)
        handler = logging.FileHandler(log_path, encoding="utf-8")
        handler.setFormatter(JsonFormatter())
        log.addHandler(handler)
    if not otlp_endpoint:
        return

    from opentelemetry._logs import set_logger_provider
    from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
    from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
    from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
    from opentelemetry.sdk._logs.export import BatchLogRecordProcessor
    from opentelemetry.sdk.resources import Resource
    from opentelemetry.sdk.trace import TracerProvider
    from opentelemetry.sdk.trace.export import BatchSpanProcessor

    base = otlp_endpoint.rstrip("/")
    resource = Resource.create({"service.name": SERVICE, "service.version": __version__,
                                "service.instance.id": instance})
    provider = TracerProvider(resource=resource)
    provider.add_span_processor(BatchSpanProcessor(OTLPSpanExporter(endpoint=f"{base}/v1/traces", timeout=5)))
    trace.set_tracer_provider(provider)
    logs = LoggerProvider(resource=resource)
    logs.add_log_record_processor(BatchLogRecordProcessor(OTLPLogExporter(endpoint=f"{base}/v1/logs", timeout=5)))
    set_logger_provider(logs)
    log.addHandler(LoggingHandler(level=logging.INFO, logger_provider=logs))


def flush() -> None:
    """Send what the batch processors still hold; called at the end of a command."""
    from opentelemetry._logs import get_logger_provider

    for provider in (trace.get_tracer_provider(), get_logger_provider()):
        force = getattr(provider, "force_flush", None)
        if force:
            force(5000)


def timed() -> float:
    return time.perf_counter()

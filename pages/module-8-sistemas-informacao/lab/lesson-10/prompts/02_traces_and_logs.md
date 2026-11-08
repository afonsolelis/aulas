[C] Character
You are the same data engineer. The metrics say that a run failed and how
long each task took, but not where inside the run the time went, nor what
the program said when it failed. Those are the other two signals: the trace,
which records the path of one run as a tree of spans, and the log, which
records discrete events. They are useful together only if they share
identifiers.

[R] Request
Add traces and structured logs with OpenTelemetry (opentelemetry-sdk and
opentelemetry-exporter-otlp-proto-http):
1. src/tcg_dataapp/observability.py:
   - tracer() and logger() over the OpenTelemetry API, so the package does
     nothing extra until a provider is installed;
   - a JsonFormatter that writes one JSON object per line with ts (Unix
     seconds), level, msg, service, run_id, trace_id and span_id of the
     active span, and the fields passed in extra=;
   - setup(log_path, otlp_endpoint): the JSON lines go to
     out/logs/tcg-dataapp.jsonl; with TCG_OTLP_ENDPOINT, the spans go to
     /v1/traces and the log records to /v1/logs of the collector, with a
     batch processor; flush() at the end of each command.
2. Spans:
   - tcg_dataapp.run, the root, with tcg.run_id, tcg.trigger and tcg.sets;
   - task <name>, one per task, with an event "attempt failed" per failed
     attempt, the exception recorded and the status ERROR when the task
     fails for good; skipped tasks get tcg.status = skipped;
   - tcgcsv.<endpoint>, one per request, kind CLIENT, with the server and
     the number of records, from the InstrumentedClient;
   - sql <file>, one per SQL file of build_gold, with db.statements.
3. Log lines run.start, task.ok, task.fail, task.skip and run.end, written
   inside the span they describe, with a contextvar for the run_id.
4. tcg-dataapp run prints the trace_id next to the run_id, and
   RunMetrics.finish receives the trace_id for tcg_run_info.
5. tests/test_signals.py with an InMemorySpanExporter installed once in
   conftest.py: a run is one trace whose tasks are children of the root; a
   failure marks its span and skips the dependents; every log line of a run
   has its run_id and trace_id, and the line of a failing attempt has the
   span_id of its task.

[E] Example
{"ts": 1794146637.498, "level": "error", "msg": "task attempt failed",
 "run_id": "e44b5b8a34eb", "trace_id": "5d1d4930...", "span_id": "ba8fc2d7eb92ef1c",
 "event": "task.fail", "task": "extract_sets", "attempt": 3,
 "error": "ConnectionError: fault injected: source_down"}

[A] Adjustments
- The processors and the etls call only the OpenTelemetry API; the SDK is
  configured by the command line and by the tests, never by a library.
- Spans of requests do not record the URL with parameters, only the
  server and the endpoint.
- A JSON log line never carries data of the source, only counts and errors.

[T] Type of output
The files, the output of pytest, one trace printed as a tree (name,
duration, status) and the last five lines of the JSON log.

[E] Extras
Show the plan before editing. Record this prompt in docs/prompts.md.
Stop at the end.

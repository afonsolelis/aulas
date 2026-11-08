"""The closed loop of the DataApp: a controller that reads the SLIs, compares them with the SLOs and acts.

Observability alone is the sensor and the display of the loop: the metrics, traces
and logs say what happened, and an alert tells a person. The loop closes only
when something compares the measured value with the setpoint and acts on the
process. This module is that something, in the vocabulary of control theory:

    setpoint    the SLOs of config.py (freshness, success, duration, source errors, grain)
    sensor      sense(): the SLIs read from the warehouse (db_ingestion, gold, ops.pipeline_runs)
    comparator  error = SLI - SLO, with a dead band (hysteresis) on the freshness
    controller  decide(): a pure function of the SLIs, the state and the clock
    actuators   rerun the pipeline; open, probe and close a circuit breaker on the
                source; quarantine the batches that broke the quality gate, which
                restores the last state that passed it; escalate to a person
    plant       the DataApp and its source, tcgcsv.com
    feedback    the next tick reads the effect of the last action

Guardrails keep the loop from oscillating: a cooldown between reruns, a budget
of reruns per window, a backoff that doubles at every reopening of the breaker,
and one escalation that holds every automatic action until the SLIs are back
within the SLOs. Each tick is itself observable: a span control.tick (whose
children are the spans of the actions, including the run that a rerun starts),
one JSON log line, one row of ops.controller_actions and the metrics
tcg_controller_*, pushed to the Pushgateway as job tcg_controller.
"""
from __future__ import annotations

import json
import time
import urllib.request
import uuid
from dataclasses import asdict, dataclass, field
from typing import Callable

import duckdb
from opentelemetry.trace import Status, StatusCode
from prometheus_client import CollectorRegistry, Gauge, pushadd_to_gateway
from prometheus_client.core import CounterMetricFamily

from tcg_dataapp import pipeline
from tcg_dataapp.config import Settings
from tcg_dataapp.etls.tcgcsv import TcgcsvClient
from tcg_dataapp.observability import ids, logger, tracer
from tcg_dataapp.processors import gold, quality

STATE_DDL = """
CREATE SCHEMA IF NOT EXISTS ops;
CREATE TABLE IF NOT EXISTS ops.controller_state (id INTEGER PRIMARY KEY, state JSON, updated_at BIGINT);
CREATE TABLE IF NOT EXISTS ops.controller_actions (
    tick_id VARCHAR, acted_at BIGINT, action VARCHAR, reason VARCHAR, outcome VARCHAR, trace_id VARCHAR
);
CREATE SCHEMA IF NOT EXISTS quarantine;
CREATE TABLE IF NOT EXISTS quarantine.db_ingestion (
    timestamp BIGINT, data_json JSON, data_tag VARCHAR, run_id VARCHAR, reason VARCHAR, quarantined_at BIGINT
);
"""

# Errors that mean "the source did not answer", as written in ops.pipeline_runs.detail.
SOURCE_ERRORS = ("ConnectionError", "URLError", "HTTPError", "TimeoutError", "RemoteDisconnected",
                 "ConnectionResetError", "ConnectionRefusedError", "gaierror", "IncompleteRead")
QUALITY_TASKS = ("build_gold", "check_quality")



@dataclass
class State:
    """What the controller remembers between ticks, kept in ops.controller_state."""
    breaker: str = "closed"        # closed | open
    open_until: float = 0
    opens: int = 0                 # reopenings since the breaker last closed for good
    stale: bool = False            # the freshness is outside the band (hysteresis)
    handled_run: str = ""          # last failed run already answered by a quarantine
    escalated: str = ""            # reason of the open escalation; "" when none

    @classmethod
    def load(cls, con) -> "State":
        row = con.execute("SELECT state FROM ops.controller_state WHERE id = 1").fetchone()
        return cls(**json.loads(row[0])) if row else cls()

    def save(self, con, now: float) -> None:
        con.execute("INSERT OR REPLACE INTO ops.controller_state VALUES (1, ?, ?)",
                    [json.dumps(asdict(self)), int(now)]).fetchall()


@dataclass
class Sli:
    freshness_s: float | None = None
    last_run_id: str = ""
    last_status: str = "none"      # ok | failed | none
    failed_tasks: list = field(default_factory=list)
    error_class: str = ""          # source | quality | other
    run_duration_s: float = 0
    source_error_rate: float = 0
    grain_ok: bool | None = None


@dataclass
class Decision:
    action: str                    # none | hold | rerun | open_breaker | probe | quarantine | escalate | resolve
    reason: str
    escalate: bool = False         # also escalate after the action


def sense(con, now: float) -> Sli:
    """The sensor: SLIs read from the warehouse, the same numbers that the exporter publishes."""
    s = Sli()
    try:
        newest = con.execute("SELECT max(timestamp) FROM db_ingestion WHERE data_tag = 'tcgplayer.price.v1'").fetchone()[0]
    except duckdb.Error:
        newest = None
    s.freshness_s = None if newest is None else max(now - newest, 0)
    last = con.execute("SELECT run_id FROM ops.pipeline_runs ORDER BY started_at DESC, rowid DESC LIMIT 1").fetchone()
    if last:
        s.last_run_id = last[0]
        rows = con.execute("SELECT task, attempt, status, started_at, ended_at, detail FROM ops.pipeline_runs "
                           "WHERE run_id = ? ORDER BY started_at, attempt", [s.last_run_id]).fetchall()
        final = {}
        for task, _attempt, status, *_ in rows:
            final[task] = status
        s.failed_tasks = sorted(t for t, st in final.items() if st in ("failed", "skipped"))
        s.last_status = "failed" if s.failed_tasks else "ok"
        s.run_duration_s = max(r[4] for r in rows) - min(r[3] for r in rows)
        extract_attempts = [r for r in rows if r[0].startswith("extract_") and r[2] in ("success", "failed")]
        source_failures = [r for r in extract_attempts if r[2] == "failed" and str(r[5]).startswith(SOURCE_ERRORS)]
        s.source_error_rate = len(source_failures) / len(extract_attempts) if extract_attempts else 0
        roots = [t for t, st in final.items() if st == "failed"]
        if any(t in QUALITY_TASKS for t in roots):
            s.error_class = "quality"
        elif roots and all(t.startswith("extract_") for t in roots) and source_failures:
            s.error_class = "source"
        elif roots:
            s.error_class = "other"
    try:
        rows, keys = con.execute("SELECT count(*), count(DISTINCT (date_unix, product_id, variant)) FROM gold.fact_price").fetchone()
        s.grain_ok = rows == keys
    except duckdb.Error:
        s.grain_ok = None
    return s


def errors(sli: Sli, st: Settings) -> dict:
    """The comparator: SLI minus setpoint; a positive error is a violation."""
    return {
        "freshness_s": None if sli.freshness_s is None else sli.freshness_s - st.slo_freshness_s,
        "run_duration_s": sli.run_duration_s - st.slo_run_duration_s,
        "source_error_rate": round(sli.source_error_rate - st.slo_source_error_rate, 4),
        "run_failed": 1 if sli.last_status == "failed" else 0,
        "grain_broken": 1 if sli.grain_ok is False else 0,
    }


def stale_with_hysteresis(sli: Sli, state: State, st: Settings) -> bool:
    """Enter the stale state above slo_freshness_s and leave it only below slo_freshness_ok_s.

    Without the dead band, a freshness that hovers around the setpoint would
    turn the reruns on and off at every tick.
    """
    if sli.freshness_s is None:
        return True
    if sli.freshness_s > st.slo_freshness_s:
        return True
    if sli.freshness_s < st.slo_freshness_ok_s:
        return False
    return state.stale


def decide(sli: Sli, state: State, st: Settings, now: float, history: list[tuple]) -> Decision:
    """The controller: a pure function, so every rule can be tested with a fake clock.

    history is the list of (at, action) of ops.controller_actions inside the window.
    """
    stale = stale_with_hysteresis(sli, state, st)
    state.stale = stale
    quality_bad = sli.grain_ok is False or (sli.last_status == "failed" and sli.error_class == "quality")
    source_bad = sli.last_status == "failed" and (sli.error_class == "source"
                                                  or sli.source_error_rate > st.slo_source_error_rate)
    run_failed = sli.last_status == "failed"
    healthy = not (stale or quality_bad or run_failed)

    if healthy:
        if state.breaker != "closed" or state.escalated or state.opens:
            return Decision("resolve", "every SLI is within its SLO")
        return Decision("none", "every SLI is within its SLO")

    # Protection comes before everything, even with an open escalation: a broken
    # gold layer is quarantined at once, so the views never serve a wrong number.
    if quality_bad and sli.last_run_id != state.handled_run:
        strikes = sum(1 for _, a in history if a == "quarantine") + 1
        return Decision("quarantine", f"quality gate failed in run {sli.last_run_id} ({', '.join(sli.failed_tasks)})",
                        escalate=strikes >= 2)

    if state.escalated:
        return Decision("hold", f"escalated ({state.escalated}); waiting for a person")

    if state.breaker == "open":
        if now < state.open_until:
            return Decision("hold", f"circuit breaker open for {int(state.open_until - now)} s more")
        return Decision("probe", "backoff elapsed; probing the source")

    if source_bad:
        return Decision("open_breaker", f"the source failed: error rate {sli.source_error_rate:.0%} "
                                        f"against an SLO of {st.slo_source_error_rate:.0%}")

    reruns = [at for at, a in history if a == "rerun"]
    if len(reruns) >= st.control_max_actions:
        return Decision("escalate", f"{len(reruns)} reruns in {st.control_window_s} s did not restore the SLOs")
    if reruns and now - max(reruns) < st.control_cooldown_s:
        return Decision("hold", f"cooldown: last rerun {int(now - max(reruns))} s ago")
    if run_failed:
        return Decision("rerun", f"run {sli.last_run_id} failed ({sli.error_class}: {', '.join(sli.failed_tasks)})")
    return Decision("rerun", f"prices are {int(sli.freshness_s or 0)} s old, SLO {st.slo_freshness_s} s")


def quarantine(con, run_id: str, reason: str, now: float) -> dict:
    """Move every batch that is not in the last known good state to quarantine.db_ingestion.

    A batch is good when its tag, timestamp, rows and digest are those recorded by
    the last successful run in ops.good_batches. Removing the others brings
    db_ingestion back to that state, so the views of gold (rebuilt and checked
    here) serve the last good numbers again; the frozen reports are tables and
    are not touched. The quarantined rows stay available for a person to inspect.
    """
    good = con.execute("SELECT count(*) FROM ops.good_batches").fetchone()[0]
    if not good:
        raise RuntimeError("no known good state to restore")
    con.execute("CREATE OR REPLACE TEMP TABLE _digest AS " + pipeline.BATCH_DIGEST).fetchall()
    bad = con.execute("""
        SELECT d.data_tag, d.timestamp FROM _digest d
        LEFT JOIN ops.good_batches g USING (data_tag, timestamp)
        WHERE g.data_tag IS NULL OR g.rows IS DISTINCT FROM d.rows OR g.digest IS DISTINCT FROM d.digest
    """).fetchall()
    moved = 0
    con.execute("BEGIN TRANSACTION").fetchall()
    try:
        for tag, ts in bad:
            moved += con.execute("SELECT count(*) FROM db_ingestion WHERE data_tag = ? AND timestamp = ?", [tag, ts]).fetchone()[0]
            con.execute("INSERT INTO quarantine.db_ingestion SELECT timestamp, data_json, data_tag, ?, ?, ? "
                        "FROM db_ingestion WHERE data_tag = ? AND timestamp = ?", [run_id, reason[:300], int(now), tag, ts]).fetchall()
            con.execute("DELETE FROM db_ingestion WHERE data_tag = ? AND timestamp = ?", [tag, ts]).fetchall()
        con.execute("COMMIT").fetchall()
    except Exception:
        con.execute("ROLLBACK").fetchall()
        raise
    gold.build_gold(con)
    checked = quality.check_gold(con)
    return {"batches": len(bad), "rows": moved, "fact_rows": checked["fact_rows"], "grain_keys": checked["fact_grain_keys"]}


class ControllerMetrics:
    """The metrics of the loop itself, pushed as job tcg_controller."""

    def __init__(self, con):
        self.registry = CollectorRegistry()
        r = self.registry
        self.sli = Gauge("tcg_controller_sli", "SLI read by the controller at the last tick", ["sli"], registry=r)
        self.slo = Gauge("tcg_controller_slo", "Setpoint (SLO) of each SLI", ["sli"], registry=r)
        self.error = Gauge("tcg_controller_error", "SLI minus SLO at the last tick; positive is a violation", ["sli"], registry=r)
        self.breaker = Gauge("tcg_controller_breaker_open", "1 while the circuit breaker on the source is open", registry=r)
        self.escalated = Gauge("tcg_controller_escalated", "1 while an escalation to a person is open", registry=r)
        self.tick = Gauge("tcg_controller_last_tick_timestamp_seconds", "Unix time of the last tick", registry=r)
        con_rows = con.execute("SELECT action, count(*) FROM ops.controller_actions GROUP BY 1 ORDER BY 1").fetchall()
        family = CounterMetricFamily("tcg_controller_actions", "Actions of the controller recorded in ops.controller_actions",
                                     labels=["action"])
        for action, n in con_rows:
            family.add_metric([action], n)

        class Fixed:
            def collect(self_inner):
                yield family

        r.register(Fixed())


def _connect(path, tries: int = 5, pause: float = 0.5):
    """Open the warehouse for writing; the exporter may be reading it for a few milliseconds."""
    for attempt in range(tries):
        try:
            return duckdb.connect(str(path))
        except duckdb.IOException:
            if attempt == tries - 1:
                raise
            time.sleep(pause)


class Controller:
    def __init__(self, settings: Settings, client_factory: Callable[[], object] | None = None,
                 now: Callable[[], float] = time.time, echo: Callable[[str], None] = print):
        self.settings = settings
        self.client_factory = client_factory or (lambda: TcgcsvClient(settings.base_url, settings.category))
        self.now = now
        self.echo = echo

    def tick(self) -> Decision:
        st, now, log = self.settings, self.now(), logger()
        st.db_path.parent.mkdir(parents=True, exist_ok=True)
        con = _connect(st.db_path)
        tick_id = uuid.uuid4().hex[:12]
        try:
            for statement in con.extract_statements(pipeline.LOG_DDL + STATE_DDL):
                con.execute(statement).fetchall()
            with tracer().start_as_current_span("control.tick") as span:
                span.set_attribute("tcg.tick_id", tick_id)
                state = State.load(con)
                with tracer().start_as_current_span("control.sense"):
                    sli = sense(con, now)
                err = errors(sli, st)
                history = con.execute("SELECT acted_at, action FROM ops.controller_actions WHERE acted_at >= ? ORDER BY acted_at",
                                      [int(now - st.control_window_s)]).fetchall()
                decision = decide(sli, state, st, now, history)
                for k, v in asdict(sli).items():
                    if isinstance(v, (int, float, str, bool)):
                        span.set_attribute(f"tcg.sli.{k}", v)
                span.set_attribute("tcg.decision", decision.action)
                span.set_attribute("tcg.reason", decision.reason)
                outcome = self._act(con, decision, state, sli, now)
                if decision.escalate and not state.escalated:
                    outcome += " · " + self._escalate(con, state, decision.reason, now)
                if decision.action in ("open_breaker", "quarantine", "escalate", "probe") and "fail" in outcome:
                    span.set_status(Status(StatusCode.ERROR, outcome[:200]))
                state.save(con, now)
                trace_id = ids()[0]
                if decision.action != "none":
                    con.execute("INSERT INTO ops.controller_actions VALUES (?, ?, ?, ?, ?, ?)",
                                [tick_id, int(now), decision.action, decision.reason[:300], outcome[:300], trace_id]).fetchall()
                level = 20 if decision.action in ("none", "hold", "resolve") else 30
                if state.escalated and decision.action == "escalate":
                    level = 40
                log.log(level, "control tick", extra={
                    "event": "control.tick", "tick_id": tick_id, "action": decision.action, "reason": decision.reason,
                    "outcome": outcome, "breaker": state.breaker, "escalated": state.escalated,
                    "freshness_s": sli.freshness_s, "last_run": sli.last_run_id, "last_status": sli.last_status,
                    "error_class": sli.error_class, "grain_ok": sli.grain_ok})
                self.echo(f"tick {tick_id}  {decision.action:12} {decision.reason}  →  {outcome}")
                self._push(con, sli, err, state, now)
        finally:
            con.close()
        return decision

    # actuators
    def _act(self, con, d: Decision, state: State, sli: Sli, now: float) -> str:
        st = self.settings
        with tracer().start_as_current_span(f"control.act {d.action}") as span:
            if d.action in ("none", "hold"):
                return "no action"
            if d.action == "resolve":
                closed = f"breaker {state.breaker} → closed" if state.breaker != "closed" else "breaker closed"
                was = state.escalated
                state.breaker, state.open_until, state.opens, state.escalated = "closed", 0, 0, ""
                return closed + (f"; escalation resolved ({was})" if was else "")
            if d.action == "rerun":
                return self._rerun(con, span)
            if d.action == "open_breaker":
                return self._open(state, now)
            if d.action == "probe":
                try:
                    with tracer().start_as_current_span("control.probe"):
                        client = self.client_factory()
                        if st.fault:                       # a rehearsed fault applies to the probe too
                            from tcg_dataapp.faults import FaultyClient
                            client = FaultyClient(client, st.fault)
                        client.groups()
                except Exception as error:  # noqa: BLE001 - a failed probe reopens the breaker
                    span.record_exception(error)
                    result = f"probe failed ({type(error).__name__}); " + self._open(state, now)
                    if state.opens >= st.breaker_max_opens and not state.escalated:
                        result += " · " + self._escalate(con, state, f"source down after {state.opens} openings of the breaker", now)
                    return result
                state.breaker, state.open_until = "closed", 0
                return "probe ok, breaker closed; " + self._rerun(con, span)
            if d.action == "quarantine":
                try:
                    q = quarantine(con, sli.last_run_id, d.reason, now)
                except Exception as error:  # noqa: BLE001
                    span.record_exception(error)
                    return "quarantine failed: " + self._escalate(con, state, f"cannot restore a good state: {error}", now)
                state.handled_run = sli.last_run_id
                return (f"{q['batches']} batches ({q['rows']} rows) quarantined; gold back to the last good state, "
                        f"{q['fact_rows']} rows = {q['grain_keys']} keys")
            if d.action == "escalate":
                return self._escalate(con, state, d.reason, now)
        return "unknown action"

    def _rerun(self, con, span) -> str:
        ctx = pipeline.run(self.settings, client=self.client_factory(), con=con, with_today=True,
                           echo=lambda _: None, trigger="controller")
        failed = ctx.results["_failed"]
        span.set_attribute("tcg.rerun.run_id", ctx.run_id)
        if self.settings.pushgateway and ctx.metrics:
            try:
                ctx.metrics.push(self.settings.pushgateway, self.settings.instance)
            except OSError:
                pass
        return f"rerun {ctx.run_id} " + ("ok" if not failed else f"failed ({', '.join(failed)})")

    def _open(self, state: State, now: float) -> str:
        backoff = self.settings.breaker_backoff_s * 2 ** state.opens
        state.breaker, state.open_until, state.opens = "open", now + backoff, state.opens + 1
        return f"breaker open for {backoff} s (opening {state.opens})"

    def _escalate(self, con, state: State, reason: str, now: float) -> str:
        """Hand the loop to a person: once, until the SLIs are back within the SLOs."""
        state.escalated = reason[:200]
        url = self.settings.escalation_webhook
        if url:
            body = json.dumps({"service": "tcg-dataapp", "reason": reason, "at": int(now), "trace_id": ids()[0]}).encode()
            try:
                urllib.request.urlopen(urllib.request.Request(url, data=body, headers={"Content-Type": "application/json"}),
                                       timeout=5).read()
            except OSError:
                return "escalated (webhook unreachable; the metric tcg_controller_escalated still pages)"
        return "escalated to a person"

    def _push(self, con, sli: Sli, err: dict, state: State, now: float) -> None:
        if not self.settings.pushgateway:
            return
        m = ControllerMetrics(con)
        st = self.settings
        for name, value, slo in (("freshness_s", sli.freshness_s, st.slo_freshness_s),
                                 ("run_duration_s", sli.run_duration_s, st.slo_run_duration_s),
                                 ("source_error_rate", sli.source_error_rate, st.slo_source_error_rate)):
            if value is not None:
                m.sli.labels(sli=name).set(value)
                m.slo.labels(sli=name).set(slo)
                m.error.labels(sli=name).set(err[name])
        m.sli.labels(sli="grain_ok").set(1 if sli.grain_ok else 0)
        m.breaker.set(1 if state.breaker == "open" else 0)
        m.escalated.set(1 if state.escalated else 0)
        m.tick.set(now)
        try:
            pushadd_to_gateway(st.pushgateway, job="tcg_controller", registry=m.registry,
                               grouping_key={"instance": st.instance}, timeout=10)
        except OSError:
            pass

    def loop(self, interval: float, ticks: int | None = None, sleep: Callable[[float], None] = time.sleep) -> None:
        n = 0
        while ticks is None or n < ticks:
            self.tick()
            n += 1
            if ticks is None or n < ticks:
                sleep(interval)

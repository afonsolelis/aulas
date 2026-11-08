"""Lesson 10: the closed loop. Each test breaks the plant and checks that the controller
detects it, acts within its guardrails and either recovers or hands over to a person once."""
import dataclasses
import time

import duckdb

from tcg_dataapp import control, pipeline

from conftest import FakeClient


class Clock:
    def __init__(self):
        self.t = time.time()

    def __call__(self):
        return self.t


def tuned(settings, **kw):
    base = dict(control_cooldown_s=60, control_max_actions=3, control_window_s=3600,
                breaker_backoff_s=100, breaker_max_opens=3)
    base.update(kw)
    return dataclasses.replace(settings, **base)


def controller(settings, client, clock):
    return control.Controller(settings, client_factory=lambda: client, now=clock, echo=lambda _: None)


def actions(settings):
    con = duckdb.connect(str(settings.db_path), read_only=True)
    try:
        return [a for (a,) in con.execute("SELECT action FROM ops.controller_actions ORDER BY acted_at, rowid").fetchall()]
    finally:
        con.close()


def test_a_healthy_dataapp_gets_no_action(settings):
    settings = tuned(settings)
    client = FakeClient()
    pipeline.run(settings, client=client, with_today=True, echo=lambda _: None)
    assert controller(settings, client, Clock()).tick().action == "none"


def test_stale_data_is_rerun_and_the_loop_settles(settings):
    settings = tuned(settings)
    client, clock = FakeClient(), Clock()
    pipeline.run(settings, client=client, echo=lambda _: None)        # newest price: 2026-09-01, stale
    c = controller(settings, client, clock)
    assert c.tick().action == "rerun"
    clock.t += 300
    assert c.tick().action == "none"                                   # feedback: fresh again
    assert actions(settings) == ["rerun"]


def test_a_source_down_opens_the_breaker_backs_off_and_escalates_once(settings):
    settings = tuned(settings)
    client, clock = FakeClient(), Clock()
    pipeline.run(settings, client=client, with_today=True, echo=lambda _: None)
    client.down = True
    pipeline.run(settings, client=client, with_today=True, echo=lambda _: None)   # the daily run fails
    c = controller(settings, client, clock)
    seen = []
    for step in (0, 10, 90, 50, 150, 200, 1000, 5000):                 # seconds between ticks
        clock.t += step
        seen.append(c.tick().action)
    # t=0 open for 100 s · t=10 hold · t=100 probe fails, reopen for 200 s · t=150 hold ·
    # t=300 probe fails, reopen for 400 s: third opening → escalate · then hold, however long it waits
    assert seen == ["open_breaker", "hold", "probe", "hold", "probe", "hold", "hold", "hold"]
    con = duckdb.connect(str(settings.db_path), read_only=True)
    state = control.State.load(con)
    con.close()
    assert state.escalated.startswith("source down after 3 openings") and state.opens == 3
    assert "rerun" not in actions(settings)                            # no rerun against a source that is down
    # the source comes back; the controller still waits for the person, who reruns by hand
    client.down = False
    clock.t += 60
    assert c.tick().action == "hold"
    pipeline.run(settings, client=client, with_today=True, echo=lambda _: None)
    clock.t += 60
    assert c.tick().action == "resolve"
    clock.t += 60
    assert c.tick().action == "none"


def test_a_source_that_comes_back_closes_the_breaker_without_a_person(settings):
    settings = tuned(settings)
    client, clock = FakeClient(), Clock()
    pipeline.run(settings, client=client, with_today=True, echo=lambda _: None)
    client.down = True
    pipeline.run(settings, client=client, with_today=True, echo=lambda _: None)
    c = controller(settings, client, clock)
    assert c.tick().action == "open_breaker"
    client.down = False
    clock.t += 100
    d = c.tick()
    assert d.action == "probe"
    clock.t += 60
    assert c.tick().action == "resolve"                                # probe ok → breaker closed → rerun ok
    assert actions(settings) == ["open_breaker", "probe", "resolve"]


def test_a_bad_batch_is_quarantined_and_a_repeated_one_escalates_without_oscillating(settings):
    settings = tuned(settings)
    client, clock = FakeClient(), Clock()
    pipeline.run(settings, client=client, with_today=True, echo=lambda _: None)   # the last known good state
    faulty = dataclasses.replace(settings, fault="duplicate_prices")
    ctx = pipeline.run(faulty, client=client, with_today=True, echo=lambda _: None)
    assert "check_quality" in ctx.results["_failed"]
    c = controller(faulty, client, clock)                              # the fault persists in the reruns
    seen = []
    for step in (0, 60, 60, 60, 600):
        clock.t += step
        seen.append(c.tick().action)
    assert seen == ["quarantine", "rerun", "quarantine", "hold", "hold"]
    con = duckdb.connect(str(settings.db_path), read_only=True)
    rows, keys = con.execute("SELECT count(*), count(DISTINCT (date_unix, product_id, variant)) FROM gold.fact_price").fetchone()
    frozen = con.execute("SELECT count(*) FROM report.mv_card_price_2026_08").fetchone()[0]
    quarantined = con.execute("SELECT count(DISTINCT run_id) FROM quarantine.db_ingestion").fetchone()[0]
    state = control.State.load(con)
    con.close()
    # The duplicated batch replaced the good batch of today (same key), so the
    # quarantine removes today's capture: gold falls back to the two archives.
    assert rows == keys == 6 and frozen == 2 and quarantined == 2   # the frozen August report is untouched
    assert state.escalated.startswith("quality gate failed")


def test_a_failure_without_a_specific_actuator_is_rerun_within_the_budget(settings):
    settings = tuned(settings)

    class SchemaChanged(FakeClient):
        def prices_today(self, group_id):
            raise ValueError("field marketPrice missing")

    client, clock = SchemaChanged(), Clock()
    pipeline.run(settings, client=client, with_today=True, echo=lambda _: None)
    c = controller(settings, client, clock)
    seen = []
    for step in (0, 30, 30, 60, 60, 60, 60):
        clock.t += step
        seen.append(c.tick().action)
    # rerun · cooldown · rerun · rerun · budget of 3 spent → escalate · hold · hold
    assert seen == ["rerun", "hold", "rerun", "rerun", "escalate", "hold", "hold"]


def test_every_tick_is_a_trace_and_the_rerun_is_a_child_of_the_tick(settings, spans):
    settings = tuned(settings)
    client, clock = FakeClient(), Clock()
    pipeline.run(settings, client=client, echo=lambda _: None)
    spans.clear()
    controller(settings, client, clock).tick()
    finished = spans.get_finished_spans()
    (tick,) = [s for s in finished if s.name == "control.tick"]
    (act,) = [s for s in finished if s.name == "control.act rerun"]
    (run,) = [s for s in finished if s.name == "tcg_dataapp.run"]
    assert act.parent.span_id == tick.context.span_id and run.parent.span_id == act.context.span_id
    assert run.attributes["tcg.trigger"] == "controller" and tick.attributes["tcg.decision"] == "rerun"
    con = duckdb.connect(str(settings.db_path), read_only=True)
    (trace_id,) = con.execute("SELECT trace_id FROM ops.controller_actions").fetchone()
    con.close()
    assert trace_id == f"{tick.context.trace_id:032x}"

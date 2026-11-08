[C] Character
You are a reliability engineer who knows control theory. Everything built
so far is the sensor and the display of a loop: the DataApp is measured and
a person is warned. The loop is still open, because nothing compares the
measurement with the setpoint and acts on the process. Close it, and make
sure that it cannot oscillate nor act forever without a person.

[R] Request
Write src/tcg_dataapp/control.py and the command tcg-dataapp control:
1. Setpoints in config.py, from TCG_* variables: freshness 36 h (and 30 h
   to leave the stale state: hysteresis), run duration 120 s, error rate of
   the source 50 %, plus the grain and the success of the last run.
2. sense(con, now): the SLIs read from the warehouse (newest price, last
   run of ops.pipeline_runs with its failed tasks and the class of the
   error: source, quality or other; error rate of the extractions; grain).
3. errors(): SLI minus SLO; decide(sli, state, settings, now, history): a
   pure function that returns one action:
   - quarantine when the quality gate failed: move every batch that is not
     in ops.good_batches (tag, timestamp, rows, md5 digest, recorded by
     the last good run) to quarantine.db_ingestion, rebuild and check gold;
     the frozen reports are tables and stay as they are; a second
     quarantine within the window also escalates;
   - open_breaker when the source failed; hold while it is open; probe
     after a backoff that doubles at every opening; escalate at the fourth
     opening;
   - rerun (with the prices of today) when the data is stale or the run
     failed for another reason, with a cooldown of 600 s and a budget of 3
     reruns per 6 h; escalate when the budget is spent;
   - resolve when every SLI is back within its SLO; none otherwise.
4. Escalation happens once: it sets state.escalated, optionally posts to
   TCG_ESCALATION_WEBHOOK, and every later tick holds until the SLIs
   recover or a person runs tcg-dataapp control --acknowledge.
5. The loop is observable: a span control.tick with control.sense and
   control.act <action> (the rerun is a child of it), one JSON log line,
   one row of ops.controller_actions with the trace_id, and the metrics
   tcg_controller_* pushed as job tcg_controller.
6. faults.py: TCG_FAULT=source_down or duplicate_prices, applied to the
   client of the run and of the probe.
7. tests/test_control.py with a fake clock: stale data is rerun and the
   loop settles; a source down opens, backs off and escalates once without
   any rerun; a source that returns closes the breaker alone; a bad batch
   is quarantined and a repeated one escalates without oscillating; a
   failure without a specific actuator is rerun within the budget.

[E] Example
tick 4a1b2d5ed253  open_breaker the source failed: error rate 100% against an SLO of 50%
      → breaker open for 20 s (opening 1)
tick df512f4b8f19  probe        backoff elapsed; probing the source
      → probe failed (ConnectionError); breaker open for 80 s (opening 3) · escalated to a person

[A] Adjustments
- decide() never touches the database or the clock: everything comes in
  its arguments, so each rule has a test.
- Protection (quarantine) is not limited by the budget; remediation
  (rerun, probe) is.
- An SLI without an actuator, such as the duration of the run, is only
  measured and alerted: say so in the code.

[T] Type of output
The files, the output of pytest, and a real rehearsal with short
guardrails (TCG_BREAKER_BACKOFF=20, --interval 10) for source_down and for
duplicate_prices, with the line of each tick.

[E] Extras
Show the plan before editing. Record this prompt in docs/prompts.md.
Stop at the end.

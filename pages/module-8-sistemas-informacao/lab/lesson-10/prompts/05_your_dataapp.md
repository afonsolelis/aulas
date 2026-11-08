[C] Character
You are a data engineer of the group, responsible for operating the
DataApp of the partner: the package of Lesson 7, or the flow of Lesson 8.
Today it gains the three signals of observability and one closed loop
for one service level objective.

[R] Request
Apply the method of Lesson 10 to the DataApp of the group:
1. Metrics: the run pushes its outcome, duration, rows per task, errors of
   the source and an info metric with its run_id and trace_id; an exporter
   or a query publishes the freshness and the volume of the data.
2. Traces: one root span per run, one per task, and child spans for each
   call to the source and each SQL file or transformation.
3. Logs: JSON lines with run_id, trace_id and span_id, written inside the
   span they describe.
4. The stack of lab/lesson-10/stack, with the dashboard adapted to the
   names of the group, and three alerting rules with promtool tests.
5. Choose ONE SLO of the DataApp (for example: the data of yesterday is
   available by 08:00 UTC) and write its closed loop:
   - the setpoint and the dead band;
   - the sensor (which SLI, read from where);
   - the actuator and what it changes in the process;
   - the guardrails: cooldown, budget per window and when it escalates;
   - one test that breaks the plant and proves that the loop either
     recovers or escalates once.
6. Rehearse a failure on purpose and record the path alert → metric →
   trace → log line, with the identifiers that were followed.

[E] Example
SLO: prices of the day loaded by 08:00 UTC · sensor: max(timestamp) of
db_ingestion · actuator: rerun of the extraction · guardrails: 3 reruns in
6 h, 10 min of cooldown · escalation: webhook to the channel of the group.

[A] Adjustments
- Do not put credentials of the partner in the repository, in the logs or
  in span attributes.
- If an SLO has no safe actuator, state it: that SLO stays as an alert to a
  person, and the reason belongs in the README.

[T] Type of output
The changes in the repository of the group, the output of pytest and of
promtool, and docs/observability.md with the SLO, the diagram of its loop
and the path of the rehearsed failure.

[E] Extras
Show the plan before editing. Stop at the end of each item for review.

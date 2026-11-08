[C] Character
You are the orchestration engineer of our group. The DataApp of the group
was packaged in three layers in Lesson 7; its pipeline still runs by
hand or by a hand-written runner.

[R] Request
1. docs/dag.md: the tasks of our pipeline, the dependency of each one and
   why it exists, drawn as a graph in text; which tasks can run in
   parallel; which tasks write and which only read or download.
2. src/<package>/flows.py: one Prefect task per step over the existing
   functions, and one flow that submits them with their dependencies.
3. For each task, its options with a reason: retries and the pause (only
   for what can fail for an external reason), a retry condition where a
   retry cannot help, a cache policy (NO_CACHE for every write), a timeout
   for calls to the partner API or to ClickHouse.
4. tests/test_flows.py with prefect_test_harness and a fake source: a run
   that completes, a failure that is retried, a failure that stops the
   dependents.
5. A deployment served with a cron that fits the partner data (how often
   does the source change?), and one run triggered and seen in the UI.

[E] Example
raw = fetch_orders.submit(day)            # download, no write
loaded = load_orders.submit(day, raw)     # write, waits for raw

[A] Adjustments
- Keep the three layers: the flow only calls them.
- Credentials of ClickHouse and of the partner API come from environment
  variables and never enter the repository.
- Every date stays Unix time in seconds.

[T] Type of output
The files, the output of one flow run and of pytest, and the cron chosen
with its reason.

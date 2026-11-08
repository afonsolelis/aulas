[C] Character
You are the same engineer. The nine tests of Lesson 7 test the runner;
the flow needs its own tests, still without network.

[R] Request
tests/test_flows.py, reusing the FakeClient of tests/conftest.py:
1. A session fixture with prefect_test_harness(), so the tests use a
   temporary Prefect server and database.
2. A fixture that sets TCG_DB_PATH, TCG_OUT_DIR, TCG_SETS=1,2,
   TCG_PRICE_DATES=2026-08-01,2026-09-01, TCG_FROZEN_MONTH=2026-08,
   TCG_RETRIES=1 and TCG_RETRY_DELAY=0 with monkeypatch, points
   PREFECT_LOCAL_STORAGE_PATH to tmp_path, and replaces
   flows.make_client with the fake.
3. Five tests:
   - the flow completes, the fact has 6 rows = 6 keys, August is frozen,
     report.md exists, and ops.pipeline_runs has every task completed;
   - a second run downloads each archive only once (cache) and keeps the
     grain and the frozen report;
   - a source that fails once is retried by Prefect: extract_sets logged
     with attempt 2, completed;
   - a source that keeps failing fails the flow, logs extract_sets with
     attempt 2, failed, and writes no report;
   - a QualityError runs check_quality once and writes no report.

[E] Example
state = flows.tcg_pipeline(return_state=True)
assert state.is_failed()

[A] Adjustments
- The tests never touch the network, and the nine tests of Lesson 7 keep
  passing.
- The fake is injected by monkeypatch, never by a flag in the code.

[T] Type of output
The file and the output of pytest.

[E] Extras
Show the plan before editing. Stop at the end.

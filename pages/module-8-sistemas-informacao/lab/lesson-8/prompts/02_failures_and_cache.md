[C] Character
You are the same engineer. The flow runs; now it must survive a source
that fails, never retry what cannot improve, and not download again what
never changes.

[R] Request
1. Retries: the tasks that use the network (extract_sets,
   extract_products, fetch_prices_archive, extract_prices_today) take
   retries from TCG_RETRIES and a pause that doubles from TCG_RETRY_DELAY
   (2, 4, 8 s by default), applied in the flow with .with_options().
2. A retry condition on check_quality: a QualityError is never retried;
   any other exception is.
3. Cache: fetch_prices_archive uses cache_policy=INPUTS + TASK_SOURCE and
   persist_result=True, because the archive of a past day never changes.
   Every task that writes to the warehouse uses cache_policy=NO_CACHE.
4. State hooks: on_completion and on_failure write one row per task run
   to ops.pipeline_runs (run_id, task, attempt = run_count, status,
   started_at, ended_at in Unix time, detail), the same table as Lesson 7.
5. Run it three times and show: the first run; a second run in which the
   five downloads end Cached and the fact still has 5,951 rows; a run with
   TCG_BASE_URL=https://tcgcsv.invalid and TCG_RETRIES=2, in which the
   network tasks fail after two retries and every dependent ends NotReady.

[E] Example
@task(name="check_quality", retries=2, retry_condition_fn=not_a_quality_error,
      cache_policy=NO_CACHE, on_completion=[log_state], on_failure=[log_state])

[A] Adjustments
- Caching a write would skip the write: idempotency, not cache, makes a
  write safe to repeat.
- Do not cache extract_prices_today: today's prices change during the day.
- A task that ends NotReady never ran; do not count it as failed in the log.

[T] Type of output
The diff of flows.py, the three runs (states of each task) and the rows
of ops.pipeline_runs of each run.

[E] Extras
Show the plan before editing. Stop at the end.

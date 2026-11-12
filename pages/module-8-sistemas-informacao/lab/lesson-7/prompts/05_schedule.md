[C] Character
You are the same engineer. The package runs end to end with one command;
now it must run every day without anyone at the keyboard.

[R] Request
1. ops/run_daily.sh (bash): go to the root of the project; take a lock
   with flock on out/run.lock and, if another run holds it, write a line
   to out/alerts.log and exit 0; run .venv/bin/tcg-dataapp run --with-today
   appending everything to out/logs/run-<YYYY-MM-DD>.log (UTC); on success
   append the last line of the log to out/runs.log; on failure append a
   line to out/alerts.log and exit with the code of the run.
2. ops/crontab: CRON_TZ=UTC and one line that calls ops/run_daily.sh every
   day at 06:00.
3. A section "Run every day" in README.md with how to install the line of
   crontab and where to look after a run (runs.log, alerts.log, the log of
   the day and tcg-dataapp status).
Facts measured on 12/11/2026 (confirm before use):
- The run with --with-today has 13 tasks, about 40 s; the prices of today
  are the batch of noon UTC, so a second run on the same day keeps 7,786
  prices.
- With the source down, extract_sets fails, is retried and every other
  task is skipped; tcg-dataapp exits with 1.

[E] Example
0 6 * * * /home/student/lesson_07_dataapp/ops/run_daily.sh

[A] Adjustments
- Every line of the logs starts with the Unix time of the moment (UTC).
- The script never hides the exit code of the run: cron and any later
  orchestrator decide by it.
- No new Python code: the retries, the skips and the run log are already
  in pipeline.py.

[T] Type of output
The two files, the output of one run of ops/run_daily.sh, of a second run
on the same day and of a run with TCG_BASE_URL pointing to a closed port.

[E] Extras
Show the plan before editing. Record this prompt in docs/prompts.md.
Stop at the end.

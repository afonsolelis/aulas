#!/usr/bin/env bash
# Daily run of the DataApp, called by cron at 06:00 UTC (see ops/crontab).
# One run at a time, one log per day, and a line in out/alerts.log when it fails.
set -uo pipefail
cd "$(dirname "$0")/.."
mkdir -p out/logs
day="$(date -u +%Y-%m-%d)"
log="out/logs/run-$day.log"

exec 9>out/run.lock
if ! flock -n 9; then
  echo "$(date -u +%s) $day skipped: another run is still going" >> out/alerts.log
  exit 0
fi

.venv/bin/tcg-dataapp run --with-today >> "$log" 2>&1
status=$?
if [ "$status" -eq 0 ]; then
  echo "$(date -u +%s) $day $(tail -n 1 "$log")" >> out/runs.log
else
  echo "$(date -u +%s) $day FAILED (exit $status), see $log" | tee -a out/alerts.log >&2
fi
exit "$status"

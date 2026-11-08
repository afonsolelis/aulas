[C] Character
You are the same engineer. The flow runs and is tested; now it must run
every day without anyone typing a command, and its runs must be visible.

[R] Request
1. flows.py: a function serve(cron="0 6 * * *") that calls
   tcg_pipeline.serve(name="daily", cron=cron,
   parameters={"with_today": True}, tags=["m8-si", "lesson-8"]).
2. cli.py: a subcommand serve [--cron].
3. README.md: how to start the local server and the deployment in two
   terminals, how to trigger a run by hand, and where to see the runs:
     terminal 1: prefect server start
     terminal 2: prefect config set PREFECT_API_URL=http://127.0.0.1:4200/api
                 tcg-dataapp serve
     terminal 3: prefect deployment run 'tcg-dataapp/daily'
     UI:         http://127.0.0.1:4200
4. Run it: start the server, serve the deployment, trigger one run, and
   show the scheduled runs of the next days and the states of the tasks of
   the run you triggered.

Facts measured on 08/11/2026 (confirm before use):
- the triggered run of the deployment, with today's prices: 18 task runs,
  the five downloads Cached, 7,782 prices in 6 captures, 697 cells.
- the cron has no timezone, so 06:00 is UTC (03:00 in Sao Paulo).

[E] Example
prefect deployment inspect 'tcg-dataapp/daily'

[A] Adjustments
- serve() keeps the process alive: it is the worker of the deployment;
  stop it with Ctrl+C.
- Do not create an account on Prefect Cloud; the local server is enough.
- The README replaces the crontab line of Lesson 7.

[T] Type of output
The files, the output of the three terminals and a description of what
the UI shows on the page of the run (graph, states, logs).

[E] Extras
Show the plan before editing. Stop at the end.

"""Command line of the DataApp: tcg-dataapp run | status | report | metrics | control."""
from __future__ import annotations

import argparse
import time

import duckdb

from tcg_dataapp import __version__, observability, pipeline, telemetry
from tcg_dataapp.config import Settings
from tcg_dataapp.etls.landing import counts
from tcg_dataapp.views.report import write_report


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="tcg-dataapp", description="TCGplayer prices, from extraction to the gold layer.")
    parser.add_argument("--version", action="version", version=f"%(prog)s {__version__}")
    sub = parser.add_subparsers(dest="command", required=True)
    run_p = sub.add_parser("run", help="run the whole pipeline: extract, load, gold, checks, reports")
    run_p.add_argument("--with-today", action="store_true", help="also capture the prices of today from the live API")
    run_p.add_argument("--push", metavar="URL", help="push the metrics of the run to this Pushgateway (or TCG_PUSHGATEWAY)")
    sub.add_parser("status", help="rows of db_ingestion and the last run of the pipeline")
    sub.add_parser("report", help="write out/report.md again from the current gold layer")
    met_p = sub.add_parser("metrics", help="exporter: serve /metrics with the state of the warehouse")
    met_p.add_argument("--port", type=int, help="port of the HTTP endpoint (default TCG_METRICS_PORT or 9108)")
    met_p.add_argument("--once", action="store_true", help="print one scrape to the terminal and exit")
    ctl_p = sub.add_parser("control", help="closed loop: read the SLIs, compare with the SLOs and act")
    ctl_p.add_argument("--interval", type=float, default=300, help="seconds between ticks (default 300)")
    ctl_p.add_argument("--ticks", type=int, help="stop after this many ticks (default: run until Ctrl+C)")
    ctl_p.add_argument("--once", action="store_true", help="one tick and exit, for cron")
    ctl_p.add_argument("--acknowledge", action="store_true",
                       help="a person took over: clear the escalation and close the breaker, then exit")
    args = parser.parse_args(argv)
    settings = Settings()
    observability.setup(settings.out_dir / "logs" / "tcg-dataapp.jsonl", settings.otlp_endpoint, settings.instance)
    try:
        return _dispatch(args, settings)
    finally:
        observability.flush()


def _dispatch(args, settings: Settings) -> int:

    if args.command == "run":
        print(f"tcg-dataapp {__version__} · {settings.db_path} · sets {len(settings.sets)} · dates {', '.join(settings.price_dates)}")
        ctx = pipeline.run(settings, with_today=args.with_today)
        failed = ctx.results["_failed"]
        print(f"run {ctx.run_id}: " + ("OK" if not failed else f"FAILED ({', '.join(failed)})") + f" · trace {ctx.trace_id}")
        print(f"metrics written to {ctx.metrics.write(settings.out_dir / 'metrics.prom')}")
        gateway = args.push or settings.pushgateway
        if gateway:
            try:
                ctx.metrics.push(gateway, settings.instance)
                print(f"metrics pushed to {gateway} (job={telemetry.JOB}, instance={settings.instance})")
            except OSError as error:
                # The data is right even if monitoring is down; the alert on a missing run will tell.
                print(f"warning: could not push the metrics to {gateway}: {error}")
        return 1 if failed else 0

    if args.command == "metrics":
        if args.once:
            from prometheus_client import generate_latest
            print(generate_latest(telemetry.exporter_registry(settings.db_path)).decode(), end="")
            return 0
        port = args.port or settings.metrics_port
        telemetry.serve(settings.db_path, port)
        print(f"exporter of {settings.db_path} on http://0.0.0.0:{port}/metrics (Ctrl+C to stop)")
        try:
            while True:
                time.sleep(3600)
        except KeyboardInterrupt:
            return 0

    if args.command == "control":
        from tcg_dataapp import control
        if args.acknowledge:
            con = duckdb.connect(str(settings.db_path))
            try:
                for statement in con.extract_statements(pipeline.LOG_DDL + control.STATE_DDL):
                    con.execute(statement).fetchall()
                state = control.State.load(con)
                print(f"escalation cleared: {state.escalated or '(none)'}; breaker was {state.breaker}")
                control.State(stale=state.stale, handled_run=state.handled_run).save(con, time.time())
            finally:
                con.close()
            return 0
        controller = control.Controller(settings)
        print(f"controller · SLO freshness {settings.slo_freshness_s} s (ok below {settings.slo_freshness_ok_s} s) · "
              f"max {settings.control_max_actions} reruns per {settings.control_window_s} s · cooldown {settings.control_cooldown_s} s")
        try:
            controller.loop(args.interval, 1 if args.once else args.ticks)
        except KeyboardInterrupt:
            pass
        return 0

    con = duckdb.connect(str(settings.db_path), read_only=args.command == "status")
    try:
        if args.command == "status":
            for tag, rows, first, last in counts(con):
                print(f"{tag:22} {rows:7,d} rows  {first} .. {last}")
            last_run = con.execute(
                "SELECT run_id, count(*) FILTER (WHERE status = 'success'), count(*) FILTER (WHERE status <> 'success'), "
                "min(started_at), max(ended_at) FROM ops.pipeline_runs "
                "WHERE run_id = (SELECT run_id FROM ops.pipeline_runs ORDER BY started_at DESC, rowid DESC LIMIT 1) GROUP BY run_id"
            ).fetchone()
            if last_run:
                print(f"last run {last_run[0]}: {last_run[1]} task attempts ok, {last_run[2]} not ok, {last_run[3]} .. {last_run[4]}")
        else:
            print(write_report(con, settings.out_dir))
    finally:
        con.close()
    return 0

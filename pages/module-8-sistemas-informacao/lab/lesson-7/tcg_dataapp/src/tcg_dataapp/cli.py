"""Command line of the DataApp: tcg-dataapp run | status | report."""
from __future__ import annotations

import argparse

import duckdb

from tcg_dataapp import __version__, pipeline
from tcg_dataapp.config import Settings
from tcg_dataapp.etls.landing import counts
from tcg_dataapp.views.report import write_report


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="tcg-dataapp", description="TCGplayer prices, from extraction to the gold layer.")
    parser.add_argument("--version", action="version", version=f"%(prog)s {__version__}")
    sub = parser.add_subparsers(dest="command", required=True)
    run_p = sub.add_parser("run", help="run the whole pipeline: extract, load, gold, checks, reports")
    run_p.add_argument("--with-today", action="store_true", help="also capture the prices of today from the live API")
    sub.add_parser("status", help="rows of db_ingestion and the last run of the pipeline")
    sub.add_parser("report", help="write out/report.md again from the current gold layer")
    args = parser.parse_args(argv)
    settings = Settings()

    if args.command == "run":
        print(f"tcg-dataapp {__version__} · {settings.db_path} · sets {len(settings.sets)} · dates {', '.join(settings.price_dates)}")
        ctx = pipeline.run(settings, with_today=args.with_today)
        failed = ctx.results["_failed"]
        print(f"run {ctx.run_id}: " + ("OK" if not failed else f"FAILED ({', '.join(failed)})"))
        return 1 if failed else 0

    con = duckdb.connect(str(settings.db_path), read_only=args.command == "status")
    try:
        if args.command == "status":
            for tag, rows, first, last in counts(con):
                print(f"{tag:22} {rows:7,d} rows  {first} .. {last}")
            last_run = con.execute(
                "SELECT run_id, count(*) FILTER (WHERE status = 'success'), count(*) FILTER (WHERE status <> 'success'), "
                "min(started_at), max(ended_at) FROM ops.pipeline_runs "
                "WHERE run_id = (SELECT run_id FROM ops.pipeline_runs ORDER BY started_at DESC LIMIT 1) GROUP BY run_id"
            ).fetchone()
            if last_run:
                print(f"last run {last_run[0]}: {last_run[1]} task attempts ok, {last_run[2]} not ok, {last_run[3]} .. {last_run[4]}")
        else:
            print(write_report(con, settings.out_dir))
    finally:
        con.close()
    return 0

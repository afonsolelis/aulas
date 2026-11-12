"""Load test of the processing of the DataApp: how far does the SLO of duration hold?

The run of tcg-dataapp spends most of its time on the network, which a load
test cannot grow. What grows with the data is the processing: the gold layer,
the quality gate, the frozen reports, the marts and the report. This script
builds a synthetic landing table of increasing size (products x weekly
captures, up to 250 captures and then more products), runs the same functions that the pipeline runs, each one inside a
span, and reads the duration of every span from an in-memory exporter of
OpenTelemetry. One subprocess per size, so that the peak memory of each size
is its own.

    python tools/load_test.py                       # 100k to 5M prices
    python tools/load_test.py --sizes 100000 500000 --json out/load.json

The SLO of the run duration is 120 s (TCG_SLO_RUN_DURATION); the network part
of a real run takes about 30 s, so the processing has about 90 s of budget.
"""
from __future__ import annotations

import argparse
import json
import resource
import subprocess
import sys
import tempfile
import time
from pathlib import Path

MIN_PRODUCTS, MAX_CAPTURES = 2_000, 250   # at most about five years of weekly captures
START = 1767268800  # 2026-01-01 12:00 UTC, a Thursday; the captures are weekly
DEFAULT_SIZES = [100_000, 500_000, 1_000_000, 2_500_000, 5_000_000]


def synthetic_landing(con, products: int, captures: int) -> None:
    from tcg_dataapp.etls.landing import ensure_table

    ensure_table(con)
    con.execute("""INSERT INTO db_ingestion VALUES (?, '{"groupId":1,"name":"Synthetic","abbreviation":"SYN",
                   "publishedOn":"2025-12-01T00:00:00"}', 'tcgplayer.set.v1')""", [START]).fetchall()
    con.execute(f"""INSERT INTO db_ingestion
        SELECT {START}, json_object('productId', p, 'groupId', 1, 'name', 'Card ' || p,
               'extendedData', json_array(json_object('name', 'Number', 'value', p || '/{products}'),
                                          json_object('name', 'Rarity', 'value', ['Common', 'Uncommon', 'Rare'][p % 3 + 1]))),
               'tcgplayer.product.v1'
        FROM range({products}) t(p)""").fetchall()
    con.execute(f"""INSERT INTO db_ingestion
        SELECT {START} + d * 7 * 86400,
               json_object('productId', p, 'marketPrice', round(1 + (p % 97) * (1 + d / 100), 2), 'subTypeName', 'Normal'),
               'tcgplayer.price.v1'
        FROM range({products}) t(p), range({captures}) u(d)""").fetchall()


def one_size(prices: int) -> dict:
    """Runs in its own process: the processing of one size, with every span measured."""
    import duckdb
    from opentelemetry import trace
    from opentelemetry.sdk.trace import TracerProvider
    from opentelemetry.sdk.trace.export import SimpleSpanProcessor
    from opentelemetry.sdk.trace.export.in_memory_span_exporter import InMemorySpanExporter

    exporter = InMemorySpanExporter()
    provider = TracerProvider()
    provider.add_span_processor(SimpleSpanProcessor(exporter))
    trace.set_tracer_provider(provider)

    from tcg_dataapp.observability import tracer
    from tcg_dataapp.processors import gold, quality
    from tcg_dataapp.views import report

    captures = min(MAX_CAPTURES, max(1, prices // MIN_PRODUCTS))
    products = prices // captures
    folder = Path(tempfile.mkdtemp(prefix="tcg-load-"))
    con = duckdb.connect(str(folder / "load.duckdb"))
    t0 = time.perf_counter()
    synthetic_landing(con, products, captures)
    setup_s = time.perf_counter() - t0
    frozen = time.strftime("%Y-%m", time.gmtime(START + (captures // 2) * 7 * 86400))
    t0 = time.perf_counter()
    with tracer().start_as_current_span("load.processing") as root:
        root.set_attribute("tcg.load.prices", products * captures)
        with tracer().start_as_current_span("task build_gold"):
            gold.build_gold(con)
        with tracer().start_as_current_span("task check_quality"):
            measured = quality.check_gold(con)
        with tracer().start_as_current_span("task freeze_reports"):
            gold.freeze_month(con, frozen)
        with tracer().start_as_current_span("task export_marts"):
            report.export_marts(con, folder / "out")
        with tracer().start_as_current_span("task write_report"):
            report.write_report(con, folder / "out")
    total_s = time.perf_counter() - t0
    con.close()
    db_mb = (folder / "load.duckdb").stat().st_size / 1e6
    spans = {s.name: round((s.end_time - s.start_time) / 1e9, 3) for s in exporter.get_finished_spans()}
    return {"prices": products * captures, "products": products, "captures": captures,
            "fact_rows": measured["fact_rows"], "cube_cells": measured["cube_cells"],
            "setup_s": round(setup_s, 2), "processing_s": round(total_s, 2),
            "prices_per_s": round(products * captures / total_s), "db_mb": round(db_mb, 1),
            "peak_rss_mb": round(resource.getrusage(resource.RUSAGE_SELF).ru_maxrss / 1024, 1), "spans": spans}


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    parser.add_argument("--sizes", type=int, nargs="+", default=DEFAULT_SIZES, help="numbers of prices")
    parser.add_argument("--budget", type=float, default=90.0, help="seconds of processing within the SLO (default 90)")
    parser.add_argument("--json", type=Path, help="also write the results to this file")
    parser.add_argument("--one", type=int, help=argparse.SUPPRESS)
    args = parser.parse_args()
    if args.one:
        print(json.dumps(one_size(args.one)))
        return 0
    rows = []
    print(f"{'prices':>10}  {'captures':>8}  {'processing':>10}  {'prices/s':>9}  {'peak RSS':>9}  {'file':>8}  slowest span")
    for size in args.sizes:
        out = subprocess.run([sys.executable, __file__, "--one", str(size)], capture_output=True, text=True, check=True)
        r = json.loads(out.stdout.strip().splitlines()[-1])
        rows.append(r)
        slow = max((k for k in r["spans"] if k.startswith(("sql ", "task "))), key=lambda k: r["spans"][k])
        print(f"{r['prices']:>10,}  {r['captures']:>8}  {r['processing_s']:>9.2f}s  {r['prices_per_s']:>9,}  "
              f"{r['peak_rss_mb']:>7.0f}MB  {r['db_mb']:>6.0f}MB  {slow} {r['spans'][slow]:.2f}s")
    last = rows[-1]
    per_price = last["processing_s"] / last["prices"]
    print(f"at {last['prices_per_s']:,} prices/s the budget of {args.budget:g} s holds up to about "
          f"{int(args.budget / per_price):,} prices, if the time stays linear")
    if args.json:
        args.json.parent.mkdir(parents=True, exist_ok=True)
        args.json.write_text(json.dumps({"budget_s": args.budget, "results": rows}, indent=2), encoding="utf-8")
    return 0


if __name__ == "__main__":
    sys.exit(main())

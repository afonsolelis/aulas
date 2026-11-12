"""Builds lab-data.js, the data of the simulated editor of the Lesson 7 lab (index.html).

The simulation shows real code and real data: the files of tcg_dataapp/, the
prompts of prompts/, answers of tcgcsv.com and samples of a DuckDB file built
by the package itself. Run it from this folder with the virtual environment of
the reference package, after `pip install -e 'tcg_dataapp[dev]'`:

    python build_lab_data.py            # captures again (about 40 s, needs network)

It writes lab-data.js next to index.html. The terminal transcripts of the page
are written in index.html and were recorded on 12/11/2026.
"""
from __future__ import annotations

import json
import shutil
import tempfile
import urllib.request
from pathlib import Path

import duckdb

from tcg_dataapp.config import Settings
from tcg_dataapp.etls import extract
from tcg_dataapp.etls.tcgcsv import USER_AGENT, TcgcsvClient
from tcg_dataapp.processors import gold
from tcg_dataapp.views import report

HERE = Path(__file__).resolve().parent
PKG = HERE / "tcg_dataapp"
PIKACHU = 676088  # Pikachu ex - 276/217, Ascended Heroes
SHOWN_FILES = [
    "pyproject.toml", "README.md", "src/tcg_dataapp/__init__.py", "src/tcg_dataapp/__main__.py",
    "src/tcg_dataapp/config.py", "src/tcg_dataapp/cli.py", "src/tcg_dataapp/pipeline.py",
    "src/tcg_dataapp/etls/__init__.py", "src/tcg_dataapp/etls/tcgcsv.py", "src/tcg_dataapp/etls/landing.py",
    "src/tcg_dataapp/etls/extract.py", "src/tcg_dataapp/processors/__init__.py",
    "src/tcg_dataapp/processors/gold.py", "src/tcg_dataapp/processors/quality.py",
    "src/tcg_dataapp/processors/sql/01_dimensions.sql", "src/tcg_dataapp/processors/sql/02_fact.sql",
    "src/tcg_dataapp/processors/sql/03_cube_and_mart.sql", "src/tcg_dataapp/processors/sql/04_live_reports.sql",
    "src/tcg_dataapp/views/__init__.py", "src/tcg_dataapp/views/questions.py", "src/tcg_dataapp/views/report.py",
    "tests/conftest.py", "tests/test_cli.py", "tests/test_landing.py", "tests/test_pipeline.py",
    "ops/run_daily.sh", "ops/crontab",
]
GOLD_OBJECTS = [
    "gold.dim_set", "gold.dim_product", "gold.dim_variant", "gold.dim_date", "gold.fact_price",
    "gold.agg_price_cube", "mart_collectors.card_price", "mart_collectors.set_value",
    "report.mv_card_price_2026_09", "report.mv_set_value_2026_09", "report.v_card_price_latest",
]


def get_json(url: str):
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=60) as response:
        body = response.read()
    return json.loads(body), len(body)


def plain(value):
    if isinstance(value, float):
        return round(value, 2)
    if isinstance(value, (int, str)) or value is None:
        return value
    return str(value)


def table(con, sql: str, params=None, limit: int = 8):
    cur = con.execute(sql, params or [])
    cols = [d[0] for d in cur.description]
    rows = [[plain(v) for v in r] for r in cur.fetchmany(limit)]
    cur.fetchall()
    return {"cols": cols, "rows": rows}


def main() -> None:
    s = Settings()
    data: dict = {"files": {p: (PKG / p).read_text(encoding="utf-8") for p in SHOWN_FILES}}
    data["prompts"] = {p.stem: p.read_text(encoding="utf-8") for p in sorted((HERE / "prompts").glob("*.md"))}

    # Answers of the API, as they arrive (before the ETL trims them).
    base = f"{s.base_url}/tcgplayer/{s.category}"
    groups, groups_size = get_json(f"{base}/groups")
    products, products_size = get_json(f"{base}/24541/products")
    prices, prices_size = get_json(f"{base}/24541/prices")
    raw_pikachu = next(p for p in products["results"] if p["productId"] == PIKACHU)
    data["api"] = {
        "groups": {"url": f"{base}/groups", "bytes": groups_size, "totalItems": groups["totalItems"],
                   "sample": {**{k: groups[k] for k in ("totalItems", "success", "errors")},
                              "results": [g for g in groups["results"] if g["groupId"] in s.sets]}},
        "products": {"url": f"{base}/24541/products", "bytes": products_size, "count": len(products["results"]),
                     "sample": raw_pikachu},
        "prices": {"url": f"{base}/24541/prices", "bytes": prices_size, "count": len(prices["results"]),
                   "sample": [p for p in prices["results"] if p["productId"] == PIKACHU] + prices["results"][:2]},
    }

    # A fresh warehouse, built by the functions of the package, step by step.
    folder = Path(tempfile.mkdtemp())
    con = duckdb.connect(str(folder / "tcg.duckdb"))
    client = TcgcsvClient(s.base_url, s.category)
    captured = extract.now_unix()
    loads = [["extract_sets", "tcgplayer.set.v1", captured, extract.extract_sets(con, client, s.sets, captured)],
             ["extract_products", "tcgplayer.product.v1", captured,
              extract.extract_products(con, client, s.sets, captured)]]
    for day in s.price_dates:
        loads.append([f"extract_prices_archive {day}", "tcgplayer.price.v1", extract.unix(day),
                      extract.extract_prices_archive(con, client, s.sets, day)])
    data["loads"] = loads
    data["products_by_set"] = con.execute(
        "SELECT (p.data_json->>'groupId')::INT, any_value(s.data_json->>'name'), count(*) FROM db_ingestion p "
        "JOIN db_ingestion s ON s.data_tag = 'tcgplayer.set.v1' AND s.data_json->>'groupId' = p.data_json->>'groupId' "
        "WHERE p.data_tag = 'tcgplayer.product.v1' GROUP BY 1 ORDER BY 1").fetchall()
    data["archives"] = []
    for day in s.price_dates:
        req = urllib.request.Request(f"{s.base_url}/archive/tcgplayer/prices-{day}.ppmd.7z", method="HEAD",
                                     headers={"User-Agent": USER_AGENT})
        with urllib.request.urlopen(req, timeout=60) as r:
            data["archives"].append([day, int(r.headers.get("content-length", 0))])

    data["ingestion"] = {
        "batches": table(con, "SELECT data_tag, timestamp, count(*) AS rows FROM db_ingestion GROUP BY ALL ORDER BY 1, 2",
                         limit=50),
        "rows": {
            tag: table(con, "SELECT timestamp, data_tag, data_json FROM db_ingestion WHERE data_tag = ? "
                            "ORDER BY timestamp DESC, data_json->>'productId', data_json->>'groupId' LIMIT 6", [tag])
            for tag in ("tcgplayer.set.v1", "tcgplayer.product.v1", "tcgplayer.price.v1")
        },
        "pikachu": table(con, "SELECT timestamp, data_tag, data_json FROM db_ingestion "
                              "WHERE data_json->>'productId' = ? ORDER BY data_tag DESC, timestamp", [str(PIKACHU)],
                         limit=20),
    }

    gold.build_gold(con)
    data["freeze"] = gold.freeze_month(con, s.frozen_month)
    data["gold"] = {}
    for name in GOLD_OBJECTS:
        sample = table(con, f"SELECT * FROM {name}", limit=8)
        sample["count"] = con.execute(f"SELECT count(*) FROM {name}").fetchone()[0]
        data["gold"][name] = sample
    data["lineage"] = {
        "dim_product": table(con, "SELECT * FROM gold.dim_product WHERE product_id = ?", [PIKACHU]),
        "fact_price": table(con, "SELECT * FROM gold.fact_price WHERE product_id = ? ORDER BY date_unix", [PIKACHU]),
        "mv_card_price_2026_09": table(con, "SELECT * FROM report.mv_card_price_2026_09 "
                                            "WHERE card = 'Pikachu ex - 276/217'"),
        "v_card_price_latest": table(con, "SELECT * FROM report.v_card_price_latest WHERE card = 'Pikachu ex - 276/217'"),
    }
    data["report_md"] = report.write_report(con, folder / "out", "3f166bc9cd58").read_text(encoding="utf-8")
    con.close()
    shutil.rmtree(folder)

    js = "// Generated by build_lab_data.py; do not edit by hand.\nwindow.LAB_DATA = " + \
         json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";\n"
    (HERE / "lab-data.js").write_text(js, encoding="utf-8")
    print(f"lab-data.js: {len(js) / 1024:.0f} KB")


if __name__ == "__main__":
    main()

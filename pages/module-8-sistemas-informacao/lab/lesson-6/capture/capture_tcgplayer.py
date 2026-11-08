"""Capture the classroom dataset of Lesson 6 from TCGplayer (professor only).

The students do not run this script: the lab page loads the file it writes,
data/db_ingestion.json. It takes the Pokemon TCG sets released in 2026, their
products and the prices of those products on five dates, and writes them as
one landing table with three columns, the same shape as db_ingestion in
Lesson 4 and silver.enriched in Lesson 5:

    timestamp  when the record was captured, in Unix time (seconds, UTC)
    data_json  the record, with the field names of TCGplayer
    data_tag   tcgplayer.set.v1, tcgplayer.product.v1 or tcgplayer.price.v1

Source: tcgcsv.com, a public daily mirror of the catalogue and the prices of
TCGplayer (category 3 is Pokemon). The catalogue comes from the live API and
the prices of each date from the daily archive of tcgcsv. Two fields are
removed from the products to keep the file inside the 5 MB of localStorage:
the long text of the card (CardText and the attacks) and the image URL.

    pip install py7zr
    python capture_tcgplayer.py           # writes ../data/db_ingestion.json
"""
import datetime
import io
import json
import tempfile
import time
import urllib.request
from pathlib import Path

import py7zr

BASE = "https://tcgcsv.com"
CATEGORY = 3  # Pokemon
SETS = [24541, 24587, 24655, 24688, 24722, 24837, 24831]  # released in 2026
PRICE_DATES = ["2026-03-01", "2026-05-01", "2026-07-01", "2026-09-01", "2026-11-07"]
CATALOGUE_AT = "2026-11-07T20:05:27"  # last update of tcgcsv when captured (UTC)
KEEP_EXTENDED = {"Number", "Rarity", "Card Type", "CardType", "HP", "Stage"}
OUT = Path(__file__).resolve().parent.parent / "data" / "db_ingestion.json"


def unix(iso):
    """Unix time, in seconds, of an ISO date and time read as UTC."""
    return int(datetime.datetime.fromisoformat(iso).replace(tzinfo=datetime.timezone.utc).timestamp())


def get_json(url):
    request = urllib.request.Request(url, headers={"User-Agent": "inteli-m8-lesson6-capture"})
    with urllib.request.urlopen(request, timeout=60) as response:
        return json.load(response)


def get_bytes(url):
    request = urllib.request.Request(url, headers={"User-Agent": "inteli-m8-lesson6-capture"})
    with urllib.request.urlopen(request, timeout=120) as response:
        return response.read()


def main():
    rows = []

    groups = {g["groupId"]: g for g in get_json(f"{BASE}/tcgplayer/{CATEGORY}/groups")["results"]}
    for group_id in SETS:
        rows.append({"timestamp": unix(CATALOGUE_AT), "data_tag": "tcgplayer.set.v1", "data_json": groups[group_id]})

    for group_id in SETS:
        for product in get_json(f"{BASE}/tcgplayer/{CATEGORY}/{group_id}/products")["results"]:
            product = dict(product)
            product.pop("imageUrl", None)
            product["extendedData"] = [e for e in product.get("extendedData", []) if e["name"] in KEEP_EXTENDED]
            rows.append({"timestamp": unix(CATALOGUE_AT), "data_tag": "tcgplayer.product.v1", "data_json": product})
        time.sleep(0.2)

    for day in PRICE_DATES:
        archive = get_bytes(f"{BASE}/archive/tcgplayer/prices-{day}.ppmd.7z")
        wanted = {f"{day}/{CATEGORY}/{g}/prices" for g in SETS}
        with tempfile.TemporaryDirectory() as folder:
            with py7zr.SevenZipFile(io.BytesIO(archive)) as z:
                present = sorted(n for n in z.getnames() if n in wanted)
                if present:
                    z.extract(path=folder, targets=present)
            for name in present:
                for price in json.loads(Path(folder, name).read_text(encoding="utf-8"))["results"]:
                    rows.append({"timestamp": unix(f"{day}T12:00:00"), "data_tag": "tcgplayer.price.v1", "data_json": price})
        print(day, "sets with prices:", len(present))

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(rows, separators=(",", ":"), ensure_ascii=False), encoding="utf-8")
    counts = {}
    for row in rows:
        counts[row["data_tag"]] = counts.get(row["data_tag"], 0) + 1
    print(counts, f"{OUT.stat().st_size / 1024:.0f} KB")


if __name__ == "__main__":
    main()

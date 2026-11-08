"""Writes the report of the five questions in Markdown and the marts in Parquet."""
from __future__ import annotations

from pathlib import Path

import duckdb

from tcg_dataapp.views.questions import QUESTIONS, answer_all

MARTS = {
    "card_price": "SELECT * FROM mart_collectors.card_price",
    "set_value": "SELECT * FROM mart_collectors.set_value",
    "card_price_latest": "SELECT * FROM report.v_card_price_latest",
}


def _table(columns: list[str], rows: list[tuple]) -> str:
    def cell(v):
        return "" if v is None else str(v).replace("|", "\\|")
    lines = ["| " + " | ".join(columns) + " |", "|" + "---|" * len(columns)]
    lines += ["| " + " | ".join(cell(v) for v in row) + " |" for row in rows]
    return "\n".join(lines)


def write_report(con: duckdb.DuckDBPyConnection, out_dir: Path, run_id: str | None = None) -> Path:
    out_dir.mkdir(parents=True, exist_ok=True)
    last = con.execute("SELECT max(date_unix) FROM gold.dim_date").fetchall()[0][0]
    parts = [f"# TCG DataApp · report\n\nLast capture: `{last}` (Unix time, UTC)" + (f" · run `{run_id}`" if run_id else "") + "\n"]
    for key, (columns, rows) in answer_all(con).items():
        parts.append(f"## {key}\n\n{QUESTIONS[key][0]}.\n\n{_table(columns, rows)}\n")
    path = out_dir / "report.md"
    path.write_text("\n".join(parts), encoding="utf-8")
    return path


def export_marts(con: duckdb.DuckDBPyConnection, out_dir: Path) -> list[Path]:
    folder = out_dir / "marts"
    folder.mkdir(parents=True, exist_ok=True)
    written = []
    for name, query in MARTS.items():
        path = folder / f"{name}.parquet"
        con.execute(f"COPY ({query}) TO '{path.as_posix()}' (FORMAT parquet)").fetchall()
        written.append(path)
    return written

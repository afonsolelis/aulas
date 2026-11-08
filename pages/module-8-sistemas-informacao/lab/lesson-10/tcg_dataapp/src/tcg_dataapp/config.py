"""Settings of the DataApp, read from environment variables with defaults.

Every date is Unix time in seconds (UTC), as in Lesson 6.
"""
from __future__ import annotations

import os
from dataclasses import dataclass, field
from pathlib import Path

# Pokemon TCG sets released in 2026 (groupId on TCGplayer).
DEFAULT_SETS = (24541, 24587, 24655, 24688, 24722, 24837, 24831)
# Daily archives of tcgcsv used as capture dates, as in Lesson 6.
DEFAULT_PRICE_DATES = ("2026-03-01", "2026-05-01", "2026-07-01", "2026-09-01", "2026-11-07")


def _list(name: str, default: tuple) -> tuple:
    raw = os.environ.get(name)
    return tuple(x.strip() for x in raw.split(",") if x.strip()) if raw else default


@dataclass(frozen=True)
class Settings:
    db_path: Path = field(default_factory=lambda: Path(os.environ.get("TCG_DB_PATH", "warehouse/tcg.duckdb")))
    out_dir: Path = field(default_factory=lambda: Path(os.environ.get("TCG_OUT_DIR", "out")))
    base_url: str = field(default_factory=lambda: os.environ.get("TCG_BASE_URL", "https://tcgcsv.com"))
    category: int = field(default_factory=lambda: int(os.environ.get("TCG_CATEGORY", "3")))
    sets: tuple = field(default_factory=lambda: tuple(int(x) for x in _list("TCG_SETS", DEFAULT_SETS)))
    price_dates: tuple = field(default_factory=lambda: _list("TCG_PRICE_DATES", DEFAULT_PRICE_DATES))
    frozen_month: str = field(default_factory=lambda: os.environ.get("TCG_FROZEN_MONTH", "2026-09"))
    retries: int = field(default_factory=lambda: int(os.environ.get("TCG_RETRIES", "3")))
    retry_delay: float = field(default_factory=lambda: float(os.environ.get("TCG_RETRY_DELAY", "2")))
    # Lesson 10: where the batch run pushes its metrics (empty: no push) and the port of the exporter.
    pushgateway: str = field(default_factory=lambda: os.environ.get("TCG_PUSHGATEWAY", ""))
    instance: str = field(default_factory=lambda: os.environ.get("TCG_INSTANCE", "local"))
    metrics_port: int = field(default_factory=lambda: int(os.environ.get("TCG_METRICS_PORT", "9108")))

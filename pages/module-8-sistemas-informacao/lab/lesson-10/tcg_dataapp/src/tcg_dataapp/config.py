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
    # Lesson 10: traces and logs. The OTLP endpoint is the collector (empty: JSON logs to a file only).
    otlp_endpoint: str = field(default_factory=lambda: os.environ.get("TCG_OTLP_ENDPOINT", ""))
    # Fault injected into the client of the source, to rehearse failures: "" (none),
    # "source_down" (every request raises) or "duplicate_prices" (the prices of today arrive twice).
    fault: str = field(default_factory=lambda: os.environ.get("TCG_FAULT", ""))
    # Lesson 10: setpoints of the closed loop (control.py). Times in seconds.
    slo_freshness_s: int = field(default_factory=lambda: int(os.environ.get("TCG_SLO_FRESHNESS", str(36 * 3600))))
    slo_freshness_ok_s: int = field(default_factory=lambda: int(os.environ.get("TCG_SLO_FRESHNESS_OK", str(30 * 3600))))
    slo_run_duration_s: float = field(default_factory=lambda: float(os.environ.get("TCG_SLO_RUN_DURATION", "120")))
    slo_source_error_rate: float = field(default_factory=lambda: float(os.environ.get("TCG_SLO_SOURCE_ERRORS", "0.5")))
    # Guardrails of the controller.
    control_max_actions: int = field(default_factory=lambda: int(os.environ.get("TCG_CONTROL_MAX_ACTIONS", "3")))
    control_window_s: int = field(default_factory=lambda: int(os.environ.get("TCG_CONTROL_WINDOW", str(6 * 3600))))
    control_cooldown_s: int = field(default_factory=lambda: int(os.environ.get("TCG_CONTROL_COOLDOWN", "600")))
    breaker_backoff_s: int = field(default_factory=lambda: int(os.environ.get("TCG_BREAKER_BACKOFF", "300")))
    breaker_max_opens: int = field(default_factory=lambda: int(os.environ.get("TCG_BREAKER_MAX_OPENS", "4")))
    escalation_webhook: str = field(default_factory=lambda: os.environ.get("TCG_ESCALATION_WEBHOOK", ""))

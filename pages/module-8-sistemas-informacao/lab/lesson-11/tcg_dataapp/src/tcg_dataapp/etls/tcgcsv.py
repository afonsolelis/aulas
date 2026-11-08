"""Client of tcgcsv.com, the public daily mirror of the TCGplayer catalogue and prices.

Only the standard library and py7zr: the daily price archives are 7z files.
"""
from __future__ import annotations

import io
import json
import tempfile
import time
import urllib.request
from pathlib import Path

import py7zr

USER_AGENT = "tcg-dataapp/0.1 (Inteli, Module 8)"


class TcgcsvClient:
    def __init__(self, base_url: str, category: int, timeout: float = 60, pause: float = 0.2):
        self.base_url = base_url.rstrip("/")
        self.category = category
        self.timeout = timeout
        self.pause = pause

    def _get(self, path: str) -> bytes:
        request = urllib.request.Request(f"{self.base_url}{path}", headers={"User-Agent": USER_AGENT})
        with urllib.request.urlopen(request, timeout=self.timeout) as response:
            body = response.read()
        time.sleep(self.pause)
        return body

    def _results(self, path: str) -> list[dict]:
        payload = json.loads(self._get(path))
        if not payload.get("success", True):
            raise RuntimeError(f"tcgcsv returned an error for {path}: {payload.get('errors')}")
        return payload["results"]

    def groups(self) -> list[dict]:
        return self._results(f"/tcgplayer/{self.category}/groups")

    def products(self, group_id: int) -> list[dict]:
        return self._results(f"/tcgplayer/{self.category}/{group_id}/products")

    def prices_today(self, group_id: int) -> list[dict]:
        return self._results(f"/tcgplayer/{self.category}/{group_id}/prices")

    def prices_archive(self, day: str, group_ids: list[int]) -> dict[int, list[dict]]:
        """Prices of the given sets on one past day, from the daily archive (YYYY-MM-DD)."""
        archive = self._get(f"/archive/tcgplayer/prices-{day}.ppmd.7z")
        wanted = {f"{day}/{self.category}/{g}/prices": g for g in group_ids}
        found: dict[int, list[dict]] = {}
        with tempfile.TemporaryDirectory() as folder:
            with py7zr.SevenZipFile(io.BytesIO(archive)) as z:
                present = sorted(n for n in z.getnames() if n in wanted)
                if present:
                    z.extract(path=folder, targets=present)
            for name in present:
                found[wanted[name]] = json.loads(Path(folder, name).read_text(encoding="utf-8"))["results"]
        return found

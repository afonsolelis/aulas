"""Print the utility tree of the ATAM with the result of each scenario.

    pytest                         # writes out/traceability.json
    python tools/traceability.py   # the tree, from docs/scenarios.toml and that file
    python tools/traceability.py --full
    python tools/traceability.py --markdown > docs/traceability.md

Without out/traceability.json the tree is printed without results, which is
the utility tree of step 02, before any test exists.
"""
from __future__ import annotations

import argparse
import json
import tomllib
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ORDER = {"H": 0, "M": 1, "L": 2}


def load():
    scenarios = tomllib.loads((ROOT / "docs" / "scenarios.toml").read_text(encoding="utf-8"))["scenario"]
    results_path = ROOT / "out" / "traceability.json"
    results = {}
    if results_path.exists():
        results = {r["id"]: r for r in json.loads(results_path.read_text(encoding="utf-8"))["scenarios"]}
    return scenarios, results


def status(s, results):
    r = results.get(s["id"])
    if not results:
        return ""
    if r is None:
        return "NOT RUN"
    return f"{r['status']} {r['passed']}/{r['tests']}"


def tree(scenarios, results, full: bool = False) -> str:
    lines = ["Utility"]
    attributes = list(dict.fromkeys(s["attribute"] for s in scenarios))
    for i, attribute in enumerate(attributes):
        last_a = i == len(attributes) - 1
        lines.append(("└── " if last_a else "├── ") + attribute)
        pad_a = "    " if last_a else "│   "
        leaves = [s for s in scenarios if s["attribute"] == attribute]
        refinements = list(dict.fromkeys(s["refinement"] for s in leaves))
        for j, refinement in enumerate(refinements):
            last_r = j == len(refinements) - 1
            lines.append(pad_a + ("└── " if last_r else "├── ") + refinement)
            pad_r = pad_a + ("    " if last_r else "│   ")
            group = [s for s in leaves if s["refinement"] == refinement]
            for k, s in enumerate(group):
                head = "└── " if k == len(group) - 1 else "├── "
                mark = status(s, results)
                lines.append(f"{pad_r}{head}{s['id']} ({s['importance']},{s['difficulty']}) {mark}".rstrip())
                if full:
                    more = pad_r + ("    " if k == len(group) - 1 else "│   ")
                    lines.append(f"{more}stimulus: {s['source']} {s['stimulus']}")
                    lines.append(f"{more}measure:  {s['measure']}")
    return "\n".join(lines)


def markdown(scenarios, results) -> str:
    rows = ["| Scenario | Priority | Attribute · refinement | Test cases | Result |", "|---|---|---|---|---|"]
    for s in sorted(scenarios, key=lambda s: (ORDER[s["importance"]], ORDER[s["difficulty"]], s["id"])):
        cases = "<br>".join(s["cases"])
        rows.append(f"| {s['id']} | ({s['importance']},{s['difficulty']}) | {s['attribute']} · {s['refinement']} "
                    f"| {cases} | {status(s, results) or '—'} |")
    return "\n".join(rows)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--markdown", action="store_true", help="a table sorted by priority, in Markdown")
    parser.add_argument("--full", action="store_true", help="the stimulus and the response measure of each leaf")
    args = parser.parse_args()
    scenarios, results = load()
    print(markdown(scenarios, results) if args.markdown else tree(scenarios, results, args.full))


if __name__ == "__main__":
    main()

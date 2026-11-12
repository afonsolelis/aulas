"""Builds lab-data.js, the data of the simulated editor of the Lesson 10 lab (index.html).

Everything the page shows comes from a real session of the reference package
against the real observability stack of stack/, recorded by this script:

1. pytest of each test file and of the whole suite, and promtool on the rules;
2. docker compose up of the six containers, the exporter on port 9108;
3. a good run (--with-today) and a run with TCG_FAULT=source_down, with
   metrics pushed and traces and logs sent by OTLP to the collector;
4. the closed loop: nine ticks against a source that is down, the
   acknowledgement of a person, a good run and two more ticks; then, on a copy
   of the warehouse, a run with TCG_FAULT=duplicate_prices and three ticks;
5. read back: the traces from Tempo, the alerts, rules and series from
   Prometheus, the count of lines in Loki, the JSON log of the runs, the tables
   ops.pipeline_runs and ops.controller_actions;
6. the load test of tools/load_test.py.

Run it from this folder with Docker and the virtual environment of the
reference package, after `pip install -e 'tcg_dataapp[dev]'` (about 10 min,
needs network; Grafana is published on 3001, in case 3000 is taken):

    python build_lab_data.py
"""
from __future__ import annotations

import base64
import json
import os
import re
import shutil
import signal
import subprocess
import sys
import tempfile
import time
import urllib.parse
import urllib.request
from pathlib import Path

HERE = Path(__file__).resolve().parent
PKG = HERE / "tcg_dataapp"
STACK = HERE / "stack"
L7 = HERE.parent / "lesson-7" / "tcg_dataapp"
BIN = Path(sys.executable).parent
PROJECT = "tcglab10"
STUDENT = "/home/student/lesson_10_observability"
PROM, TEMPO, LOKI = "http://localhost:9090", "http://localhost:3200", "http://localhost:3100"
ANSI = re.compile(r"\x1b\[[0-9;?]*[A-Za-z]")


def ls_files(src: Path) -> list[str]:
    return subprocess.run(["git", "ls-files", "--cached", "--others", "--exclude-standard"], cwd=src,
                          capture_output=True, text=True, check=True).stdout.split()


def clean(text: str, work: Path | None = None) -> list[str]:
    text = ANSI.sub("", text).replace("\r", "")
    for old, new in ((str(work), STUDENT) if work else ("", ""), (str(Path(sys.prefix)), f"{STUDENT}/.venv"),
                     (str(PKG), STUDENT), (str(STACK), f"{STUDENT}/stack")):
        if old:
            text = text.replace(old, new)
    text = re.sub(r"/tmp/pytest-of-[^/]+/pytest-\d+", "/tmp/pytest-of-student/pytest-0", text)
    return [line.rstrip() for line in text.split("\n") if line.strip()]


def sh(cmd: list[str], cwd: Path, env: dict | None = None, label: str = "", work: Path | None = None) -> dict:
    t0 = time.monotonic()
    p = subprocess.run(cmd, cwd=cwd, env=env, capture_output=True, text=True)
    seconds = round(time.monotonic() - t0, 1)
    shown = label or " ".join(Path(cmd[0]).name if i == 0 else c for i, c in enumerate(cmd))
    print(f"  {shown[:90]}: exit {p.returncode}, {seconds} s", flush=True)
    return {"cmd": shown, "out": clean(p.stdout + p.stderr, work), "exit": p.returncode, "seconds": seconds,
            "at": round(time.time(), 1)}


def get(url: str, params: dict | None = None):
    if params:
        url += "?" + urllib.parse.urlencode(params)
    with urllib.request.urlopen(url, timeout=30) as r:
        return json.loads(r.read())


def wait_ready(timeout: float = 180) -> None:
    end = time.monotonic() + timeout
    for url in (f"{PROM}/-/ready", f"{TEMPO}/ready", f"{LOKI}/ready", "http://localhost:9091/-/ready"):
        while True:
            try:
                with urllib.request.urlopen(url, timeout=3) as r:
                    if r.status == 200:
                        break
            except OSError:
                pass
            if time.monotonic() > end:
                raise RuntimeError(f"not ready: {url}")
            time.sleep(2)


def hexid(value: str) -> str:
    if re.fullmatch(r"[0-9a-f]{16}|[0-9a-f]{32}", value or ""):
        return value
    return base64.b64decode(value).hex() if value else ""


def attr_value(v: dict):
    for k in ("stringValue", "intValue", "doubleValue", "boolValue"):
        if k in v:
            return int(v[k]) if k == "intValue" else v[k]
    return json.dumps(v)


def trace(trace_id: str, work: Path) -> dict:
    """The spans of one trace, read from Tempo, with ids in hexadecimal and times relative to the root."""
    for _ in range(30):
        try:
            data = get(f"{TEMPO}/api/v2/traces/{trace_id}")
            break
        except OSError:
            time.sleep(2)
    batches = data.get("trace", data)["resourceSpans"]
    resource = {a["key"]: attr_value(a["value"]) for a in batches[0]["resource"]["attributes"]}
    spans = []
    for b in batches:
        for scope in b["scopeSpans"]:
            for s in scope["spans"]:
                spans.append({
                    "id": hexid(s["spanId"]), "parent": hexid(s.get("parentSpanId", "")), "name": s["name"],
                    "start": int(s["startTimeUnixNano"]), "end": int(s["endTimeUnixNano"]),
                    "status": s.get("status", {}).get("code", "STATUS_CODE_UNSET").replace("STATUS_CODE_", ""),
                    "message": s.get("status", {}).get("message", ""),
                    "attrs": {a["key"]: attr_value(a["value"]) for a in s.get("attributes", [])},
                    "events": [{"name": e["name"], "t": int(e["timeUnixNano"]),
                                "attrs": {a["key"]: " ".join(clean(str(attr_value(a["value"])), work))[:400]
                                          for a in e.get("attributes", [])}} for e in s.get("events", [])],
                    "scope": scope.get("scope", {}).get("name", ""),
                })
    t0 = min(s["start"] for s in spans)
    for s in spans:
        s["start"], s["end"] = round((s["start"] - t0) / 1e6, 2), round((s["end"] - t0) / 1e6, 2)
        for e in s["events"]:
            e["t"] = round((e["t"] - t0) / 1e6, 2)
    spans.sort(key=lambda s: (s["start"], s["name"]))
    return {"trace_id": trace_id, "resource": resource, "spans": spans,
            "duration_ms": max(s["end"] for s in spans)}


def prom_series(query: str, start: float, end: float, step: int = 5) -> list[dict]:
    r = get(f"{PROM}/api/v1/query_range", {"query": query, "start": start, "end": end, "step": step})["data"]["result"]
    return [{"metric": x["metric"], "values": [[round(float(t) - start, 1), float(v)] for t, v in x["values"]]} for x in r]


def main() -> None:
    root = Path(tempfile.mkdtemp(prefix="lesson10-"))
    work, work_b = root / "lesson_10_observability", root / "copy_b"
    work.mkdir()
    env = {**os.environ, "PATH": f"{BIN}:{os.environ['PATH']}", "TCG_OTLP_ENDPOINT": "http://localhost:4318",
           "TCG_PUSHGATEWAY": "localhost:9091", "TCG_INSTANCE": "lab", "GRAFANA_PORT": "3001"}
    data: dict = {"captured": time.strftime("%d/%m/%Y")}
    files = ls_files(PKG)
    data["files"] = {f: (PKG / f).read_text(encoding="utf-8") for f in files}
    data["stack"] = {f"stack/{f}": (STACK / f).read_text(encoding="utf-8") for f in ls_files(STACK)}
    l7 = ls_files(L7)
    data["tree"] = [f for f in l7 if not f.startswith("ops/")]
    data["before"] = {f: (L7 / f).read_text(encoding="utf-8") for f in
                      ["pyproject.toml", "README.md", "src/tcg_dataapp/__init__.py", "src/tcg_dataapp/cli.py",
                       "src/tcg_dataapp/config.py", "src/tcg_dataapp/pipeline.py", "src/tcg_dataapp/etls/tcgcsv.py",
                       "src/tcg_dataapp/processors/gold.py", "tests/conftest.py", "tests/test_cli.py"]}
    data["prompts"] = {p.stem: p.read_text(encoding="utf-8") for p in sorted((HERE / "prompts").glob("*.md"))}
    from importlib.metadata import version
    data["versions"] = {k: version(k) for k in ("opentelemetry-sdk", "prometheus-client", "duckdb")}

    print("tests and promtool", flush=True)
    pyt = [str(BIN / "pytest"), "-p", "no:cacheprovider"]
    data["tests"] = {f: sh(pyt + ["-v", f"tests/{f}"], PKG, env | {"TCG_OTLP_ENDPOINT": "", "TCG_PUSHGATEWAY": ""})
                     for f in ("test_telemetry.py", "test_signals.py", "test_control.py")}
    data["tests"]["all"] = sh(pyt + ["-q", "--durations=8"], PKG, env | {"TCG_OTLP_ENDPOINT": "", "TCG_PUSHGATEWAY": ""})
    promtool = ["docker", "run", "--rm", "-v", f"{STACK / 'prometheus'}:/p", "-w", "/p", "--entrypoint", "promtool",
                "prom/prometheus:v3.15.0"]
    data["promtool"] = [sh(promtool + ["check", "config", "prometheus.yml"], STACK, label="promtool check config prometheus.yml"),
                        sh(promtool + ["test", "rules", "rules_test.yml"], STACK, label="promtool test rules rules_test.yml")]

    print("load test", flush=True)
    load = sh([str(BIN / "python"), "tools/load_test.py", "--json", str(root / "load.json")], PKG,
              label="python tools/load_test.py")
    data["load"] = {**load, **json.loads((root / "load.json").read_text())}

    print("the stack", flush=True)
    compose = ["docker", "compose", "-p", PROJECT, "-f", str(STACK / "compose.yaml")]
    sh(compose + ["down", "-v"], STACK, env)
    data["compose_up"] = sh(compose + ["up", "-d"], STACK, env, label="docker compose up -d")
    exporter = None
    try:
        wait_ready()
        t_start = time.time()
        data["t_start"] = t_start
        data["compose_ps"] = sh(compose + ["ps", "--format", "table {{.Service}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}"],
                                STACK, env, label="docker compose ps")
        exporter = subprocess.Popen([str(BIN / "tcg-dataapp"), "metrics"], cwd=work, env=env,
                                    stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True)

        print("runs", flush=True)
        runs = {}
        runs["good"] = sh(["tcg-dataapp", "run", "--with-today"], work, env, work=work)
        shutil.copytree(work, work_b, ignore=shutil.ignore_patterns("logs"))  # the warehouse of a good run, for loop B
        time.sleep(35)  # two scrapes and two evaluations of the rules
        data["metrics_good"] = get(f"{PROM}/api/v1/query", {"query": '{job="tcg_dataapp"}'})["data"]["result"]
        data["exporter_once"] = sh(["tcg-dataapp", "metrics", "--once"], work, env, work=work)
        data["metrics_prom"] = (work / "out/metrics.prom").read_text()
        runs["down"] = sh(["tcg-dataapp", "run", "--with-today"], work,
                          env | {"TCG_FAULT": "source_down", "TCG_RETRIES": "2", "TCG_RETRY_DELAY": "1"}, work=work,
                          label="TCG_FAULT=source_down TCG_RETRIES=2 TCG_RETRY_DELAY=1 tcg-dataapp run --with-today")
        time.sleep(40)
        data["alerts_down"] = get(f"{PROM}/api/v1/alerts")["data"]["alerts"]

        print("loop A: the source is down", flush=True)
        loop = env | {"TCG_FAULT": "source_down", "TCG_RETRIES": "1", "TCG_RETRY_DELAY": "1",
                      "TCG_BREAKER_BACKOFF": "20", "TCG_BREAKER_MAX_OPENS": "3"}
        runs["loop_a"] = sh(["tcg-dataapp", "control", "--interval", "10", "--ticks", "9"], work, loop, work=work,
                            label="TCG_FAULT=source_down TCG_BREAKER_BACKOFF=20 TCG_BREAKER_MAX_OPENS=3 "
                                  "tcg-dataapp control --interval 10 --ticks 9")
        time.sleep(35)
        data["alerts_escalated"] = get(f"{PROM}/api/v1/alerts")["data"]["alerts"]
        runs["ack"] = sh(["tcg-dataapp", "control", "--acknowledge"], work, env, work=work)
        runs["good2"] = sh(["tcg-dataapp", "run", "--with-today"], work, env, work=work)
        runs["loop_a2"] = sh(["tcg-dataapp", "control", "--interval", "10", "--ticks", "2"], work, env, work=work)

        print("loop B: a bad batch", flush=True)
        env_b = env | {"TCG_INSTANCE": "lab-b"}
        runs["dup"] = sh(["tcg-dataapp", "run", "--with-today"], work_b, env_b | {"TCG_FAULT": "duplicate_prices"},
                         work=work_b, label="TCG_FAULT=duplicate_prices tcg-dataapp run --with-today")
        runs["loop_b"] = sh(["tcg-dataapp", "control", "--interval", "10", "--ticks", "3"], work_b, env_b, work=work_b)
        data["runs"] = runs
        time.sleep(20)
        t_end = time.time()
        data["t_end"] = t_end

        print("read back", flush=True)
        import duckdb
        tables = {}
        for name, folder in (("a", work), ("b", work_b)):
            con = duckdb.connect(str(folder / "warehouse/tcg.duckdb"), read_only=True)
            tables[name] = {}
            for t in ("ops.pipeline_runs", "ops.controller_actions"):
                cur = con.execute(f"SELECT * FROM {t} ORDER BY 2, 1" if t.endswith("actions") else
                                  f"SELECT * FROM {t} ORDER BY started_at, rowid")
                tables[name][t] = {"cols": [d[0] for d in cur.description], "rows": [list(r) for r in cur.fetchall()]}
            con.close()
        data["tables"] = tables
        logs = []
        for folder in (work, work_b):
            for line in (folder / "out/logs/tcg-dataapp.jsonl").read_text().splitlines():
                rec = json.loads(line)
                rec.pop("exception", None) if len(str(rec.get("exception", ""))) > 4000 else None
                logs.append({k: (" ".join(clean(v, folder)) if isinstance(v, str) else v) for k, v in rec.items()})
        logs.sort(key=lambda r: r["ts"])
        data["logs"] = logs
        data["loki_lines"] = sum(len(s["values"]) for s in get(f"{LOKI}/loki/api/v1/query_range", {
            "query": '{service_name="tcg-dataapp"}', "start": int(t_start * 1e9), "end": int(t_end * 1e9),
            "limit": 5000})["data"]["result"])
        stream = get(f"{LOKI}/loki/api/v1/query_range", {"query": '{service_name="tcg-dataapp"}', "limit": 1,
                                                          "start": int(t_start * 1e9), "end": int(t_end * 1e9)})
        data["loki_stream"] = {k: v for k, v in stream["data"]["result"][0]["stream"].items()
                               if not k.startswith("code_")}

        def trace_of(run_key):
            m = re.search(r"trace ([0-9a-f]{32})", "\n".join(runs[run_key]["out"]))
            return m.group(1) if m else None

        traces = {"good": trace(trace_of("good"), work), "down": trace(trace_of("down"), work)}
        acts = tables["b"]["ops.controller_actions"]
        ti = acts["cols"].index("trace_id")
        for row in acts["rows"]:
            if row[acts["cols"].index("action")] == "rerun" and row[ti]:
                traces["rerun"] = trace(row[ti], work_b)
                break
        acts_a = tables["a"]["ops.controller_actions"]
        for row in acts_a["rows"]:
            if row[acts_a["cols"].index("action")] == "probe" and row[ti]:
                traces["probe"] = trace(row[ti], work)
                break
        data["traces"] = traces
        data["rules"] = get(f"{PROM}/api/v1/rules")["data"]["groups"]
        series = {}
        for key, q in {
            "run_success": 'tcg_run_success{job="tcg_dataapp"}',
            "run_duration": 'tcg_run_duration_seconds{job="tcg_dataapp"}',
            "fact_rows": "tcg_gold_fact_rows",
            "grain_keys": "tcg_gold_fact_grain_keys",
            "freshness": "tcg:price_freshness_seconds",
            "breaker_open": 'tcg_controller_breaker_open{job="tcg_controller"}',
            "escalated": 'tcg_controller_escalated{job="tcg_controller"}',
            "alerts": 'ALERTS{alertstate="firing"}',
            "request_p95": "tcg:source_request_duration_seconds:p95",
        }.items():
            try:
                series[key] = prom_series(q, t_start, t_end)
            except OSError:
                series[key] = []
        data["series"] = series
    finally:
        if exporter and exporter.poll() is None:
            os.killpg(exporter.pid, signal.SIGTERM)
        data["compose_down"] = sh(compose + ["down", "-v"], STACK, env, label="docker compose down -v")
        shutil.rmtree(root, ignore_errors=True)

    js = "// Generated by build_lab_data.py; do not edit by hand.\nwindow.LAB_DATA = " + \
         json.dumps(data, ensure_ascii=False, separators=(",", ":"), default=str) + ";\n"
    (HERE / "lab-data.js").write_text(js, encoding="utf-8")
    print(f"lab-data.js: {len(js) / 1024:.0f} KB", flush=True)


if __name__ == "__main__":
    main()

"""Builds lab-data.js, the data of the simulated editor of the Lesson 8 lab (index.html).

The simulation shows real code and real runs: the files of tcg_dataapp/, the
prompts of prompts/, and the terminal output, the task runs and the logs of
five real runs of the reference package against tcgcsv.com, read back from a
Prefect server started for the capture. Run it from this folder with the
virtual environment of the reference package, after
`pip install -e 'tcg_dataapp[dev]'` (about 3 min, needs network):

    python build_lab_data.py

The runs, in order, each one in the same temporary folder:

1. pytest (14 tests, without network);
2. tcg-dataapp run, the hand-written runner of Lesson 7, in its own warehouse;
3. tcg-dataapp flow, the first run of the flow;
4. tcg-dataapp flow again, which reads the five downloads from the cache;
5. the same flow with TCG_BASE_URL pointing to a host that does not exist;
6. tcg-dataapp serve and one run of the deployment 'daily' triggered by hand.

It writes lab-data.js next to index.html.
"""
from __future__ import annotations

import asyncio
import datetime
import json
import os
import re
import shutil
import signal
import subprocess
import sys
import tempfile
import time
import urllib.request
from pathlib import Path

HERE = Path(__file__).resolve().parent
PKG = HERE / "tcg_dataapp"
BEFORE = HERE.parent / "lesson-7" / "tcg_dataapp"  # the package of Lesson 7, copied into the folder of the session
BEFORE_FILES = ["pyproject.toml", "README.md", "src/tcg_dataapp/__init__.py", "src/tcg_dataapp/cli.py",
                "tests/test_cli.py", "ops/crontab", "ops/run_daily.sh"]
BIN = Path(sys.executable).parent
PORT = 4299
API = f"http://127.0.0.1:{PORT}/api"
SHOWN_FILES = [
    "pyproject.toml", "README.md", "src/tcg_dataapp/__init__.py", "src/tcg_dataapp/config.py",
    "src/tcg_dataapp/cli.py", "src/tcg_dataapp/pipeline.py", "src/tcg_dataapp/flows.py",
    "src/tcg_dataapp/etls/extract.py", "src/tcg_dataapp/etls/landing.py", "src/tcg_dataapp/etls/tcgcsv.py",
    "src/tcg_dataapp/processors/gold.py", "src/tcg_dataapp/processors/quality.py",
    "src/tcg_dataapp/views/report.py", "tests/conftest.py", "tests/test_flows.py", "tests/test_pipeline.py",
]
ANSI = re.compile(r"\x1b\[[0-9;?]*[A-Za-z]")


SUFFIX = re.compile(r"-[0-9a-f]{3}\b")


def clean(text: str, work: Path) -> list[str]:
    """Terminal output as the student sees it: the folders of the capture become the folder of the lab, and each
    traceback is cut to its first and last lines."""
    text = ANSI.sub("", text).replace("\r", "")
    venv = str(Path(sys.prefix))
    text = (text.replace(venv, "/home/student/lesson_08_dag/.venv").replace(str(work), "/home/student/lesson_08_dag")
            .replace(str(PKG), "/home/student/lesson_08_dag").replace(f":{PORT}", ":4200"))
    lines, skipping = [], False
    for line in text.split("\n"):
        line = line.rstrip()
        if not line.strip():
            continue
        if line.startswith("Traceback (most recent call last):"):
            if not skipping:
                lines += [line, "  ... (traceback cut)"]
            skipping = True
            continue
        if skipping and (line.startswith(" ") or line.startswith("During handling")):
            continue
        skipping = False
        lines.append(line)
    return lines


def task_name(name: str) -> str:
    return SUFFIX.sub("", name)


def sh(cmd: list[str], env: dict, cwd: Path, work: Path) -> dict:
    started = time.monotonic()
    proc = subprocess.run(cmd, env=env, cwd=cwd, capture_output=True, text=True)
    seconds = round(time.monotonic() - started, 1)
    print(f"  {' '.join(cmd[:3])}: exit {proc.returncode}, {seconds} s")
    return {"cmd": " ".join(Path(cmd[0]).name if i == 0 else c for i, c in enumerate(cmd)),
            "out": clean(proc.stdout + proc.stderr, work), "exit": proc.returncode, "seconds": seconds}


def wait_health(timeout: float = 90) -> None:
    end = time.monotonic() + timeout
    while time.monotonic() < end:
        try:
            with urllib.request.urlopen(f"{API}/health", timeout=2):
                return
        except OSError:
            time.sleep(0.5)
    raise RuntimeError("the Prefect server did not start")


def iso(moment) -> float | None:
    return moment.timestamp() if moment else None


async def read_runs(flow_run_ids: list[str], work: Path) -> dict:
    from prefect.client.orchestration import get_client
    from prefect.client.schemas.filters import FlowRunFilter, FlowRunFilterId, LogFilter, LogFilterFlowRunId
    from prefect.client.schemas.sorting import LogSort

    out = {}
    async with get_client() as client:
        for fid in flow_run_ids:
            fr = await client.read_flow_run(fid)
            trs = await client.read_task_runs(flow_run_filter=FlowRunFilter(id=FlowRunFilterId(any_=[fid])))
            names = {str(t.id): task_name(t.name) for t in trs}
            for t in trs:  # a templated name is not rendered when the task never ran: name it after its download
                if names[str(t.id)] == "load_prices":
                    up = [names[str(r.id)] for refs in t.task_inputs.values() for r in refs if getattr(r, "id", None)]
                    day = next((u.split("_")[-1] for u in up if u.startswith("fetch_prices_")), "")
                    names[str(t.id)] = f"load_prices_{day}"
            tasks = []
            for t in trs:
                ups = sorted({names[str(r.id)] for refs in t.task_inputs.values() for r in refs
                              if getattr(r, "id", None) and str(r.id) in names})
                tasks.append({"name": names[str(t.id)], "state": t.state.name if t.state else None,
                              "type": t.state.type.value if t.state else None,
                              "start": iso(t.start_time), "end": iso(t.end_time), "runs": t.run_count,
                              "message": SUFFIX.sub("", (t.state.message or "")[:200]) if t.state else "", "up": ups})
            t0 = min([x["start"] for x in tasks if x["start"]] or [iso(fr.start_time) or 0])
            for x in tasks:
                for k in ("start", "end"):
                    x[k] = round(x[k] - t0, 2) if x[k] else None
            tasks.sort(key=lambda x: (x["start"] is None, x["start"] or 0, x["name"]))
            logs = await client.read_logs(log_filter=LogFilter(flow_run_id=LogFilterFlowRunId(any_=[fid])),
                                          sort=LogSort.TIMESTAMP_ASC, limit=200)
            out[fid] = {
                "id": fid, "name": fr.name, "state": fr.state.name, "message": (fr.state.message or "")[:240],
                "deployment": bool(fr.deployment_id), "parameters": fr.parameters,
                "start": fr.start_time.isoformat() if fr.start_time else None,
                "seconds": round(fr.total_run_time.total_seconds(), 1) if fr.total_run_time else None,
                "tasks": tasks,
                "logs": [[round(iso(l.timestamp) - t0, 2), l.level, names.get(str(l.task_run_id), ""),
                          " ".join(clean(l.message, work))[:300]] for l in logs],
            }
    return out


async def flow_run_ids(after: float) -> list[str]:
    from prefect.client.orchestration import get_client
    from prefect.client.schemas.sorting import FlowRunSort

    async with get_client() as client:
        runs = await client.read_flow_runs(sort=FlowRunSort.START_TIME_ASC, limit=50)
    return [str(r.id) for r in runs if r.start_time and r.start_time.timestamp() >= after]


async def scheduled() -> list[dict]:
    from prefect.client.orchestration import get_client
    from prefect.client.schemas.filters import FlowRunFilter, FlowRunFilterState, FlowRunFilterStateType
    from prefect.client.schemas.objects import StateType
    from prefect.client.schemas.sorting import FlowRunSort

    async with get_client() as client:
        runs = await client.read_flow_runs(
            flow_run_filter=FlowRunFilter(state=FlowRunFilterState(type=FlowRunFilterStateType(any_=[StateType.SCHEDULED]))),
            sort=FlowRunSort.EXPECTED_START_TIME_ASC, limit=5)
        deps = await client.read_deployments()
    return {"runs": [{"name": r.name, "expected": r.expected_start_time.isoformat()} for r in runs],
            "deployments": [{"name": d.name, "schedules": [str(getattr(s.schedule, "cron", s.schedule)) for s in d.schedules],
                             "parameters": d.parameters, "tags": d.tags, "description": d.description} for d in deps]}


def runner_tasks(db: Path) -> list[list]:
    import duckdb

    con = duckdb.connect(str(db), read_only=True)
    rows = con.execute("SELECT task, attempt, status, started_at, ended_at FROM ops.pipeline_runs ORDER BY started_at, task").fetchall()
    con.close()
    t0 = min(r[3] for r in rows)
    return [[r[0], r[1], r[2], r[3] - t0, r[4] - t0] for r in rows]


def main() -> None:
    work = Path(tempfile.mkdtemp(prefix="lesson8-"))
    home = work / ".prefect"
    env = {**os.environ, "PREFECT_HOME": str(home), "PREFECT_API_URL": API, "PREFECT_LOGGING_COLORS": "false",
           "PREFECT_SERVER_ANALYTICS_ENABLED": "false", "PREFECT_CLI_COLORS": "false", "COLUMNS": "110",
           "TCG_DB_PATH": str(work / "warehouse/tcg.duckdb"), "TCG_OUT_DIR": str(work / "out"),
           "PATH": f"{BIN}:{os.environ['PATH']}"}
    os.environ.update({k: env[k] for k in ("PREFECT_HOME", "PREFECT_API_URL")})
    data: dict = {"files": {p: (PKG / p).read_text(encoding="utf-8") for p in SHOWN_FILES},
                  "prompts": {p.stem: p.read_text(encoding="utf-8") for p in sorted((HERE / "prompts").glob("*.md"))},
                  "captured": datetime.date.today().strftime("%d/%m/%Y"),
                  "before": {p: (BEFORE / p).read_text(encoding="utf-8") for p in BEFORE_FILES},
                  "tree": sorted(str(p.relative_to(BEFORE)) for p in BEFORE.rglob("*") if p.is_file()
                                 and not any(x in p.parts for x in ("__pycache__", ".pytest_cache", "tcg_dataapp.egg-info")))}
    import prefect, duckdb  # noqa: E401
    data["versions"] = {"prefect": prefect.__version__, "duckdb": duckdb.__version__,
                        "python": ".".join(map(str, sys.version_info[:3]))}

    print("tests")
    test_env = {k: v for k, v in env.items() if k != "PREFECT_API_URL"}
    data["pytest"] = sh([str(BIN / "pytest"), "-q", "-p", "no:cacheprovider"], test_env, PKG, work)

    print("runner of Lesson 7")
    runner_env = {**env, "TCG_DB_PATH": str(work / "runner/tcg.duckdb"), "TCG_OUT_DIR": str(work / "runner/out")}
    data["runner"] = sh([str(BIN / "tcg-dataapp"), "run"], runner_env, work, work)
    data["runner"]["tasks"] = runner_tasks(work / "runner/tcg.duckdb")

    print("flow: first, cached, source down, each with the temporary server of Prefect")
    mark = time.time() - 1
    local = {k: v for k, v in env.items() if k != "PREFECT_API_URL"}  # no server yet: Prefect starts a temporary one
    data["first"] = sh([str(BIN / "tcg-dataapp"), "flow"], local, work, work)
    data["second"] = sh([str(BIN / "tcg-dataapp"), "flow"], local, work, work)
    down_env = {**local, "TCG_BASE_URL": "https://tcgcsv.invalid", "TCG_RETRIES": "2", "TCG_RETRY_DELAY": "1",
                "TCG_DB_PATH": str(work / "down/tcg.duckdb"), "TCG_OUT_DIR": str(work / "down/out")}
    data["down"] = sh([str(BIN / "tcg-dataapp"), "flow"], down_env, work, work)

    print("Prefect server")
    server_log = open(work / "server.log", "w")
    server = subprocess.Popen([str(BIN / "prefect"), "server", "start", "--port", str(PORT)], env=env, cwd=work,
                              stdout=server_log, stderr=subprocess.STDOUT, start_new_session=True)
    serve = None
    try:
        wait_health()
        print("deployment")
        log = open(work / "serve.log", "w")
        serve = subprocess.Popen([str(BIN / "tcg-dataapp"), "serve"], env=env, cwd=work, stdout=log,
                                 stderr=subprocess.STDOUT, start_new_session=True)
        for _ in range(60):
            if "tcg-dataapp/daily" in " ".join(sh([str(BIN / "prefect"), "deployment", "ls"], env, work, work)["out"]):
                break
            time.sleep(1)
        data["config_set"] = sh([str(BIN / "prefect"), "config", "set", "PREFECT_API_URL=http://127.0.0.1:4200/api"],
                                {**env, "PREFECT_HOME": str(work / ".prefect-profile")}, work, work)
        data["deployment_ls"] = sh([str(BIN / "prefect"), "deployment", "ls"], env, work, work)
        data["deployment_run"] = sh([str(BIN / "prefect"), "deployment", "run", "tcg-dataapp/daily"], env, work, work)
        for _ in range(120):
            ids = asyncio.run(flow_run_ids(mark))
            runs = asyncio.run(read_runs(ids, work))
            dep = [r for r in runs.values() if r["deployment"]]
            if dep and dep[-1]["state"] in ("Completed", "Failed", "Crashed"):
                break
            time.sleep(2)
        data["flow_run_ls"] = sh([str(BIN / "prefect"), "flow-run", "ls", "--limit", "5"], env, work, work)
        data["scheduled"] = asyncio.run(scheduled())
        ids = asyncio.run(flow_run_ids(mark))
        runs = asyncio.run(read_runs(ids, work))
        ordered = sorted(runs.values(), key=lambda r: r["start"] or "")
        data["runs"] = {"first": ordered[0], "second": ordered[1], "down": ordered[2],
                        "deployed": next(r for r in ordered if r["deployment"])}
        data["status"] = sh([str(BIN / "tcg-dataapp"), "status"], env, work, work)
        import duckdb as ddb
        con = ddb.connect(env["TCG_DB_PATH"], read_only=True)
        cur = con.execute("SELECT run_id, task, attempt, status, started_at, ended_at, detail FROM ops.pipeline_runs "
                          "ORDER BY started_at, task")
        data["pipeline_runs"] = {"cols": [d[0] for d in cur.description], "rows": [list(r) for r in cur.fetchall()]}
        con.close()
    finally:
        for proc in (serve, server):
            if proc and proc.poll() is None:
                os.killpg(proc.pid, signal.SIGINT)
                try:
                    proc.wait(15)
                except subprocess.TimeoutExpired:
                    os.killpg(proc.pid, signal.SIGKILL)
    data["server"] = {"cmd": "prefect server start", "out": clean((work / "server.log").read_text(), work)[:30]}
    data["serve"] = {"cmd": "tcg-dataapp serve", "out": clean((work / "serve.log").read_text(), work)[:60]}
    shutil.rmtree(work, ignore_errors=True)

    js = "// Generated by build_lab_data.py; do not edit by hand.\nwindow.LAB_DATA = " + \
         json.dumps(data, ensure_ascii=False, separators=(",", ":"), default=str) + ";\n"
    (HERE / "lab-data.js").write_text(js, encoding="utf-8")
    print(f"lab-data.js: {len(js) / 1024:.0f} KB")


if __name__ == "__main__":
    main()

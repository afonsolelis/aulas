"""Builds lab-data.js, the data of the simulated editor of the Lesson 9 lab (index.html).

The simulation shows real code and real runs. It reads the files of
tcg_dataapp/, the prompts of prompts/ and the scenarios of docs/scenarios.toml,
and records:

1. pytest on the code of Lesson 7 with the tests of Lesson 9 (the first run of
   step 05, which fails 5 of 29 tests) and on version 0.3.0 (step 06);
2. three pipelines of .gitlab-ci.yml (step 07), each job run in Docker with the
   image of the file, python:3.12-slim, in the order that GitLab would follow
   (stages, needs, rules, artifacts, the pip cache):
   - the merge request of the branch tests/atam-scenarios, with version 0.3.0;
   - the same merge request after a commit that disables the gate of S04;
   - the schedule of main, which runs only the smoke job against tcgcsv.com.

The output of every command is real. The lines that the GitLab runner writes
around it (preparing the executor, uploading artifacts) are not recorded,
because the jobs ran in Docker and not in a runner of git.inteli.edu.br.

Run it from this folder with Docker and a virtual environment that has
duckdb, py7zr, pytest and pyyaml, without the package installed: each copy is
imported from its own src/ (about 5 min, needs network):

    python build_lab_data.py
"""
from __future__ import annotations

import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import threading
import time
import tomllib
import xml.etree.ElementTree as ET
from pathlib import Path

import yaml

HERE = Path(__file__).resolve().parent
PKG = HERE / "tcg_dataapp"
L7 = HERE.parent / "lesson-7" / "tcg_dataapp"
BIN = Path(sys.executable).parent
PROJECT_DIR = "/builds/inteli/tcg-dataapp"
STUDENT = "/home/student/tcg-dataapp"
CHANGED_IN_030 = ["src/tcg_dataapp/cli.py", "src/tcg_dataapp/processors/quality.py"]
TMP = re.compile(r"/tmp/pytest-of-[^/]+/pytest-\d+")
REGRESSION = ("src/tcg_dataapp/processors/quality.py", "MAX_NULL_SHARE = 0.10     # S04: share of null market prices in a capture (real maximum 1.7 %)",
              "MAX_NULL_SHARE = 1.0      # S04: disabled, the gate stopped the run of 2026-09-01")


def ls_files(src: Path) -> list[str]:
    return subprocess.run(["git", "ls-files", "--cached", "--others", "--exclude-standard"], cwd=src,
                          capture_output=True, text=True, check=True).stdout.split()


def copy_tree(src: Path, dst: Path) -> None:
    shutil.copytree(src, dst, dirs_exist_ok=True,
                    ignore=shutil.ignore_patterns(".venv", "out", "__pycache__", "*.egg-info", ".pytest_cache"))


def tracked(src: Path, dst: Path) -> None:
    """A checkout: the files that git tracks, as a runner clones them."""
    for f in ls_files(src):
        (dst / f).parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src / f, dst / f)
    for f in (dst / "out").glob("*"):
        f.unlink()  # out/ is ignored by git; the copy kept in the repository is the result of the reference


def clean(text: str, *dirs: tuple[str, str]) -> list[str]:
    for old, new in dirs:
        text = text.replace(old, new)
    text = re.sub(r"\x1b\[[0-9;?]*[A-Za-z]", "", text).replace("\r", "")
    text = TMP.sub("/tmp/pytest-of-student/pytest-0", text)
    return [line.rstrip() for line in text.split("\n") if line.strip()]


def junit(path: Path) -> dict:
    root = ET.parse(path).getroot()
    suite = root if root.tag == "testsuite" else root.find("testsuite")
    cases = []
    for c in suite.iter("testcase"):
        bad = c.find("failure") if c.find("failure") is not None else c.find("error")
        cases.append({"file": c.get("classname", "").replace(".", "/") + ".py", "name": c.get("name"),
                      "time": round(float(c.get("time", 0)), 3), "status": "failed" if bad is not None else "passed",
                      "message": TMP.sub("/tmp/pytest-of-student/pytest-0", (bad.get("message") or ""))[:300]
                      if bad is not None else ""})
    return {k: int(suite.get(k, 0)) for k in ("tests", "failures", "errors", "skipped")} | {
        "time": round(float(suite.get("time", 0)), 2), "cases": cases}


def pytest_run(project: Path, label: str) -> dict:
    """pytest and tools/traceability.py on a local copy, as the student runs them."""
    started = time.monotonic()
    env = {**os.environ, "PYTHONPATH": str(project / "src")}  # the copy, never an installed package
    p = subprocess.run([str(BIN / "python"), "-m", "pytest", "-p", "no:cacheprovider", "--junitxml=out/junit.xml"],
                       cwd=project, capture_output=True, text=True, env=env)
    seconds = round(time.monotonic() - started, 1)
    t = subprocess.run([str(BIN / "python"), "tools/traceability.py"], cwd=project, capture_output=True, text=True,
                       env=env)
    dirs = ((str(project), STUDENT), (str(Path(sys.prefix)), f"{STUDENT}/.venv"))
    print(f"  pytest {label}: exit {p.returncode}, {seconds} s")
    return {"out": clean(p.stdout + p.stderr, *dirs), "exit": p.returncode, "seconds": seconds,
            "junit": junit(project / "out/junit.xml"),
            "traceability": json.loads((project / "out/traceability.json").read_text()),
            "tree": clean(t.stdout, *dirs)}


# ---------- An emulation of the GitLab runner, in Docker ----------

def rule_matches(expr: str, env: dict) -> bool:
    """The expressions of this .gitlab-ci.yml: $VAR, $VAR == "x", $VAR != "x", joined by &&."""
    for part in expr.split("&&"):
        part = part.strip()
        m = re.fullmatch(r'\$(\w+)\s*(==|!=)\s*"([^"]*)"', part)
        if m:
            ok = (env.get(m[1], "") == m[3]) == (m[2] == "==")
        else:
            ok = bool(env.get(re.fullmatch(r"\$(\w+)", part)[1]))
        if not ok:
            return False
    return True


def evaluate(rules: list | None, env: dict) -> str | None:
    if rules is None:
        return "on_success"
    for r in rules:
        if "if" not in r or rule_matches(r["if"], env):
            return r.get("when", "on_success")
    return None


def jobs_of(ci: dict, env: dict) -> list[dict]:
    if evaluate(ci["workflow"]["rules"], env) in (None, "never"):
        return []
    jobs = []
    for name, spec in ci.items():
        if name in ("workflow", "default", "variables", "stages") or name.startswith("."):
            continue
        spec = {**ci.get(spec.get("extends", ""), {}), **spec}
        when = evaluate(spec.get("rules"), env)
        if when in (None, "never"):
            continue
        jobs.append({"name": name, "stage": spec["stage"], "when": when,
                     "needs": [n["job"] if isinstance(n, dict) else n for n in spec["needs"]] if "needs" in spec else None,
                     "before": spec.get("before_script", ci["default"]["before_script"]), "script": spec["script"],
                     "artifacts": spec.get("artifacts", {})})
    order = {s: i for i, s in enumerate(ci["stages"])}
    return sorted(jobs, key=lambda j: order[j["stage"]])


def run_pipeline(source: Path, env: dict, cache: Path, ci: dict, label: str) -> dict:
    jobs = jobs_of(ci, env)
    order = {s: i for i, s in enumerate(ci["stages"])}
    variables = {k: v.replace("$CI_PROJECT_DIR", PROJECT_DIR) for k, v in ci["variables"].items()}
    store = Path(tempfile.mkdtemp(prefix="artifacts-"))
    state = {j["name"]: "created" for j in jobs}
    out = {j["name"]: {"lines": [], "start": None, "end": None} for j in jobs}
    lock = threading.Lock()
    t0 = time.monotonic()

    def run_job(job):
        work = Path(tempfile.mkdtemp(prefix="job-"))
        copy_tree(source, work)
        for dep in (job["needs"] if job["needs"] is not None else
                    [j["name"] for j in jobs if order[j["stage"]] < order[job["stage"]]]):
            if (store / dep).exists():
                shutil.copytree(store / dep, work, dirs_exist_ok=True)
        if cache.exists():
            shutil.copytree(cache, work / ".cache/pip", dirs_exist_ok=True)
        cmds = job["before"] + job["script"]
        script = "set -o pipefail\n" + "\n".join(
            f"printf '%s\\n' {json.dumps('$ ' + c)}\n{c} || exit $?" for c in cmds)
        # the uid of this user, so that the job can write the pip cache and the files can be removed afterwards
        argv = ["docker", "run", "--rm", "--user", f"{os.getuid()}:{os.getgid()}", "-e", "HOME=/tmp",
                "-v", f"{work}:{PROJECT_DIR}", "-w", PROJECT_DIR]
        for k, v in {**variables, **env, "CI_JOB_NAME": job["name"], "CI_PROJECT_DIR": PROJECT_DIR}.items():
            argv += ["-e", f"{k}={v}"]
        argv += [ci["default"]["image"], "bash", "-c", script]
        out[job["name"]]["start"] = round(time.monotonic() - t0, 2)
        proc = subprocess.Popen(argv, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, bufsize=1)
        for line in proc.stdout:
            line = re.sub(r"\x1b\[[0-9;?]*[A-Za-z]", "", line.rstrip("\n")).replace("\r", "")
            if line.strip():
                out[job["name"]]["lines"].append([round(time.monotonic() - t0, 2), line])
        code = proc.wait()
        out[job["name"]]["end"] = round(time.monotonic() - t0, 2)
        out[job["name"]]["exit"] = code
        ok = code == 0
        art = job["artifacts"]
        if art and (ok or art.get("when") == "always"):
            keep = list(art.get("paths", [])) + list(art.get("reports", {}).values())
            for p in keep:
                if (work / p).exists():
                    (store / job["name"] / p).parent.mkdir(parents=True, exist_ok=True)
                    shutil.copy2(work / p, store / job["name"] / p)
            reports = art.get("reports", {})
            if "junit" in reports and (work / reports["junit"]).exists():
                out[job["name"]]["junit"] = junit(work / reports["junit"])
            if "out/traceability.json" in keep and (work / "out/traceability.json").exists():
                out[job["name"]]["traceability"] = json.loads((work / "out/traceability.json").read_text())
            if "out/traceability.md" in keep and (work / "out/traceability.md").exists():
                out[job["name"]]["artifact_md"] = (work / "out/traceability.md").read_text()
        if (work / ".cache/pip").exists():
            with lock:
                shutil.copytree(work / ".cache/pip", cache, dirs_exist_ok=True)
        shutil.rmtree(work, ignore_errors=True)
        with lock:
            state[job["name"]] = "success" if ok else "failed"

    threads = {}
    while any(s in ("created", "running") for s in state.values()):
        for job in jobs:
            if state[job["name"]] != "created":
                continue
            deps = job["needs"] if job["needs"] is not None else [
                j["name"] for j in jobs if order[j["stage"]] < order[job["stage"]]]
            if any(state[d] in ("created", "running") for d in deps):
                continue
            failed = any(state[d] in ("failed", "skipped") for d in deps)
            if failed and job["when"] != "always":
                state[job["name"]] = "skipped"
                continue
            state[job["name"]] = "running"
            threads[job["name"]] = threading.Thread(target=run_job, args=(job,))
            threads[job["name"]].start()
        time.sleep(0.2)
    for th in threads.values():
        th.join()
    shutil.rmtree(store, ignore_errors=True)
    total = round(time.monotonic() - t0, 1)
    status = "failed" if any(s == "failed" for s in state.values()) else "passed"
    print(f"  pipeline {label}: {status} in {total} s · " + ", ".join(f"{k} {v}" for k, v in state.items()))
    return {"label": label, "status": status, "seconds": total, "env": env,
            "jobs": [{"name": j["name"], "stage": j["stage"], "needs": j["needs"], "when": j["when"],
                      "status": state[j["name"]], **out[j["name"]],
                      "lines": [[t, l] for t, l in out[j["name"]]["lines"]]} for j in jobs]}


def main() -> None:
    root = Path(tempfile.mkdtemp(prefix="lesson9-"))
    ci_text = (PKG / ".gitlab-ci.yml").read_text(encoding="utf-8")
    ci = yaml.safe_load(ci_text)
    data: dict = {"captured": time.strftime("%d/%m/%Y"), "versions": {
        "python": subprocess.run(["docker", "run", "--rm", ci["default"]["image"], "python", "-V"],
                                 capture_output=True, text=True).stdout.split()[-1]}}

    files = ls_files(PKG)
    data["files"] = {f: (PKG / f).read_text(encoding="utf-8") for f in files if not f.startswith("out/")}
    l7 = subprocess.run(["git", "ls-files"], cwd=L7, capture_output=True, text=True, check=True).stdout.split()
    data["tree"] = [f for f in l7 if not f.startswith("ops/")]
    data["before"] = {f: (L7 / f).read_text(encoding="utf-8") for f in
                      ["pyproject.toml", "README.md", "src/tcg_dataapp/__init__.py", "src/tcg_dataapp/cli.py",
                       "src/tcg_dataapp/processors/quality.py", "tests/conftest.py", "tests/test_cli.py"]}
    data["prompts"] = {p.stem: p.read_text(encoding="utf-8") for p in sorted((HERE / "prompts").glob("*.md"))}
    data["scenarios"] = tomllib.loads((PKG / "docs/scenarios.toml").read_text(encoding="utf-8"))["scenario"]

    print("pytest, the first run of step 05 and the run of step 06")
    first = root / "v010"
    tracked(PKG, first)
    for f in CHANGED_IN_030:
        shutil.copy2(L7 / f, first / f)
    data["first"] = pytest_run(first, "on the code of Lesson 7")
    second = root / "v030"
    tracked(PKG, second)
    data["second"] = pytest_run(second, "on 0.3.0")

    print("pipelines of .gitlab-ci.yml in Docker")
    cache = root / "pip-cache"
    branch = "tests/atam-scenarios"
    mr = {"CI_PIPELINE_SOURCE": "merge_request_event", "CI_COMMIT_BRANCH": "", "CI_COMMIT_REF_NAME": branch,
          "CI_MERGE_REQUEST_IID": "1", "CI_MERGE_REQUEST_SOURCE_BRANCH_NAME": branch,
          "CI_MERGE_REQUEST_TARGET_BRANCH_NAME": "main", "CI_OPEN_MERGE_REQUESTS": ""}
    green = run_pipeline(second, mr, cache, ci, "merge request !1, version 0.3.0")
    regressed = root / "regressed"
    tracked(PKG, regressed)
    path, old, new = REGRESSION
    text = (regressed / path).read_text(encoding="utf-8")
    assert old in text
    (regressed / path).write_text(text.replace(old, new), encoding="utf-8")
    red = run_pipeline(regressed, mr, cache, ci, "merge request !1, the gate of S04 disabled")
    schedule = {"CI_PIPELINE_SOURCE": "schedule", "CI_COMMIT_BRANCH": "main", "CI_COMMIT_REF_NAME": "main"}
    nightly = run_pipeline(second, schedule, cache, ci, "schedule of main, 06:00 UTC")
    push = {"CI_PIPELINE_SOURCE": "push", "CI_COMMIT_BRANCH": branch, "CI_OPEN_MERGE_REQUESTS": "inteli/tcg-dataapp!1"}
    data["push_with_mr_jobs"] = [j["name"] for j in jobs_of(ci, push)]  # [] : the workflow drops the branch pipeline
    data["pipelines"] = {"green": green, "red": red, "nightly": nightly}
    data["regression"] = {"path": path, "old": old, "new": new}
    shutil.rmtree(root, ignore_errors=True)

    js = "// Generated by build_lab_data.py; do not edit by hand.\nwindow.LAB_DATA = " + \
         json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";\n"
    (HERE / "lab-data.js").write_text(js, encoding="utf-8")
    print(f"lab-data.js: {len(js) / 1024:.0f} KB")


if __name__ == "__main__":
    main()

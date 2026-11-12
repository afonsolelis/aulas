# tcg-dataapp 0.3.0 · the ATAM scenarios of Lesson 9

The package of Lesson 7, tested scenario by scenario. The quality attributes of the DataApp were refined into a utility tree, each leaf became a quality attribute scenario in six parts, each scenario became test cases, and each test case became a pytest function marked with the id of its scenario. The first run of these tests against the package of Lesson 7 exposed three risks, which this version closes.

Every date is Unix time in seconds (UTC). This version keeps the runner of `pipeline.py` from Lesson 7, so it runs without Prefect.

## Install and test

```bash
python3 -m venv .venv && source .venv/bin/activate
pip install -e '.[dev]'
pytest                                  # 29 tests, 9 to 17 s, without network; prints the ATAM traceability
pytest --scenario S04                   # only the tests of one scenario
pytest --junitxml=out/junit.xml         # the report that a CI server reads
python tools/traceability.py            # the utility tree with the result of each leaf (--full, --markdown)
tcg-dataapp run                         # the pipeline of Lesson 7, now with the gates of S03 and S04
tcg-dataapp freshness --max-age-days 2  # S11: exit code 1 when the last capture is too old
```

## The pipeline on git.inteli.edu.br

`.gitlab-ci.yml` runs the suite in GitLab CI, in the image `python:3.12-slim`, with a pip cache keyed by `pyproject.toml`:

| Stage | Job | Runs | Does |
|---|---|---|---|
| test | `test:unit` | every push, every merge request | the 9 tests of the package, with a JUnit report |
| test | `test:scenarios` | every push, every merge request | the 20 tests of the scenarios, with a JUnit report and `out/traceability.json`, kept even when a test fails |
| report | `traceability` | after `test:scenarios`, also after a failure | `tools/traceability.py --markdown`, exposed as the artifact "utility tree" |
| smoke | `smoke:real-data` | only in a pipeline schedule | `tcg-dataapp run --with-today` and `tcg-dataapp freshness --max-age-days 2` against tcgcsv.com |

The workflow rules run one pipeline per commit: the merge request pipeline when the branch has an open merge request, the branch pipeline otherwise. In the project, three settings complete it: a runner available to the project (Settings › CI/CD › Runners), "Pipelines must succeed" (Settings › Merge requests) and a schedule of `main` at `0 6 * * *` (Build › Pipeline schedules). Recorded on 12/11/2026 with the same image in Docker: the merge request pipeline passed 29 tests in about 24 s; a commit that sets `MAX_NULL_SHARE = 1.0` fails `test:scenarios` with TC04.1, and `traceability` still marks S04 FAIL 1/2; the scheduled pipeline ran the real data in about 55 s, with the last capture 0.2 days old.

## The ATAM documents

| File | Step | Contents |
|---|---|---|
| `docs/business_drivers.md` | 01 | five business drivers and eight quality attributes |
| `docs/utility_tree.md` | 02 | the utility tree, with the leaves rated (importance, difficulty) |
| `docs/scenarios.toml` | 03 | fourteen scenarios in six parts: the single source of the tree, the tables and the report |
| `docs/scenarios.md` | 03 | the same scenarios as tables, generated from the TOML file |
| `docs/test_cases.md` | 04 | twenty test cases, each one traced to a scenario and to a test function |
| `docs/contracts/marts.json` | 04 | the names and types of the columns of the Parquet marts (S10) |
| `tests/scenarios/` | 05 | the tests, one file per group of attributes |
| `docs/traceability.md` | 05 | scenario, priority, test cases and result, sorted by priority |
| `docs/results.md` | 06 | the first run on 0.1.0, the changes of 0.3.0, risks, non-risks, sensitivity points and tradeoffs |

## How a test is traced

```python
@pytest.mark.scenario("S04")
def test_s04_renamed_price_field_stops_the_run(settings):
    """TC04.1 a renamed price field stops the run"""
```

The plugin in `tests/conftest.py` refuses a scenario id that is not in `docs/scenarios.toml`, blocks the network for every test (S13), prints one line per scenario at the end of the run and writes `out/traceability.json`, which `tools/traceability.py` reads.

## What changed from 0.1.0

| Change | Scenario |
|---|---|
| `check_gold` compares the prices of each capture in the landing table with the fact and stops above 1 % lost | S03 |
| `check_gold` stops when more than 10 % of the market prices of a capture are null | S04 |
| `check_freshness` and the command `tcg-dataapp freshness` | S11 |
| the check `fact_without_set`, which could never fail, was removed | S03 |
| `FakeClient(prices=...)` lets a test change what the source publishes | S03, S04, S05 |

## Reference numbers (08/11/2026, Python 3.12.3, DuckDB 2.0.0)

- Against the package of Lesson 7: 24 passed, 5 failed (S03 0/2, S04 1/2, S11 0/2).
- Version 0.3.0: 29 passed in 8.8 s on an idle machine and in 12.5 to 17.3 s with the machine loaded by other processes; 14 of 14 scenarios PASS.
- Real run: 12 tasks ok in 25 s; 5,951 prices; `prices_not_in_fact` 0; `max_null_price_share` 0.017; 524 cells; 1,226 rows frozen in September.
- S12: 100,000 synthetic prices from `build_gold` to `write_report` in 1.1 to 1.5 s (budget 10 s).

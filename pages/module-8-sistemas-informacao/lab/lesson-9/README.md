# Lesson 9 · Lab: automated tests from ATAM scenarios

Module 8 · Information Systems · Inteli · Thursday, 03/12/2026

In this lesson each student tests the DataApp of the group alone, in class, with the method of the ATAM (Architecture Tradeoff Analysis Method). The business drivers give the quality attributes. The attributes are refined into a utility tree, and each leaf of the tree becomes a quality attribute scenario in six parts. Each scenario yields test cases, each test case becomes a pytest function marked with its scenario, and the results of the run are read back into the tree as risks, non-risks, sensitivity points and tradeoffs.

The professor applied the whole method to the package of Lesson 7, in `tcg_dataapp/` (version 0.3.0). Its `docs/` folder holds the six documents of the method and `docs/results.md` the two runs: the first against the package of Lesson 7, which failed 5 of 29 tests in three scenarios, and the second after the changes that close those risks.

## Prepare

```bash
cd <the repository of the group>          # the DataApp packaged in Lesson 7
python3 -m venv .venv && source .venv/bin/activate
pip install -e '.[dev]' && pytest          # the starting point must be green
git clone --depth 1 https://github.com/afonsolelis/aulas.git ~/aulas   # the reference
claude                                     # or the coding agent of your choice
```

## Steps

| Step | Prompt | Produces | Reference |
|---|---|---|---|
| 01 | `prompts/01_drivers_and_attributes.md` | `docs/business_drivers.md` | 5 drivers, 8 attributes |
| 02 | `prompts/02_utility_tree.md` | `docs/utility_tree.md`, `docs/scenarios.toml` | 14 leaves rated (importance, difficulty) |
| 03 | `prompts/03_scenarios.md` | the six parts of each scenario, `docs/scenarios.md` | source, stimulus, artifact, environment, response, measure |
| 04 | `prompts/04_test_cases.md` | `docs/test_cases.md`, `docs/contracts/` | 20 test cases, each traced to one scenario |
| 05 | `prompts/05_implement_and_run.md` | `tests/scenarios/`, the plugin, `out/junit.xml` | 29 tests; first run 24 passed, 5 failed |
| 06 | `prompts/06_results_into_the_tree.md` | `docs/results.md`, `docs/traceability.md` | 3 risks closed, 2 open; second run 29 passed |

## The reference package

```bash
cd ~/aulas/pages/module-8-sistemas-informacao/lab/lesson-9/tcg_dataapp
python3 -m venv .venv && source .venv/bin/activate
pip install -e '.[dev]'
pytest                          # 29 passed in 9 to 17 s, without network, with the ATAM traceability table
pytest --scenario S04           # one scenario
python tools/traceability.py    # the utility tree with the result of each leaf
```

## The graded activity

The in-class graded activity of this session is the application of the six steps to the DataApp of the group, done by each student alone during the session. Its statement is the DAG and Testing Activity on Adalove: each student works on a branch `graded-activity/student-name` with a Prefect pipeline (Lesson 8) and the tests derived in the six steps, documents the implementation and the testing approach in a pull request and submits only the link by Friday, 04/12/2026. The criteria are those listed in the activity on Adalove.

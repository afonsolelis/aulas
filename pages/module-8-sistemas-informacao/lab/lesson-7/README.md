# Lesson 7 · Lab: the DataApp as a Python package

Module 8 · Information Systems · Inteli · Friday, 27/11/2026

In Lesson 6 the model of the TCGplayer prices was built by hand, step by step, in the lab of the browser. In this lesson the coding agent writes a Python package that does all of it on its own: it collects the data, loads the landing table, builds the gold layer, checks it, freezes the monthly reports and writes the answers, in one command that can run every day.

The reference package written by the professor is `tcg_dataapp/` (its README has the details). In class the professor builds the same package live, in a new folder, with the four CREATE prompts of `prompts/`, and compares each step with the reference.

## Prepare

```bash
git clone --depth 1 https://github.com/afonsolelis/aulas.git
mkdir -p ~/lesson_07_dataapp && cd ~/lesson_07_dataapp
cp -r ~/aulas/pages/module-8-sistemas-informacao/lab/lesson-6/sql ./lesson6_sql   # the SQL that becomes the processors
claude                                                                              # or the coding agent of your choice
```

## Steps

| Step | Prompt | Builds | Checks |
|---|---|---|---|
| 01 | `prompts/01_package.md` | `pyproject.toml`, the three layers, `config.py`, `cli.py`, a first test | `pip install -e '.[dev]'` and `pytest` pass; `tcg-dataapp --version` |
| 02 | `prompts/02_etls.md` | `etls/tcgcsv.py`, `etls/landing.py`, `etls/extract.py` | a batch loaded twice is replaced; the five archives give 657, 896, 1,153, 1,414 and 1,831 prices |
| 03 | `prompts/03_processors.md` | `processors/sql/*.sql`, `gold.py`, `quality.py` | 5,951 rows = 5,951 keys of the grain; 524 cells; September frozen with 1,226 rows |
| 04 | `prompts/04_pipeline_and_views.md` | `views/`, `pipeline.py`, the full `cli.py`, the tests of the pipeline | `tcg-dataapp run` with 12 tasks ok in about 40 s; 9 tests pass |

## The reference package

```bash
cd tcg_dataapp
python3 -m venv .venv && source .venv/bin/activate
pip install -e '.[dev]'
pytest                      # 9 passed, without network
tcg-dataapp run             # warehouse/tcg.duckdb, out/report.md, out/marts/*.parquet
tcg-dataapp status
```

## The second hour

The second hour is the graded DataApp Packaging activity, in which each student packages the DataApp of the group in the same three layers. Its statement is the DataApp Packaging activity on Adalove: each student works on a branch `graded-activity-package/student-name`, documents the package in a pull request and submits only the link by Friday, 27/11/2026, the day of the session. The criteria are those listed in the activity on Adalove.

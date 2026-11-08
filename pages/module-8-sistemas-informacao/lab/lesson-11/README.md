# Lesson 11 · Lab: the technical infographic of the DataApp in Streamlit

Module 8 · Information Systems · Inteli · Thursday, 10/12/2026

The DataApp of the TCGplayer prices already runs by itself (Lesson 7). In this lesson it gains the layer that people look at: a Streamlit app, inside the views layer of the package, that explains how the DataApp works (its pipeline, its lineage and its last run) and lets its users explore the gold layer with ranked bars, drill-down and prices over time, in the palette of the Inteli design system and with accessible choices of chart.

The reference package is `tcg_dataapp/` (version 0.5.0; its README has the details). In class the professor builds the app live with the coding agent, with the CREATE prompts of `prompts/`, over a copy of the package of Lesson 7, and compares each step with the reference.

## Prepare

```bash
git clone --depth 1 https://github.com/afonsolelis/aulas.git
cp -r aulas/pages/module-8-sistemas-informacao/lab/lesson-7/tcg_dataapp ~/lesson_11_app && cd ~/lesson_11_app
python3 -m venv .venv && source .venv/bin/activate
pip install -e '.[dev]' streamlit altair
tcg-dataapp run             # the warehouse that the app reads
claude                      # or the coding agent of your choice
```

## Steps

| Step | Prompt | Builds | Checks |
|---|---|---|---|
| 01 | `prompts/01_queries_and_metadata.md` | `views/dashboard.py`, `ops.pipeline_tasks`, the comment of the frozen tables, `tests/test_dashboard.py` | 13 objects and 20 edges in the lineage; the explorer agrees with the cube; a value typed by the user never becomes SQL |
| 02 | `prompts/02_infographic.md` | `views/app.py` (first tab), `tcg-dataapp app`, `.streamlit/config.toml` | 7 sets, 1,273 cards, 5,951 prices, 5 captures, 524 cells, 12 of 12 tasks ok |
| 03 | `prompts/03_ranking_and_drilldown.md` | second tab | highest price by set in September led by ME: Ascended Heroes at US$ 1,049.08; a click drills to its 9 rarities |
| 04 | `prompts/04_time_and_accessibility.md` | third tab, accessibility pass, `tests/test_app.py` | dates in UTC; alt text and table view on every figure; 22 tests pass |

## The reference package

```bash
cd tcg_dataapp
python3 -m venv .venv && source .venv/bin/activate
pip install -e '.[dev,app]'
tcg-dataapp run && tcg-dataapp app
pytest                      # 22 passed, without network
```

## The second hour

Each group adds a Streamlit app to the DataApp of the partner, in the same pattern, with `prompts/05_group_dataapp.md`: query functions tested alone, a tab that explains the DataApp, at least two analytical views that answer questions of the partner, one of them with drill-down, the theme of the Inteli palette and dates in UTC.

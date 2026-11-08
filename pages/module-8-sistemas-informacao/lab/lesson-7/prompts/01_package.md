[C] Character
You are a Python engineer who packages data applications. In Lesson 6 the
model of the TCGplayer prices was built by hand in the browser; now it
becomes an installable package that does everything on its own.

[R] Request
Create the skeleton of the package tcg-dataapp in the folder tcg_dataapp/:
1. pyproject.toml (setuptools, src layout, Python >= 3.11): dependencies
   duckdb and py7zr; extra dev with pytest; console script
   tcg-dataapp = tcg_dataapp.cli:main; the SQL files of
   tcg_dataapp.processors as package data.
2. src/tcg_dataapp/ with three empty layers, each a subpackage with a
   docstring that says what it does and what it may import:
   - etls: extraction from TCGplayer and load into db_ingestion;
   - processors: the gold layer and its checks;
   - views: questions and reports read from gold.
3. config.py: a frozen dataclass Settings read from environment variables
   with defaults (TCG_DB_PATH=warehouse/tcg.duckdb, TCG_OUT_DIR=out,
   TCG_BASE_URL=https://tcgcsv.com, TCG_CATEGORY=3, TCG_SETS with the 7
   sets of 2026, TCG_PRICE_DATES with 2026-03-01, 2026-05-01, 2026-07-01,
   2026-09-01 and 2026-11-07, TCG_FROZEN_MONTH=2026-09, TCG_RETRIES=3,
   TCG_RETRY_DELAY=2).
4. cli.py with argparse: --version and the subcommands run, status and
   report, each printing "not implemented" for now; __main__.py so that
   python -m tcg_dataapp works.
5. tests/test_cli.py checking --version; README.md with install and run.

Facts (confirm before use):
- The 7 sets are the groupId 24541, 24587, 24655, 24688, 24722, 24837 and
  24831 of category 3 on tcgcsv.com.
- pip install -e '.[dev]' and pytest must pass in a new virtual env.

[E] Example
[project.scripts]
tcg-dataapp = "tcg_dataapp.cli:main"

[A] Adjustments
- A layer imports only from the layers below it: views -> processors ->
  etls. config is imported by any of them.
- Every date of the project is Unix time in seconds (UTC), as in Lesson 6.
- No code of extraction or SQL yet: this step is only the structure.

[T] Type of output
The files, the tree of the folder and the output of pip install and pytest.

[E] Extras
Show the plan before editing. Record this prompt in docs/prompts.md.
Stop at the end.

[C] Character
You are the same architect. The utility tree and the order of analysis are
in docs/utility_tree.md and docs/scenarios.toml.

[R] Request
For every leaf rated (H,H), (H,M) or (M,H), and then for as many of the
others as time allows, write the quality attribute scenario in six parts
in docs/scenarios.toml:
- source: who or what generates the stimulus;
- stimulus: the event that reaches the system;
- artifact: the part of the DataApp that receives it (a file, a table,
  a task);
- environment: the state of the system when it happens;
- response: what the DataApp must do;
- measure: how the response is measured, with a number or a
  verifiable condition.
Then generate docs/scenarios.md, with one table of six rows per scenario.

[E] Example
source = "tcgcsv.com"
stimulus = "is down during the whole run"
artifact = "pipeline.py and cli.py"
environment = "unattended daily run after a successful run"
response = "the run fails naming the task, skips its dependents and leaves what was published"
measure = "exit code 1; no new row in db_ingestion; out/report.md byte-identical"

[A] Adjustments
- The measure must be checkable by a test: "fast" or "reliable" is not a
  measure; "less than 10 s on 100,000 rows" is.
- When a number of the measure comes from the real data (a share of
  nulls, a time), measure it on the real data first and write the value
  measured next to the limit.
- Keep the six parts short: one line each.

[T] Type of output
docs/scenarios.toml filled, docs/scenarios.md, and the list of the
scenarios that are still empty.

[E] Extras
Show the scenarios before writing. Record this prompt in docs/prompts.md.
Stop at the end.

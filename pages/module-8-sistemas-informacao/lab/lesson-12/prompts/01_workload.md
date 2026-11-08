[C] Character
You are the engineer responsible for the costs of the DataApp tcg-dataapp,
the package of Lesson 7. Before any price is looked up, the workload that
will be paid for must be measured, because every line of a cloud bill is a
quantity of the workload multiplied by a unit price.

[R] Request
1. scripts/measure_run.sh: runs `tcg-dataapp run` once under
   `/usr/bin/time -v` with TCG_DB_PATH and TCG_OUT_DIR in a temporary
   folder, and prints the wall time, the user and system CPU time, the
   peak resident memory (MB), the size of warehouse/tcg.duckdb, the size of
   out/ and the number of files written.
2. docs/workload.md: one table with the measured quantities and the
   quantities that are decided, not measured (runs per month, readers and
   their downloads, egress in GB per month), each one with its origin:
   "measured on <date>", "assumption" or "decision of the group".
3. The bytes downloaded per run: the five price archives of tcgcsv and the
   catalogue (HEAD requests are enough for the archives).

Facts measured on 08/11/2026 (confirm before use):
- wall time 25.6 s (Lesson 7 reference: about 40 s), CPU 10.8 s user and
  1.1 s system, peak memory 392 MB;
- warehouse/tcg.duckdb 1.85 MB, out/ 0.09 MB (report.md and three
  Parquet files);
- downloaded per run: 19.8 MB of archives and 1.8 MB of catalogue.

[E] Example
| quantity            | value  | unit      | origin                 |
|---------------------|--------|-----------|------------------------|
| wall time of a run  | 25.6   | s         | measured on 08/11/2026 |
| runs per month      | 30     | runs      | decision: one per day  |

[A] Adjustments
- Data entering AWS from the internet is not charged; record it anyway,
  because it decides the duration of the run.
- Peak memory, not average, decides the size of the machine.
- Do not round the measures; round only in the conclusions.

[T] Type of output
The script, docs/workload.md and the output of one measured run.

[E] Extras
Show the plan before editing. Record this prompt in docs/prompts.md.
Stop at the end.

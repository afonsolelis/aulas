[C] Character
You are a data engineer of the group, working in the repository of the
DataApp of the partner, whose gold layer lives in the ClickHouse of the
class (shrek2) or in the warehouse of the package of the group.

[R] Request
Add to the DataApp of the group a Streamlit app in the views layer, in
the pattern of tcg-dataapp 0.5.0:
1. A module of pure query functions over a read-only connection, reading
   only the gold layer, the marts, the reports and the run log.
2. A first tab that explains the DataApp: the size of the model, the last
   run and the lineage from the landing table to the reports.
3. At least two analytical views that answer questions of the partner,
   each one opened by a sentence with the number that matters, with a
   table view, an alt text and the SQL behind it. One of them must allow
   drill-down on a hierarchy of the model.
4. The theme of the Inteli palette in .streamlit/config.toml, and dates
   shown in UTC from the Unix time.
5. Tests of the query functions without network, and one AppTest.

[E] Example
"In October the partner sold 1,240 units in São Paulo, 38% of the
month" above a ranked bar chart by city, with drill-down city › store.

[A] Adjustments
- The credentials of ClickHouse come from environment variables and never
  enter the repository.
- Every chart has one y axis, one accent colour and a written conclusion.
- No question of the partner is answered by a chart that does not show it.

[T] Type of output
The files, the command to run the app, a screenshot of each tab and the
output of the tests.

[E] Extras
Show the plan before editing. Stop at the end.

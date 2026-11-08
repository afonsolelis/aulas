[C] Character
You are the same engineer, now also responsible for how the DataApp
explains itself. The audience is technical: the group, the professor and
the partner who will maintain the pipeline.

[R] Request
Create the Streamlit app and its first tab, the technical infographic.
1. views/app.py, started by a new command tcg-dataapp app [--port]
   [--headless], which runs `python -m streamlit run` on the file of the
   package. Streamlit and Altair go in an optional extra
   (pip install -e '.[app]').
2. .streamlit/config.toml with the theme of the Inteli design system:
   primaryColor #2f8f78, textColor #2e2640, secondaryBackgroundColor
   #e6eaeb, borderColor #caced6, Inter and JetBrains Mono, radius
   0.25rem, gatherUsageStats false.
3. At the top, a title, the version, the warehouse, the period of the
   captures in UTC and one sentence built from headline(con).
4. Tab "Technical infographic":
   - five st.metric: sets, cards, prices of the fact, captures, cells;
   - one line on the last run (tasks ok, failed attempts, seconds);
   - the DAG of the last run with st.graphviz_chart, the status and the
     seconds written inside each box;
   - the lineage grouped in three clusters (ETLs, Processors, Views), each
     node with its rows and kind, tables drawn as cylinders;
   - a "Table view" expander under each figure, and an alt text on each.

Facts measured on 08/11/2026 (confirm before use):
- Streamlit 1.67.0, Altair 6.3.0, DuckDB 2.0.0, Python 3.12.
- On the warehouse of the rehearsal the infographic shows 7 sets, 1,273
  cards, 5,951 prices, 5 captures, 524 cells and 12 of 12 tasks ok.

[E] Example
"extract_products\nok · 7 s" inside the box of the task, with the border
in #2f8f78 when ok and in #2e2640 otherwise, so the status never depends
on the colour alone.

[A] Adjustments
- The app opens the warehouse read-only and only through views/dashboard.py.
- No KPI in colour, no gauge, no 3D: numbers in text, figures in the ink
  and the greys of the palette, one accent.
- When the warehouse does not exist, the app says to run tcg-dataapp run
  and stops.

[T] Type of output
The files and a screenshot of the first tab, with the command used.

[E] Extras
Show the plan before editing. Stop at the end.

[C] Character
You are the same engineer. The second tab repeats, in Streamlit, the
explorer of the lab of Lesson 6: ranked bars over the frozen report or the
live view, with drill-down and roll-up on the hierarchy set › rarity ›
card.

[R] Request
Tab "Ranking and drill-down" in views/app.py:
1. Controls in one row: source (frozen report of the last frozen month or
   live view), measure (highest price, average price, market value,
   number of prices) and four checkboxes to group by set, rarity, card and
   variant.
2. Horizontal bars ranked from the largest value, in #2f8f78, with the
   value written at the end of each bar and a tooltip; height of the
   chart proportional to the number of groups.
3. Drill-down: a click on a bar (st.altair_chart with on_select="rerun"
   and a point selection) keeps the values of the clicked bar as filters
   and moves the grouping one level down the hierarchy. A row of buttons
   (All sets, Set: ..., Rarity: ...) rolls up.
4. Under the chart: the number of groups, the source and its capture in
   UTC, the result of cube_check in one sentence, a "Table view" expander
   and an expander with the SQL and its parameters.

Facts measured on 08/11/2026 (confirm before use):
- Frozen report 2026-09, highest price by set: ME: Ascended Heroes
  1,049.08, ME: 30th Celebration 1,000.00, ME05: Pitch Black 198.62;
  5 groups, grouping_id 3, agrees with the cube.
- Drill into ME: Ascended Heroes: 9 rarities, the first Special
  Illustration Rare at 1,049.08, grouping_id 1, 9 cells, agrees.

[E] Example
Click on "ME: Ascended Heroes" with dims = [set_name]:
path = [("set_name", "ME: Ascended Heroes")], dims = [rarity].

[A] Adjustments
- A widget state cannot change after the widget exists: store the click
  as a pending change, call st.rerun() and apply it at the top of the tab.
- The key of the chart includes the depth of the path, so the selection of
  the previous level does not fire again.
- One axis, one colour, no legend for a single series.

[T] Type of output
The changes and two screenshots: the top level and one drill-down.

[E] Extras
Show the plan before editing. Stop at the end.

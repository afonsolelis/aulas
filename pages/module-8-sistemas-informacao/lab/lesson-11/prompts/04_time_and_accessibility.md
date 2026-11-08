[C] Character
You are the same engineer, reviewing the app for the person who cannot
see a colour, reads with a screen reader or opens it on a Brazilian
laptop where the clock is three hours behind UTC.

[R] Request
1. Tab "Prices over time": a line chart of price_history, either the
   market value of each set or the five most valuable cards of one set.
   One series is highlighted in #2f8f78 (selectbox, the largest by
   default) with points, a tooltip and its name written at the end of the
   line; the others stay as thin lines in #caced6, as context. Below the
   chart, one sentence with the first and the last value of the
   highlighted series.
2. Dates: the warehouse keeps Unix time; the app converts it only when
   drawing, with pd.to_datetime(unit="s", utc=True), an Altair scale of
   type "utc" and the format %d/%m/%Y. The tooltip shows the Unix time too.
3. An accessibility pass on the three tabs: alt text on every chart and
   graph, a table view under every figure, the status written in text,
   no meaning carried by colour alone, contrast of the text against the
   background, and no chart with two y axes.
4. tests/test_app.py with streamlit.testing.v1.AppTest over the fake
   warehouse (skipped when Streamlit is not installed): the app renders
   without exception, the metrics show 2 sets, 3 cards, 6 prices and
   2 captures, and checking "Rarity" reruns without error.

Facts measured on 08/11/2026 (confirm before use):
- ME: 30th Celebration went from US$ 1,349.93 to US$ 12,403.41 of market
  value between 01/09/2026 and 07/11/2026; on 07/11/2026 it holds 65.3%
  of the value of the seven sets, and its Mew - R/RGB (Holofoil) is the
  most valuable card at US$ 4,492.45.
- pytest: 22 tests pass in about 10 s, without network.

[E] Example
A capture at 1788220800 is 01/09/2026 00:00 UTC; drawn in local time in
São Paulo it would read 31/08/2026 21:00 and fall on the wrong day.

[A] Adjustments
- No rainbow of seven colours for seven sets: highlight and context.
- Write the sentence before choosing the chart: the chart supports it.

[T] Type of output
The changes, a screenshot of the tab and the output of pytest.

[E] Extras
Show the plan before editing. Stop at the end.

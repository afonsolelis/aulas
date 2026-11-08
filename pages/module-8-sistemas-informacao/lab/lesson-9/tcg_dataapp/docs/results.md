# Results read back into the tree

Step 06 of the ATAM. The scenarios were first run against the package of Lesson 7 (version 0.1.0), unchanged, and then against version 0.3.0, which closes the risks that the first run exposed. Measured on 08/11/2026 with Python 3.12.3, DuckDB 2.0.0 and pytest.

## First run, version 0.1.0

24 of the 29 tests passed; 5 failed, in three scenarios.

| Scenario | Result | What the failure showed |
|---|---|---|
| S03 (H,M) every price reaches the model | FAIL 0/2 | A price of a product that is not in the catalogue disappears in the inner join of `gold.fact_price`, and no check notices. The check `fact_without_set` of 0.1.0 could never fail, because the fact already joins `gold.dim_set`. |
| S04 (H,H) schema drift | FAIL 1/2 | When the source renames `marketPrice`, every price of the capture becomes null, the cube drops them and the run ends OK, publishing a report without that capture. A new field, on the other hand, changes nothing (TC04.2 passed). |
| S11 (M,L) stale data | FAIL 0/2 | No command or check reports the age of the last capture; runs that keep succeeding over old data are indistinguishable from good runs. |

## Second run, version 0.3.0

29 of 29 tests passed without the network, in 8.8 s on an idle machine and in 12.5 to 17.3 s while other processes loaded it. The first version of S13 set the limit at 15 s, which the loaded machine exceeded; the environment of a performance measure is part of the scenario, and the limit was set at 30 s on a student laptop. The traceability table is in `traceability.md`.

| Change | Scenario |
|---|---|
| `check_gold` compares, capture by capture, the prices of the landing table with the prices of the fact, and stops above 1 % (`prices_not_in_fact` in its result) | S03 |
| `check_gold` stops when more than 10 % of the market prices of a capture are null | S04 |
| `check_freshness` and the command `tcg-dataapp freshness --max-age-days 2`, with exit code 1 when the data is stale | S11 |
| the vacuous check `fact_without_set` was removed | S03 |

The real run of 0.3.0 over tcgcsv, on 08/11/2026, ended with the 12 tasks ok in 25 s: 5,951 prices, `prices_not_in_fact` 0, `max_null_price_share` 0.017 (1.7 %, in the capture of 2026-09-01), 524 cells, 1,226 rows frozen in September. The new gates therefore do not stop the real data. S12 processed 100,000 synthetic prices in 1.1 to 1.5 s, against a budget of 10 s.

## Risks, non-risks, sensitivity points and tradeoffs

| Kind | Finding | Scenarios |
|---|---|---|
| Risk (closed in 0.3.0) | prices lost silently in the join of the fact | S03 |
| Risk (closed in 0.3.0) | a renamed field of the source publishes a report without prices | S04 |
| Risk (closed in 0.3.0) | stale data undetected | S11 |
| Risk (open) | `check_freshness` exists but nothing calls it on schedule; Lesson 10 turns it into a metric with an alert | S11 |
| Risk (open) | the contract of the marts covers names and types, not the meaning of a column | S10 |
| Non-risk | a transient failure is absorbed by one retry, with the same rows as a clean run | S06 |
| Non-risk | a frozen report keeps its rows when late prices of its month arrive | S08 |
| Non-risk | a new field in the source changes no number, because the JSON is read by name | S04 |
| Sensitivity point | the timestamp of noon UTC decides what is the same batch; another hour breaks S01 | S01 |
| Sensitivity point | the inner joins of `gold.fact_price` decide which prices reach the model | S03 |
| Sensitivity point | the limits of 1 % and 10 % of the quality gate | S03, S04 |
| Tradeoff | correctness against availability: a stricter gate publishes fewer wrong numbers and more failed runs; the limits were set above the real maxima (0 % and 1.7 %) | S02, S03, S04 |
| Tradeoff | the gold layer as views keeps the model always current (S01) and makes every report recompute it, which S12 bounds | S01, S12 |

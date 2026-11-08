[C] Character
You are the architect again. The tests ran and the results are in
out/traceability.json and in the output of pytest.

[R] Request
1. Write docs/results.md with the first run: passed and failed tests,
   and, for each failed scenario, what the failure shows about the
   architecture.
2. Classify the findings in a table: risks (a decision that may prevent
   a response), non-risks (a decision that the tests showed to be sound),
   sensitivity points (a parameter or decision on which a response
   depends) and tradeoffs (a decision that improves one attribute and
   harms another). Each finding cites its scenarios.
3. For each risk of a scenario rated H in importance, propose the smallest
   change of the code that closes it; implement the ones that fit in the
   time of the session, run pytest again and record the second run.
4. Print the final utility tree with python tools/traceability.py and
   write docs/traceability.md with python tools/traceability.py --markdown.

[E] Example
| Sensitivity point | the timestamp of noon UTC decides what is the
same batch; another hour breaks S01 | S01 |

[A] Adjustments
- A risk that was not closed stays in the table as open, with the reason.
- Do not remove a scenario because its test failed.
- Every number of docs/results.md comes from a run of this session.

[T] Type of output
docs/results.md, docs/traceability.md, the final tree and the output of
the second run of pytest.

[E] Extras
Show the classification before writing. Record this prompt in
docs/prompts.md. Stop at the end.

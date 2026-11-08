[C] Character
You are a test engineer who derives test cases from ATAM scenarios. The
scenarios are in docs/scenarios.toml.

[R] Request
1. For each scenario with six parts, derive one to three test cases
   (TC01.1, TC01.2, ...). A test case fixes the stimulus as data the test
   can produce, the environment as a fixture, and the measure as
   assertions. Add the list to the field cases of the scenario.
2. Write docs/test_cases.md: test case, scenario, what it checks, and the
   name of the test function that will implement it.
3. Say which level each test case is: unit (one function), integration
   (one layer with a real DuckDB) or end to end (the whole pipeline with
   a fake source).
4. When the measure is a contract (names and types of an output),
   write the contract as a file in docs/contracts/.

[E] Example
| TC04.1 | S04 | a renamed price field stops the run |
tests/scenarios/test_correctness.py::test_s04_renamed_price_field_stops_the_run |

[A] Adjustments
- Every test case traces to exactly one scenario; a test case without a
  scenario is not written.
- No test case calls the network: the source is a fake client, as in
  tests/conftest.py of the reference package.
- Do not write the tests yet.

[T] Type of output
docs/test_cases.md, the field cases of docs/scenarios.toml and the
contracts, if any.

[E] Extras
Show the table before writing. Record this prompt in docs/prompts.md.
Stop at the end.

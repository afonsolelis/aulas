[C] Character
You are the same test engineer. The test cases are in docs/test_cases.md.

[R] Request
1. Copy into tests/conftest.py the traceability plugin of the reference
   package (lab/lesson-9/tcg_dataapp/tests/conftest.py, section
   "traceability"), the fixture that blocks the network, and adapt the
   fake source to the data of the DataApp.
2. Register the marker in pyproject.toml:
   markers = ["scenario(id): the ATAM scenario of docs/scenarios.toml
   that the test covers"] and addopts = "--strict-markers".
3. Implement each test case as one function in tests/scenarios/, marked
   with @pytest.mark.scenario("Sxx") and with the id of the test case as
   the first line of its docstring, following Arrange, Act, Assert.
4. Run pytest against the code AS IT IS, without fixing anything, and
   keep the output: the passed and failed tests and the table "ATAM
   traceability".
5. Run pytest --junitxml=out/junit.xml and
   python tools/traceability.py (copied from the reference).

[E] Example
@pytest.mark.scenario("S04")
def test_s04_renamed_price_field_stops_the_run(settings):
    """TC04.1 a renamed price field stops the run"""
    prices = rename(PRICES, "marketPrice", "market_price")            # Arrange
    ctx = pipeline.run(settings, client=FakeClient(prices=prices))   # Act
    assert "check_quality" in ctx.results["_failed"]                 # Assert

[A] Adjustments
- A failing test is a result, not a bug of the test: do not change the
  assertion to make it pass, and do not fix the DataApp in this step.
- Use fixtures for the environment and parametrize for variations of the
  same stimulus.
- The whole suite must run without the network.

[T] Type of output
The tests, the output of pytest with the traceability table, and the
utility tree printed by tools/traceability.py.

[E] Extras
Show the plan before editing. Record this prompt in docs/prompts.md.
Stop at the end.

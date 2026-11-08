# Test cases

Every test case comes from one scenario and is one test function, marked with the id of the scenario. Run one scenario with `pytest --scenario S04`. Generated from the tests.

| Test case | Scenario | What it checks | Test function |
|---|---|---|---|
| TC01.1 | S01 | second run of the archive dates keeps the fact | `tests/scenarios/test_correctness.py::test_s01_second_run_keeps_the_fact` |
| TC01.2 | S01 | two runs with the prices of today keep one price per product and day | `tests/scenarios/test_correctness.py::test_s01_two_runs_today_keep_one_price_per_product` |
| TC02.1 | S02 | a broken grain stops the run and keeps the previous report | `tests/scenarios/test_correctness.py::test_s02_broken_grain_stops_the_run_and_keeps_the_report` |
| TC02.2 | S02 | the quality gate is attempted once | `tests/scenarios/test_correctness.py::test_s02_the_quality_gate_is_attempted_once` |
| TC03.1 | S03 | prices without product are counted | `tests/scenarios/test_correctness.py::test_s03_prices_without_product_are_counted` |
| TC03.2 | S03 | above 1 % of a capture the run stops | `tests/scenarios/test_correctness.py::test_s03_above_one_percent_the_run_stops` |
| TC04.1 | S04 | a renamed price field stops the run | `tests/scenarios/test_correctness.py::test_s04_renamed_price_field_stops_the_run` |
| TC04.2 | S04 | a new field changes nothing | `tests/scenarios/test_correctness.py::test_s04_new_field_changes_nothing` |
| TC05.1 | S05 | two captures of a month freeze only the last | `tests/scenarios/test_correctness.py::test_s05_two_captures_of_a_month_freeze_only_the_last` |
| TC06.1 | S06 | one failure is absorbed by a retry | `tests/scenarios/test_reliability.py::test_s06_one_failure_is_absorbed_by_a_retry` |
| TC07.1 | S07 | the run fails and publishes nothing | `tests/scenarios/test_reliability.py::test_s07_source_down_publishes_nothing` |
| TC07.2 | S07 | the command returns exit code 1 | `tests/scenarios/test_reliability.py::test_s07_the_command_returns_exit_code_1` |
| TC08.1 | S08 | late prices of a frozen month do not change it | `tests/scenarios/test_auditability.py::test_s08_late_prices_of_a_frozen_month_do_not_change_it` |
| TC09.1 | S09 | the log of a run with a retry is complete | `tests/scenarios/test_auditability.py::test_s09_the_log_of_a_run_with_a_retry_is_complete` |
| TC10.1 | S10 | the Parquet files follow the contract | `tests/scenarios/test_interoperability.py::test_s10_the_parquet_files_follow_the_contract` |
| TC11.1 | S11 | fresh data passes | `tests/scenarios/test_timeliness.py::test_s11_fresh_data_passes` |
| TC11.2 | S11 | data older than 2 days fails the check | `tests/scenarios/test_timeliness.py::test_s11_data_older_than_two_days_fails` |
| TC12.1 | S12 | 100,000 prices processed within the budget | `tests/scenarios/test_performance.py::test_s12_processing_fits_the_budget` |
| TC13.1 | S13 | the suite cannot open a connection | `tests/scenarios/test_testability_and_modifiability.py::test_s13_the_suite_cannot_open_a_connection` |
| TC14.1 | S14 | TCG_SETS and TCG_PRICE_DATES drive the run | `tests/scenarios/test_testability_and_modifiability.py::test_s14_sets_and_dates_come_from_the_environment` |

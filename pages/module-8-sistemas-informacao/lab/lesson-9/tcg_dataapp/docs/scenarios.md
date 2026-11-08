# Quality attribute scenarios

Each leaf of the utility tree is a scenario in six parts (Bass, Clements and Kazman, 2021). The source of truth is `scenarios.toml`; this file is generated from it.

## S01 · Correctness · Idempotent runs (H,M)

| Part | |
|---|---|
| Source | the scheduler |
| Stimulus | runs the pipeline a second time on the same day, with the prices of today |
| Artifact | db_ingestion and gold.fact_price |
| Environment | normal operation; catalogue and prices unchanged since the first run |
| Response | every batch is replaced, the dimensions keep the last version of each member |
| Response measure | the fact has the same rows as after the first run, and rows = keys of the grain |
| Business drivers | BD1, BD4 |

## S02 · Correctness · No wrong number published (H,M)

| Part | |
|---|---|
| Source | a defect in an extraction |
| Stimulus | loads the prices of a day twice, with two timestamps |
| Artifact | processors/quality.py and the tasks that publish |
| Environment | a run after a successful run |
| Response | check_quality fails without retry and every task that publishes is skipped |
| Response measure | the run ends FAILED naming check_quality; out/report.md is byte-identical to the previous one |
| Business drivers | BD1 |

## S03 · Correctness · Every price reaches the model (H,M)

| Part | |
|---|---|
| Source | TCGplayer through tcgcsv |
| Stimulus | publishes prices of a product that is not in the catalogue captured by the run |
| Artifact | gold.fact_price (inner join with dim_product) |
| Environment | normal operation |
| Response | the run measures the prices of the landing table that did not reach the fact and stops above a limit |
| Response measure | the count is in the result of check_quality; more than 1 % of the prices of a capture stops the run |
| Business drivers | BD1, BD3 |

## S04 · Correctness · Schema drift of the source (H,H)

| Part | |
|---|---|
| Source | TCGplayer through tcgcsv |
| Stimulus | renames the field marketPrice in the prices of one capture, or adds a new field |
| Artifact | db_ingestion (JSON as it arrived) and gold.fact_price |
| Environment | normal operation; nobody is told about the change |
| Response | a renamed field stops the run at the quality gate; a new field is ignored |
| Response measure | more than 10 % of null market prices in a capture stops the run (real maximum 1.7 %); a new field changes no number |
| Business drivers | BD1, BD3 |

## S05 · Correctness · Semi-additive measure (H,H)

| Part | |
|---|---|
| Source | the daily runs |
| Stimulus | bring a second capture of a month before the month is frozen |
| Artifact | processors/gold.py (freeze_month) |
| Environment | a month with two captures |
| Response | the frozen report takes only the last capture of the month |
| Response measure | each card appears once in the frozen report, with the price of the last capture |
| Business drivers | BD1, BD2 |

## S06 · Reliability · Transient failure of the source (H,L)

| Part | |
|---|---|
| Source | tcgcsv.com |
| Stimulus | fails the first request of the run |
| Artifact | pipeline.py (retries) |
| Environment | unattended daily run |
| Response | the task is retried with a pause and the run ends OK |
| Response measure | one failed and one successful attempt in ops.pipeline_runs; the same rows as a run without failure |
| Business drivers | BD3, BD4 |

## S07 · Reliability · Source down for the whole run (H,M)

| Part | |
|---|---|
| Source | tcgcsv.com |
| Stimulus | is down during the whole run |
| Artifact | pipeline.py and cli.py |
| Environment | unattended daily run after a successful run |
| Response | the run fails naming the task, skips its dependents and leaves what was published |
| Response measure | exit code 1; no new row in db_ingestion; out/report.md byte-identical |
| Business drivers | BD1, BD3 |

## S08 · Auditability · Frozen report never changes (H,L)

| Part | |
|---|---|
| Source | a late capture |
| Stimulus | brings new prices of a month that is already frozen |
| Artifact | report.mv_card_price_<month> |
| Environment | after the month was frozen |
| Response | the frozen table is kept; the live views show the new prices |
| Response measure | the rows of the frozen table are identical before and after |
| Business drivers | BD2 |

## S09 · Auditability · Every attempt is logged (M,L)

| Part | |
|---|---|
| Source | the operator |
| Stimulus | audits a run that had a retry |
| Artifact | ops.pipeline_runs |
| Environment | after the run |
| Response | every attempt of every task is one row, in Unix time |
| Response measure | one success per task; started_at <= ended_at, both BIGINT; status in success, failed, skipped |
| Business drivers | BD4 |

## S10 · Interoperability · Contract of the marts (M,L)

| Part | |
|---|---|
| Source | a dashboard of the partner |
| Stimulus | reads out/marts/*.parquet after a change in the model |
| Artifact | views/report.py (export_marts) and docs/contracts/marts.json |
| Environment | a new version of the package |
| Response | the files keep the published names and types of the columns |
| Response measure | the schema of every Parquet file equals the contract; any difference fails the build |
| Business drivers | BD1 |

## S11 · Timeliness · Stale data is detected (M,L)

| Part | |
|---|---|
| Source | tcgcsv.com |
| Stimulus | stops publishing new prices while the runs keep succeeding |
| Artifact | the last capture of gold.dim_date |
| Environment | unattended daily runs |
| Response | tcg-dataapp freshness reports the age of the last capture and fails when it is too old |
| Response measure | exit code 1 when the last capture is older than 2 days, detected at the first check after that |
| Business drivers | BD1, BD3 |

## S12 · Performance · Processing budget (M,M)

| Part | |
|---|---|
| Source | a year of daily captures |
| Stimulus | the landing table grows to 100,000 prices |
| Artifact | processors and views |
| Environment | a student laptop |
| Response | gold, checks, frozen reports, marts and report run on the whole table |
| Response measure | less than 10 s from build_gold to write_report |
| Business drivers | BD4 |

## S13 · Testability · Tests without network (M,L)

| Part | |
|---|---|
| Source | a developer |
| Stimulus | runs the whole suite on a laptop without network |
| Artifact | tests/ |
| Environment | offline; the network is blocked by the suite |
| Response | every test runs against the fake source |
| Response measure | no connection opened; the suite ends in less than 30 s on a student laptop |
| Business drivers | BD5 |

## S14 · Modifiability · Sets by configuration (L,L)

| Part | |
|---|---|
| Source | the team |
| Stimulus | changes the list of sets and dates |
| Artifact | config.py |
| Environment | deploy time |
| Response | the run follows TCG_SETS and TCG_PRICE_DATES without a change in the code |
| Response measure | zero lines of code changed; only the configured sets reach gold.dim_set |
| Business drivers | BD5 |

| Scenario | Priority | Attribute · refinement | Test cases | Result |
|---|---|---|---|---|
| S04 | (H,H) | Correctness · Schema drift of the source | TC04.1 a renamed price field stops the run<br>TC04.2 a new field changes nothing | PASS 2/2 |
| S05 | (H,H) | Correctness · Semi-additive measure | TC05.1 two captures of a month freeze only the last | PASS 1/1 |
| S01 | (H,M) | Correctness · Idempotent runs | TC01.1 second run of the archive dates keeps the fact<br>TC01.2 two runs with the prices of today keep one price per product and day | PASS 2/2 |
| S02 | (H,M) | Correctness · No wrong number published | TC02.1 a broken grain stops the run and keeps the previous report<br>TC02.2 the quality gate is attempted once | PASS 2/2 |
| S03 | (H,M) | Correctness · Every price reaches the model | TC03.1 prices without product are counted<br>TC03.2 above 1 % of a capture the run stops | PASS 2/2 |
| S07 | (H,M) | Reliability · Source down for the whole run | TC07.1 the run fails and publishes nothing<br>TC07.2 the command returns exit code 1 | PASS 2/2 |
| S06 | (H,L) | Reliability · Transient failure of the source | TC06.1 one failure is absorbed by a retry | PASS 1/1 |
| S08 | (H,L) | Auditability · Frozen report never changes | TC08.1 late prices of a frozen month do not change it | PASS 1/1 |
| S12 | (M,M) | Performance · Processing budget | TC12.1 100,000 prices processed within the budget | PASS 1/1 |
| S09 | (M,L) | Auditability · Every attempt is logged | TC09.1 the log of a run with a retry is complete | PASS 1/1 |
| S10 | (M,L) | Interoperability · Contract of the marts | TC10.1 the Parquet files follow the contract | PASS 1/1 |
| S11 | (M,L) | Timeliness · Stale data is detected | TC11.1 fresh data passes<br>TC11.2 data older than 2 days fails the check | PASS 2/2 |
| S13 | (M,L) | Testability · Tests without network | TC13.1 the suite cannot open a connection | PASS 1/1 |
| S14 | (L,L) | Modifiability · Sets by configuration | TC14.1 TCG_SETS and TCG_PRICE_DATES drive the run | PASS 1/1 |

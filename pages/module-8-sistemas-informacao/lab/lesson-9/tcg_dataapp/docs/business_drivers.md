# Business drivers and quality attributes

Step 01 of the ATAM: what the DataApp exists for, and which qualities follow from it. The scenarios of `scenarios.toml` cite these drivers by their codes.

## Business drivers

| Code | Driver | Consequence for the architecture |
|---|---|---|
| BD1 | Collectors and analysts decide purchases from the answers of the report; a wrong number costs more than a late one. | The run must stop before it publishes a number it cannot vouch for. |
| BD2 | The frozen monthly report is cited after the month ends, in the meetings with the partner. | A frozen report is never rebuilt, whatever arrives later. |
| BD3 | The source is a free public mirror (tcgcsv.com) without a service level, which can fail, lag or change its fields without notice. | Failures of the source are expected events, handled by retries, gates and checks of freshness. |
| BD4 | The DataApp runs every day without a person, on modest hardware and without a budget. | Each run is idempotent and logged, and the processing fits a small machine. |
| BD5 | The team changes the model every sprint. | The tests run in seconds, without the network, and the configuration changes without code. |

## Quality attributes

| Attribute | Meaning for this DataApp | Drivers |
|---|---|---|
| Correctness | the published numbers follow the model: grain, semi-additivity, no lost price | BD1, BD2 |
| Reliability | the run survives the failures of the source, or fails without damage | BD3, BD4 |
| Auditability | what was published and what ran can be reconstructed afterwards | BD2, BD4 |
| Interoperability | the marts keep the contract that the dashboards read | BD1 |
| Timeliness | data that stopped arriving is detected | BD1, BD3 |
| Performance | a year of captures is processed on a laptop | BD4 |
| Testability | the suite runs offline and fast | BD5 |
| Modifiability | sets and dates change by configuration | BD5 |

# Tradeline bugs pack · Workshop 3 · Testing the Configuration Space

Tradeline is a fictional global B2B ordering marketplace. Every name, number and file in this pack is synthetic and was written for teaching.

The pack contains three bugs that reached production in the last quarter. Each folder holds the same four kinds of evidence:

| File | What it contains |
|---|---|
| `incident.md` | What users and operations saw, timeline and the configuration of the affected tenants |
| `pr-history.md` | The pull requests that touched the affected code in the weeks before the incident, with diff excerpts |
| `coverage.txt` | Excerpt of the line and branch coverage report of the service at the time of the incident |
| `mutation-report.txt` | Surviving mutants reported by the mutation testing run of the same build |

The SonarQube configuration of the repository at the time of the incidents is in `sonar-project.properties`, at the root of the pack. Read it together with the coverage reports.

## What each group delivers in Part 1 (15 minutes)

For each bug, fill one row of the table below.

| Bug | Root cause (one sentence) | Would an adequate unit test have prevented it? Why? | Preventive test (layer and what it asserts) | Impact on the retailer | Impact on operations |
|---|---|---|---|---|---|
| BUG-1 | | | | | |
| BUG-2 | | | | | |
| BUG-3 | | | | | |

The answer to the second column is yes, no or partly, followed by the reason. A test layer is one of: unit, property, contract, tenant isolation, migration, end-to-end, or a rollout check.

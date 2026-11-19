# Workshop 3 templates · Testing the Configuration Space

## Template 1 · Root cause table (Part 1, 15 minutes)

| Bug | Root cause | Would an adequate unit test have prevented it? Why? | Preventive test (layer and assertion) | Impact on the retailer | Impact on operations |
|---|---|---|---|---|---|
| BUG-1 | | | | | |
| BUG-2 | | | | | |
| BUG-3 | | | | | |

## Template 2 · Configuration selection (Part 2)

Size of the space: ______ (show the product)

Pairwise set used: ______ configurations (from `pairwise-output.csv` or from your own tool)

Risk-based configurations added:

| Config id | tier | region | integration | data_mode | credit_limit | loyalty_points | scheduled_delivery | split_payment | Why it was added (evidence) |
|---|---|---|---|---|---|---|---|---|---|
| RB-01 | | | | | | | | | |
| RB-02 | | | | | | | | | |
| RB-03 | | | | | | | | | |

Factors treated as entitlement (permanent) and factors treated as release flag (temporary): ______

## Template 3 · Test portfolio

| Layer | What it covers in this product | Example test | Runs where (PR, merge, nightly, ring) | Replaces which end-to-end tests |
|---|---|---|---|---|
| Unit | | | | |
| Property | | | | |
| Contract | | | | |
| Tenant isolation | | | | |
| Migration | | | | |
| End-to-end | | | | |

AI-generated tests reviewed: which were kept, which were discarded and why.

## Template 4 · Compatibility Matrix

| Producer version | Consumer | v1 contract | v2 contract | Schema version | Supported until | Deprecation signal |
|---|---|---|---|---|---|---|
| | | | | | | |

## Template 5 · Rollout Plan

| Ring | Who (stamp, tier, cohort, tenants) | Entry criterion | Automatic verification (cohort metric) | Stop criterion (threshold, time) | Rollback action | Duration |
|---|---|---|---|---|---|---|
| 0 | | | | | | |
| 1 | | | | | | |
| 2 | | | | | | |
| 3 | | | | | | |

Production readiness criterion, stated so that someone outside the team can verify it: ______

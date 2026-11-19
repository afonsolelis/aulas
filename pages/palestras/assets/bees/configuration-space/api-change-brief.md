# Breaking change brief · Orders API v1 to v2

Tradeline is a fictional B2B ordering marketplace. The consumers, numbers and dates below are synthetic and were written for Workshop 3 of the BEES Functional Trainings.

## The change

The `POST /v1/orders` and `GET /v1/orders/{id}` endpoints are used by distributor ERPs, by the ERP connector and by partner systems. The orders team needs to release `v2`, which changes two fields in a way that is not backward compatible.

| Field in v1 | Field in v2 | Why it changes |
|---|---|---|
| `total_amount`: number in major units (`1500.5`) | `amount`: object `{ "value_minor": 150050, "currency": "MXN" }` | Floating-point amounts caused rounding differences in reconciliation; currency was implicit in the tenant |
| `delivery_window`: string `"2026-09-03T08:00/10:00"` | `delivery_slot`: object `{ "start": "...", "end": "...", "slot_id": "..." }` | Slots are now reserved entities with an identifier |
| (absent) | `payment_parts`: list of `{ "method", "value_minor" }` | Split payment needs the parts to be visible to the distributor |

The database stores amounts in minor units already. The v1 serializer converts them to major units on the way out.

## Consumers known today

| Consumer | Region stamps | Integration | Share of API calls | Can upgrade on its own? | Notes |
|---|---|---|---|---|---|
| ERP connector (Tradeline-owned) | all | erp-connector | 58% | yes, same release train | Batch every 15 min and webhooks |
| Distributor A, in-house ERP | mx-central | orders-api | 14% | yes, with 6 weeks notice | Largest distributor in Mexico |
| Distributor B, packaged ERP | br-south | orders-api | 9% | only in the vendor's quarterly release | Fiscal invoice reconciliation depends on `total_amount` |
| Distributor C, in-house ERP | co-andes | orders-api | 6% | yes, with 4 weeks notice | |
| Partner analytics platform | all | orders-api | 8% | yes, with 8 weeks notice | Read only (`GET`) |
| 37 small integrators | mx-central, co-andes, za-north | orders-api | 5% | unknown | 11 have not called the API in 90 days |

## Constraints

- The Brazilian fiscal invoice must keep showing the same total as the order during the whole transition.
- Dedicated-silo tenants are migrated in their own maintenance window, after the shared-pool tenants of the same stamp.
- The release train visits the stamps in this order each week: za-north, co-andes, mx-central, br-south.
- Rollback of the application must be possible at every step without restoring the database.

## What the rollout plan must contain

1. The compatibility window: how long v1 and v2 coexist, and what decides the end of v1.
2. The rings: which tenants, stamps or cohorts receive v2 first, and in which order.
3. For each ring, the automatic verification and the stop criteria (metric, threshold, observation time) measured on the cohort and not only globally.
4. The rollback criterion, verifiable by someone who did not write the plan.
5. The schema strategy that keeps old and new application versions working during the deployment.
6. The deprecation signal sent to consumers (headers, notices, dates).

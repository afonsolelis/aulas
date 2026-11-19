# Canonical Metric Spec

Tradeline telemetry harmonisation lab · BEES Functional Trainings · Data & Analytics, Workshop 1.
Tradeline is a fictional company. Fill one spec per metric. Write "unknown" instead of guessing.

## 1. Identification

| Field | Value |
|---|---|
| Metric name | |
| Version | 1.0 |
| Owner (team and person) | |
| Business question it answers | |
| Business indicator it feeds (for example, revenue per completed order) | |

## 2. Definition

- Event or state that counts:
- Events or states that never count:
- Moment of attribution (which timestamp, in which time zone):
- Monetary basis (gross, net of discount, tax treatment) and currency conversion rule:

## 3. Grain

One row of the gold table represents:

## 4. Required dimensions (conformed)

| Dimension | Source | Conformed key | Notes |
|---|---|---|---|
| Market | | | |
| Tenant | | | |
| Service model | | | |
| Retailer | | | |
| Business date (local) | | | |
| App or configuration version | | | |
| Feature state or experiment exposure | | | |

## 5. Local extensions

Differences that are preserved as documented attributes instead of being removed by standardisation.

| Market | Local rule | Attribute that records it | Why it is preserved |
|---|---|---|---|
| | | | |

## 6. Expected quality

| Check | Rule | Action on failure |
|---|---|---|
| Uniqueness | | |
| Completeness | | |
| Freshness | | |
| Reconciliation with local reports | | |

## 7. Point of calculation and orchestration

- Gold table where the metric is calculated (single point):
- Upstream tables and DAGs:
- Downstream consumers:
- Reprocessing and backfill rule (window for late events):
- Delivery deadline (UTC):

## 8. Reconciliation record

| Market | Month | Local report | Canonical value | Difference | Explained by |
|---|---|---|---|---|---|
| | | | | | |

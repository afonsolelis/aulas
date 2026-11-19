# BUG-2 · Distributor ERPs receive invoices with the wrong amount

Severity: SEV-1 · Duration: 9 days until detection, 2 more days until fix · Region stamps: mx-central, br-south

## What was observed
Three large distributors reported that the invoices created in their ERP for some Tradeline orders were lower than the amount charged to the retailer. Their finance teams found the gap during month-end reconciliation. The difference was always the part of the order paid with Tradeline credit. In Brazil the fiscal invoice issued by Tradeline was correct, so the distributor's ERP and the fiscal document disagreed, which blocked the distributor's tax filing for those orders.

## Affected configuration
- tier: plus and premium
- region: mx-central and br-south (the only stamps with distributors using split payment and the ERP connector at the same time)
- integration: erp-connector
- data_mode: both
- features: split_payment on; the other features did not matter

Orders paid in a single method were correct. Orders with split payment from retailers whose distributor uses the app or the Orders API were correct.

## Timeline
- 2026-08-18 · release flag `split_payment` turned on for 20% of tenants in mx-central and br-south
- 2026-08-27 · first distributor complaint about reconciliation
- 2026-08-29 · root cause confirmed, flag turned off
- 2026-08-31 · fix deployed, flag back on

## Numbers from the period
- Orders affected: 18,240
- Value under-invoiced in distributor ERPs: MXN 6.3 million and BRL 2.1 million
- Distributors affected: 41, of which 3 dedicated-silo tenants

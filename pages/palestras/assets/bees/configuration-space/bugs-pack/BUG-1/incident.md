# BUG-1 · Colombian retailers blocked at the minimum order value

Severity: SEV-2 · Duration: 3 days until fix in production · Region stamp: co-andes

## What was observed
From 2026-08-11, retailers in Colombia whose cart total was exactly COP 150,000 saw the message "Your order is below the minimum value for your distributor" and could not check out. Carts of COP 150,001 or more went through. Support received 412 tickets in three days, most of them from small groceries that build the cart to the exact minimum on purpose, because the distributor's minimum is printed on its price list.

## Affected configuration
- tier: basic and plus (premium distributors in Colombia have no minimum)
- region: co-andes
- integration: all
- data_mode: shared-pool
- features: not related

## Timeline
- 2026-08-10 19:40 · release 2026.32.1 promoted to all regions in a single step
- 2026-08-11 08:15 · first ticket from a Bogotá retailer
- 2026-08-12 17:00 · support escalates after the ticket volume triples
- 2026-08-13 21:10 · hotfix 2026.32.2 deployed

## Numbers from the period
- Orders in Colombia on the three days: 6.1% below the same weekdays of the previous week
- Orders with total exactly equal to the minimum, in the four weeks before: 3.4% of Colombian orders

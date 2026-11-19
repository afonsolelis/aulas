# BUG-3 · Scheduled-delivery orders fail during a deployment in South Africa

Severity: SEV-2 · Duration: 47 minutes · Region stamp: za-north

## What was observed
During the deployment of release 2026.36.0 in za-north, every order with a delivery slot failed at checkout with "We could not reserve your delivery slot, try again". Orders without a delivery slot worked. The error stopped by itself when the deployment finished. A second, smaller burst of the same error happened 20 minutes later, when an operator rolled one node back to investigate.

## Affected configuration
- tier: all
- region: za-north (the first stamp of the release train that week)
- integration: all
- data_mode: shared-pool only; dedicated-silo tenants were migrated in a later window
- features: scheduled_delivery on

## Timeline
- 2026-09-02 22:00 · database migration 0193 runs on the za-north shared database
- 2026-09-02 22:02 · rolling deployment of orders-service starts, 12 nodes, 2 at a time
- 2026-09-02 22:02 to 22:31 · checkout errors for orders with a delivery slot
- 2026-09-02 22:51 to 23:09 · second burst after one node is rolled back to 2026.35.4

## Numbers from the period
- Checkout attempts with a slot that failed: 2,870
- Retailers who did not retry within the hour: 31%
- Orders not recovered the next day (estimate by the za-north team): 640

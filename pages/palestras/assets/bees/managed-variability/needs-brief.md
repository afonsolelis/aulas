# Tradeline: three needs for the Architecture Option Lab

BEES Functional Trainings · Engineering & Platform · Workshop 1 · Designing for Managed Variability
Inteli Executive Education. Tradeline is a fictional company and every number below is synthetic.

## Context

Tradeline is a global B2B ordering marketplace. Retailers (bars, small groceries) order from
manufacturers and distributors in five markets: Brazil, Mexico, Colombia, South Africa and the
Dominican Republic. The platform serves three service models: direct (the manufacturer produces
and distributes), manufacturer that does not distribute, and indirect (through distributors).
About 310,000 retailers order every month; order issuing and catalog pricing are the two
services whose failure stops sales in every market.

The order service already carries the tax rule as country conditionals in three layers (see the
sample repository `tradeline-orders-sample`). Three new demands arrived in the same quarter.

## Need 1. Regional tax rule when issuing orders

Colombia announces that, from next quarter, orders delivered to two departments
(Amazonas and San Andrés) are exempt from IVA, while the rest of the country keeps the standard
rate. The rule is decided by the delivery address, not by the customer. The finance team in
Mexico says a similar rule for border zones may come next year. Today the tax rule is a chain of
country conditionals in the UI, the order service and a SQL view.

Known facts: about 4% of Colombian orders go to the two departments; the rule has a legal start
date; an order issued with the wrong tax must be cancelled and reissued, which takes the retailer
out of the app for the day.

## Need 2. Order approval flow for premium distributor accounts

Premium distributor accounts (about 120 accounts in Brazil and Mexico, 9% of order volume) ask
that orders above a value threshold chosen by each distributor wait for approval by a
purchasing manager before being issued. Standard accounts and retailers keep auto-approval.
Three distributors already said they want different thresholds per region, and one wants two
approvers for orders above a second threshold.

Known facts: the commercial team sells "premium" as a paid tier; approval delays affect the
delivery window promised to the retailer; today `approval.py` auto-approves everything.

## Need 3. Integration with a large distributor's ERP

The largest distributor in South Africa (about 18% of the volume in that market) wants orders
pushed to its ERP in real time and stock levels pulled back every 15 minutes. Its ERP exposes a
SOAP interface with its own product codes, and its IT team can only change the interface twice
a year. Two other distributors, in Mexico and Colombia, run different ERPs and may ask for the
same in the next twelve months.

Known facts: the order service must keep its current API contract, used by thousands of
integrated systems; a slow ERP must not slow down order issuing for anyone else.

## What each group delivers (Architecture Option Sketch)

For each need: type of variation and binding time, two options to accommodate it, the effect of
each option on code, deployment, testing, operations and cost, the missing information, the
preferred option and what happens to the end user and to the critical services if it fails.

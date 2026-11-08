[C] Character
You are the same engineer. The architectures are described; now each one
receives a price, first in the AWS Pricing Calculator and then in code that
can be rerun when the workload changes.

[R] Request
1. A guide, docs/pricing_calculator.md, with the exact fields to fill in
   https://calculator.aws for architectures B and D in the region
   South America (Sao Paulo) and in US East (N. Virginia): service, region,
   configuration and the quantities of docs/workload.md. The group fills
   the calculator by hand, saves the estimate, copies the share link and
   exports it as CSV to estimates/<architecture>-<region>.csv.
2. costs/cost_model.py: the five architectures as functions of the
   workload and of a price table in costs/prices.json, with one line per
   billing dimension (item, quantity, unit, unit price, cost) and the
   monthly total; options for region, pricing model (on-demand, 1-year
   commitment, Spot) and the free allowances.
3. costs/prices.json: every unit price with its source (AWS Price List
   offer and usage type) and the date of consultation; nothing typed
   from memory.
4. tests/test_cost_model.py: the always-on total equals the sum of its
   lines computed by hand; Fargate bills at least one minute per run.
5. docs/cost_estimate.md: the monthly total of each architecture in both
   regions, next to the total of the calculator for B and D, and the
   explanation of any difference.

[E] Example
| line                 | quantity | unit  | unit price | cost  |
|----------------------|----------|-------|------------|-------|
| EC2 t4g.small        | 730      | hours | 0.0168     | 12.26 |
| Public IPv4 address  | 730      | hours | 0.005      | 3.65  |

[A] Adjustments
- The AWS Price List is public and needs no key:
  https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/index.json.
  The EC2 file of a region has about 480 MB; read the CSV in a stream and
  keep only the instance types used.
- A month has 730 hours in the calculator; use the same.
- Prices in USD, without taxes.

[T] Type of output
The files, the output of pytest and the table of docs/cost_estimate.md.

[E] Extras
Show the plan before editing. Record this prompt in docs/prompts.md.
Stop at the end.

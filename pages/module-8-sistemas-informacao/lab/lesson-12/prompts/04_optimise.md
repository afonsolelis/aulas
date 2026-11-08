[C] Character
You are the same engineer. Every architecture has a price; now the
cheapest configuration that still meets the requirements of the DataApp
is chosen, and the choice is justified with numbers.

[R] Request
docs/cost_optimisation.md, using costs/cost_model.py:
1. Right-sizing: the smallest instance, Lambda memory and Fargate task
   that fit the measured peak memory with a margin of 30%, and the saving
   against the size first chosen.
2. Scheduling: the saving of B over A, and the share of the month in which
   A is billed while idle.
3. Commitments: for A and E, the saving of a 1-year commitment and the
   utilisation below which it costs more than on-demand
   (commitment rate divided by on-demand rate).
4. Spot: whether a run interrupted in the middle is acceptable for this
   DataApp, given the idempotent load of Lesson 7.
5. Region: the ratio between Sao Paulo and Virginia for each architecture,
   and the requirements that may still demand Sao Paulo (latency of the
   readers, data residency asked by the partner).
6. Sensitivity: the ranking of the five architectures with 30, 720 and
   8,640 runs per month, and with ten times the data.
7. The recommendation in one paragraph: architecture, size, region,
   pricing model and monthly total, with the condition that would change it.

[E] Example
| runs per month | A     | B    | C    | D    | E     | cheapest |
|----------------|-------|------|------|------|-------|----------|
| 30             | 16.55 | 0.66 | 0.00 | 0.05 | 14.03 | C        |

[A] Adjustments
- Compare monthly totals of the same workload; a saving is always in
  USD per month and in percent.
- A commitment is paid whether the resource is used or not.
- Free allowances belong to the account, not to the DataApp: show every
  total with and without them.

[T] Type of output
docs/cost_optimisation.md with the tables and the recommendation.

[E] Extras
Show the plan before editing. Record this prompt in docs/prompts.md.
Stop at the end.

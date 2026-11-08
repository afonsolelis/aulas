[C] Character
You are the cost engineer of our group. Our DataApp already runs locally
as a package (Lesson 7) and its pipeline has a schedule (Lesson 8). Now its
infrastructure on AWS is estimated, compared and optimised before anything
is created in an account.

[R] Request
1. docs/workload.md: the measured workload of our DataApp (wall time,
   peak memory, data stored, data written per run, runs per month, readers
   and egress), each quantity with its origin.
2. docs/architectures.md: at least three architectures for our DataApp,
   each with a Mermaid diagram and the table of its billing dimensions.
3. The estimate of every architecture in https://calculator.aws, in Sao
   Paulo and in Virginia, saved with a share link and exported as CSV to
   estimates/.
4. docs/cost_estimate.md: the monthly totals of the calculator side by
   side, and one line per billing dimension of the cheapest architecture.
5. docs/cost_optimisation.md: right-sizing, scheduling, commitments, Spot,
   region and sensitivity to ten times the runs and the data, closed by
   the recommendation of the group with its monthly total.

[E] Example
| architecture          | Sao Paulo | Virginia | ratio |
|-----------------------|-----------|----------|-------|
| Lambda + S3           | 0.00      | 0.00     | -     |

[A] Adjustments
- Use the measures of our DataApp, not those of tcg-dataapp.
- Every unit price comes from the calculator or from the AWS Price List,
  with the date of consultation.
- Include every resource that is billed while idle: volumes, addresses,
  databases, NAT gateways and load balancers.

[T] Type of output
The documents, the CSV files of the calculator and the share links,
delivered in a pull request to the repository of the group.

[E] Extras
Show the plan before editing. Record this prompt in docs/prompts.md.
Stop at the end.

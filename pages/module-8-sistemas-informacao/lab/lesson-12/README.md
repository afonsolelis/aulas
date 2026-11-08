# Lesson 12 · Lab: pricing the DataApp on AWS

Module 8 · Information Systems · Inteli · Wednesday, 16/12/2026

Every line of a cloud bill is a quantity of the workload multiplied by a unit price. This lab prices the DataApp of Lesson 7, `tcg-dataapp`, under five AWS architectures, with the workload measured on 08/11/2026 and a snapshot of the public AWS Price List taken on the same day. The page `index.html` runs the model in the browser: every quantity and every unit price can be edited, and the changes stay in the localStorage of the browser.

Serve the folder over HTTP (the page reads `data/prices.json` with `fetch`):

```bash
python3 -m http.server 8000   # from the root of the repository
# http://localhost:8000/pages/module-8-sistemas-informacao/lab/lesson-12/
```

## Steps

| Step | Prompt | Produces |
|---|---|---|
| 01 | `prompts/01_workload.md` | `scripts/measure_run.sh`, `docs/workload.md`: what is measured and what is decided |
| 02 | `prompts/02_architectures.md` | `docs/architectures.md`: five architectures and their billing dimensions |
| 03 | `prompts/03_estimate.md` | the AWS Pricing Calculator for B and D in two regions, `costs/cost_model.py`, `costs/prices.json` |
| 04 | `prompts/04_optimise.md` | `docs/cost_optimisation.md`: size, schedule, commitment, Spot, region, sensitivity, recommendation |
| groups | `prompts/05_your_architecture.md` | the same four steps over the DataApp of the group, delivered by pull request |

## The architectures

| | Architecture | USD per month (us-east-1, on-demand, 30 runs, free allowances) |
|---|---|---:|
| A | EC2 t4g.small always on, 8 GB gp3, public IPv4 | 16.55 |
| B | the same instance started for each run by EventBridge Scheduler | 0.66 |
| C | Lambda ARM 1 GB + EventBridge Scheduler + S3 | < 0.01 |
| D | ECS Fargate task ARM 0.5 vCPU / 1 GB + Scheduler + S3 + ECR | 0.05 |
| E | D + RDS for PostgreSQL db.t4g.micro, 20 GB gp3 | 14.03 |

## Files

- `index.html`: the calculator, with the prompts, the comparison by region and by frequency, and the table of unit prices with their sources.
- `cost_model.js` and `cost_model.py`: the same rules in JavaScript (for the page) and in Python (`python3 cost_model.py --help`).
- `data/prices.json`: 17 KB snapshot of the AWS Price List consulted on 08/11/2026; each price has its offer, usage type and publication date.
- `data/expected_totals.json`: 180 totals written by `cost_model.py --write-expected`; `node check_js.mjs` checks that the page gives the same.
- `test_cost_model.py`: `python3 -m pytest test_cost_model.py` (9 tests, the last one runs `check_js.mjs` when node is installed).
- `capture/snapshot_prices.py`: rebuilds `data/prices.json` from the Price List (`--raw` folder for the downloads; the EC2 offer is read as a stream of about 480 MB per region).

## The measured workload (08/11/2026)

`tcg-dataapp run` of Lesson 7 in a new virtual environment, under `/usr/bin/time -v`: 25.6 s of wall time (the reference of Lesson 7, used in the estimates, is about 40 s), 10.8 s of user CPU and 1.1 s of system CPU, a peak of 392 MB of resident memory, `warehouse/tcg.duckdb` of 1.85 MB and `out/` of 0.09 MB. Each run downloads 19.8 MB of price archives and 1.8 MB of catalogue from tcgcsv.com; data entering AWS is not charged.

## Limits of the model

Prices are in USD, without taxes, for a month of 730 hours. Spot is an estimate from the average saving of the Spot Instance Advisor, and Fargate Spot is not in the Price List. Only the first price tier of each service is used, which is exact for this workload. CloudWatch Logs, NAT gateways and load balancers are not modelled; the architectures avoid the last two. The AWS Pricing Calculator remains the reference for a real estimate.

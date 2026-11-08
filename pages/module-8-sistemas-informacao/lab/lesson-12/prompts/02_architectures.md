[C] Character
You are the same engineer. The workload is measured; now the architectures
that could run it on AWS are described by what each one bills.

[R] Request
docs/architectures.md with five candidate architectures for tcg-dataapp,
each one with a Mermaid diagram (scheduler, compute, storage, readers) and
a table of its billing dimensions (service, what is counted, unit, and the
quantity of the workload of docs/workload.md that drives it):
A. EC2 instance always on, with an EBS gp3 volume and a public IPv4.
B. The same instance started for each run and stopped after it, by
   EventBridge Scheduler.
C. AWS Lambda (ARM) started by EventBridge Scheduler, with tcg.duckdb and
   the marts in S3.
D. An ECS Fargate task (ARM) started by EventBridge Scheduler, with the
   image in ECR and the data in S3.
E. D plus an RDS for PostgreSQL db.t4g.micro that serves the gold layer.
Close with a paragraph on the time that each architecture keeps a resource
billed while the DataApp is idle.

[E] Example
| service | counted        | unit       | driver                       |
|---------|----------------|------------|------------------------------|
| Lambda  | compute        | GB-second  | runs x duration x memory     |
| S3      | PUT requests   | request    | runs x files written per run |

[A] Adjustments
- Lambda stops a run at 15 minutes; say whether the measured run fits.
- Fargate bills per second, from the image pull to the end of the task,
  with a minimum of one minute; EC2 Linux also bills per second with a
  minimum of one minute.
- An EBS volume is billed while the instance is stopped; a public IPv4 is
  billed only while it is in use.

[T] Type of output
docs/architectures.md, with the diagrams rendered in the preview.

[E] Extras
Show the plan before editing. Record this prompt in docs/prompts.md.
Stop at the end.

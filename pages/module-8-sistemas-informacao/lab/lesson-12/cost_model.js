// Monthly cost of the tcg-dataapp workload under five AWS architectures.
// The same rules are written in cost_model.py; check_js.mjs proves that both give the same totals.
// Every price comes from data/prices.json (AWS Price List, consulted on 2026-11-08).

export const HOURS_PER_MONTH = 730;

export const ARCHITECTURES = {
  ec2_always_on: 'A · EC2 always on',
  ec2_scheduled: 'B · EC2 started for each run',
  lambda_s3: 'C · Lambda + Scheduler + S3',
  fargate_s3: 'D · Fargate task + Scheduler + S3',
  fargate_rds: 'E · Fargate task + RDS PostgreSQL',
};

// Measured on 08/11/2026 with tcg-dataapp 0.1.0 (Lesson 7); the duration of 40 s is the reference of Lesson 7.
export const DEFAULT_WORKLOAD = {
  runs_per_month: 30,      // one run a day
  run_seconds: 40,         // wall time of tcg-dataapp run
  memory_gb: 1,            // Lambda memory; the run peaks at 392 MB
  storage_gb: 0.002,       // warehouse/tcg.duckdb 1.85 MB + out/ 0.09 MB
  egress_gb: 1,            // readers downloading the report and the marts
  reader_downloads: 300,   // GET requests of readers per month
};

export const DEFAULT_OPTIONS = {
  region: 'us-east-1',
  pricing: 'on_demand',    // on_demand | commit_1y | spot
  free_tier: true,
  ec2_type: 't4g.small',
  ebs_gb: 8,
  boot_seconds: 60,        // start, boot and stop of the instance around each run
  fargate_vcpu: 0.5,
  fargate_gb: 1,
  start_seconds: 30,       // image pull and start of the task, billed by Fargate
  image_gb: 0.3,           // container image in ECR
  s3_class: 'standard',    // standard | ia
  rds_storage_gb: 20,      // minimum allocated storage of RDS gp3
  puts_per_run: 5,         // tcg.duckdb, three Parquet files and report.md
  gets_per_run: 1,         // tcg.duckdb read back at the start of a run
};

function line(item, quantity, unit, price, note = '') {
  return { item, quantity, unit, price, cost: quantity * price, note };
}

function ec2Rate(r, o) {
  const t = r.ec2[o.ec2_type];
  if (!t) throw new Error(`unknown instance type ${o.ec2_type}`);
  if (o.pricing === 'commit_1y') return [t.commit_1y.usd, 'reserved 1 yr, no upfront'];
  if (o.pricing === 'spot') return [t.on_demand.usd * (1 - t.spot_savings_pct.pct / 100), `spot estimate, ${t.spot_savings_pct.pct}% below on-demand`];
  return [t.on_demand.usd, 'on-demand'];
}

function paid(quantity, allowance, o) {
  return o.free_tier ? Math.max(0, quantity - allowance) : quantity;
}

function egress(prices, r, w, o) {
  const gb = paid(w.egress_gb, prices.free_allowances.egress_internet_gb, o);
  return line('Data transfer out to the internet', gb, 'GB', r.egress_internet_gb.usd, o.free_tier ? 'after the free 100 GB' : '');
}

function scheduler(prices, r, invocations, o) {
  const n = paid(invocations, prices.free_allowances.scheduler_invocations, o);
  return line('EventBridge Scheduler invocations', n, 'invocations', r.scheduler_invocation.usd, o.free_tier ? 'first 14 million free' : '');
}

function s3Lines(r, w, o) {
  const storage = o.s3_class === 'ia' ? r.s3_ia_gb_month.usd : r.s3_standard_gb_month.usd;
  return [
    line(`S3 storage (${o.s3_class === 'ia' ? 'Standard-IA' : 'Standard'})`, w.storage_gb, 'GB-month', storage),
    line('S3 PUT requests', w.runs_per_month * o.puts_per_run, 'requests', r.s3_put_request.usd),
    line('S3 GET requests', w.runs_per_month * o.gets_per_run + w.reader_downloads, 'requests', r.s3_get_request.usd),
  ];
}

function fargateLines(r, w, o) {
  const billed = Math.max(60, w.run_seconds + o.start_seconds);
  const hours = w.runs_per_month * billed / 3600;
  const commit = o.pricing === 'commit_1y';
  const note = commit ? 'Compute Savings Plan 1 yr' : o.pricing === 'spot' ? 'Fargate Spot is not in the price list: on-demand' : 'on-demand';
  return [
    line('Fargate vCPU (ARM)', hours * o.fargate_vcpu, 'vCPU-hours', commit ? r.fargate_arm_vcpu_hour_commit_1y.usd : r.fargate_arm_vcpu_hour.usd, note),
    line('Fargate memory (ARM)', hours * o.fargate_gb, 'GB-hours', commit ? r.fargate_arm_gb_hour_commit_1y.usd : r.fargate_arm_gb_hour.usd, note),
    line('Public IPv4 of the task', hours, 'hours', r.public_ipv4_hour.usd),
    line('ECR image storage', o.image_gb, 'GB-month', r.ecr_gb_month.usd),
  ];
}

export function estimate(arch, prices, workload = {}, options = {}) {
  const w = { ...DEFAULT_WORKLOAD, ...workload };
  const o = { ...DEFAULT_OPTIONS, ...options };
  const r = prices.regions[o.region];
  if (!r) throw new Error(`unknown region ${o.region}`);
  let lines;
  if (arch === 'ec2_always_on') {
    const [rate, note] = ec2Rate(r, o);
    lines = [
      line(`EC2 ${o.ec2_type}`, HOURS_PER_MONTH, 'hours', rate, note),
      line('EBS gp3 volume', o.ebs_gb, 'GB-month', r.ebs_gp3_gb_month.usd),
      line('Public IPv4 address', HOURS_PER_MONTH, 'hours', r.public_ipv4_hour.usd),
      egress(prices, r, w, o),
    ];
  } else if (arch === 'ec2_scheduled') {
    const [rate, note] = ec2Rate(r, o);
    const hours = w.runs_per_month * Math.max(60, w.run_seconds + o.boot_seconds) / 3600;
    lines = [
      line(`EC2 ${o.ec2_type}`, hours, 'hours', rate, note),
      line('EBS gp3 volume (billed while stopped)', o.ebs_gb, 'GB-month', r.ebs_gp3_gb_month.usd),
      line('Public IPv4 address (only while running)', hours, 'hours', r.public_ipv4_hour.usd),
      scheduler(prices, r, w.runs_per_month * 2, o),
      egress(prices, r, w, o),
    ];
  } else if (arch === 'lambda_s3') {
    const commit = o.pricing === 'commit_1y';
    const gbs = paid(w.runs_per_month * w.run_seconds * w.memory_gb, prices.free_allowances.lambda_gb_seconds, o);
    const requests = paid(w.runs_per_month, prices.free_allowances.lambda_requests, o);
    const note = commit ? 'Compute Savings Plan 1 yr' : o.pricing === 'spot' ? 'no Spot for Lambda: on-demand' : 'on-demand';
    lines = [
      line('Lambda compute (ARM)', gbs, 'GB-seconds', commit ? r.lambda_arm_gb_second_commit_1y.usd : r.lambda_arm_gb_second.usd, o.free_tier ? `${note}, after 400,000 free` : note),
      line('Lambda requests', requests, 'requests', r.lambda_request.usd, o.free_tier ? 'first million free' : ''),
      ...s3Lines(r, w, o),
      scheduler(prices, r, w.runs_per_month, o),
      egress(prices, r, w, o),
    ];
  } else if (arch === 'fargate_s3' || arch === 'fargate_rds') {
    lines = [...fargateLines(r, w, o), ...s3Lines(r, w, o), scheduler(prices, r, w.runs_per_month, o), egress(prices, r, w, o)];
    if (arch === 'fargate_rds') {
      const commit = o.pricing === 'commit_1y';
      const rds = r.rds_pg_t4g_micro;
      lines.push(
        line('RDS PostgreSQL db.t4g.micro, Single-AZ', HOURS_PER_MONTH, 'hours', commit ? rds.commit_1y.usd : rds.on_demand.usd,
          commit ? 'reserved 1 yr, no upfront' : o.pricing === 'spot' ? 'no Spot for RDS: on-demand' : 'on-demand'),
        line('RDS gp3 storage', o.rds_storage_gb, 'GB-month', r.rds_gp3_gb_month.usd),
      );
    }
  } else {
    throw new Error(`unknown architecture ${arch}`);
  }
  const total = lines.reduce((sum, l) => sum + l.cost, 0);
  return { arch, region: o.region, pricing: o.pricing, lines, total };
}

export function estimateAll(prices, workload = {}, options = {}) {
  return Object.keys(ARCHITECTURES).map((arch) => estimate(arch, prices, workload, options));
}

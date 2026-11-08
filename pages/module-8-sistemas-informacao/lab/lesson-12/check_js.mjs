// Checks that cost_model.js gives the same totals as cost_model.py (data/expected_totals.json).
//   node check_js.mjs
import { readFileSync } from 'node:fs';
import { estimate } from './cost_model.js';

const here = new URL('.', import.meta.url);
const prices = JSON.parse(readFileSync(new URL('data/prices.json', here), 'utf8'));
const expected = JSON.parse(readFileSync(new URL('data/expected_totals.json', here), 'utf8'));
let bad = 0;
for (const e of expected) {
  const got = estimate(e.arch, prices, { runs_per_month: e.runs_per_month }, { region: e.region, pricing: e.pricing, free_tier: e.free_tier }).total;
  if (Math.abs(got - e.total) > 1e-9) {
    bad += 1;
    console.log('DIFF', e.arch, e.region, e.pricing, e.free_tier, e.runs_per_month, got, e.total);
  }
}
console.log(`${expected.length - bad} of ${expected.length} totals agree with cost_model.py`);
process.exit(bad ? 1 : 0);

/**
 * seed-metrics — Stub
 */

async function seedMetrics(days = 30) {
  return { seeded: 0, days };
}

function generateSeedData(days = 30) {
  return [];
}

module.exports = { seedMetrics, generateSeedData };

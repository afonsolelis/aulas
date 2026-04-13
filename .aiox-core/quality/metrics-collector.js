/**
 * MetricsCollector — Stub
 *
 * Módulo de coleta de métricas de qualidade. Esta é uma implementação
 * stub que satisfaz a dependência do CLI sem requerer armazenamento externo.
 */

class MetricsCollector {
  constructor(options = {}) {
    this.retentionDays = options.retentionDays || 30;
    this.dataFile = options.dataFile || '.aiox/data/quality-metrics.json';
  }

  async record(entry) {
    return { success: true, id: Date.now(), ...entry };
  }

  async getMetrics(filters = {}) {
    return { records: [], summary: { total: 0, passed: 0, failed: 0 } };
  }

  async cleanup() {
    return { removed: 0, retained: 0 };
  }

  async seed(days = 30) {
    return { seeded: 0 };
  }
}

module.exports = { MetricsCollector };

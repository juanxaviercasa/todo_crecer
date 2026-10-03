'use strict';
const fs = require('node:fs');
const { createMultiProviderFinOps } = require('../packages/multiprovider-finops/index.cjs');
const actors = {
  manager: { roles: ['finops_manager'] }, allocator: { roles: ['cost_allocator'] },
  planner: { roles: ['capacity_planner'] }, finance: { roles: ['finance_reviewer'] },
  resilience: { roles: ['resilience_reviewer'] }, arbiter: { roles: ['provider_arbiter'] },
  limits: { roles: ['limit_reviewer'] }, audit: { roles: ['finops_auditor'] }
};
function scenario(degraded = false) {
  const engine = createMultiProviderFinOps({ now: () => new Date('2026-10-03T18:00:00Z') });
  engine.begin(actors.manager, degraded ? 'cohort_peak_placeholder' : 'cohort_baseline_placeholder');
  engine.allocate(actors.allocator, 'tenant_one', [{ provider_ref: 'provider_alpha', usage_units: 350, cost_cents: 1100 }, { provider_ref: 'provider_beta', usage_units: 150, cost_cents: 420 }], 80);
  engine.allocate(actors.allocator, 'tenant_two', [{ provider_ref: 'provider_alpha', usage_units: 250, cost_cents: 780 }, { provider_ref: 'provider_beta', usage_units: 100, cost_cents: 280 }], 80);
  engine.forecast(actors.planner, degraded ? 1800 : 1000, degraded ? 50 : 20);
  engine.budget(actors.finance, 10000, degraded ? 12500 : 6200);
  engine.planCapacity(actors.planner, degraded ? [
    { provider_ref: 'provider_alpha', capacity_units: 1500, reserved_units: 300, unit_cost_micros: 3600, eligible: true },
    { provider_ref: 'provider_beta', capacity_units: 1100, reserved_units: 200, unit_cost_micros: 3000, eligible: true }
  ] : undefined);
  engine.simulatePeak(actors.resilience, degraded ? 1.5 : 1.2);
  engine.arbitrate(actors.arbiter);
  engine.applyLimit(actors.limits);
  engine.decide(actors.manager, ['finance_owner', 'platform_owner']);
  return { summary: engine.summary(), readiness: engine.readiness(actors.audit) };
}
const output = { schema_version: '0.1.0', synthetic_only: true, baseline: scenario(false), peak: scenario(true), safety: { purchases: 0, provider_changes: 0, external_changes: false, publications: 0 } };
fs.mkdirSync('dist/multiprovider-finops/data', { recursive: true });
fs.writeFileSync('dist/multiprovider-finops/data/finops.json', `${JSON.stringify(output, null, 2)}\n`);
console.log(JSON.stringify(output.safety));

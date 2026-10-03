const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const { createMultiProviderFinOps } = require('../packages/multiprovider-finops/index.cjs');
const { server } = require('../scripts/serve-multiprovider-finops.cjs');
const actor = role => ({ roles: [role] });
const a = { manager: actor('finops_manager'), allocator: actor('cost_allocator'), planner: actor('capacity_planner'), finance: actor('finance_reviewer'), resilience: actor('resilience_reviewer'), arbiter: actor('provider_arbiter'), limits: actor('limit_reviewer'), audit: actor('finops_auditor') };
function prepare(degraded = false) {
  const engine = createMultiProviderFinOps({ now: () => new Date('2026-10-03T18:00:00Z') });
  engine.begin(a.manager, degraded ? 'peak' : 'baseline');
  engine.allocate(a.allocator, 'tenant-a', [{ provider_ref: 'alpha', usage_units: 300, cost_cents: 900 }, { provider_ref: 'beta', usage_units: 100, cost_cents: 300 }], 50);
  engine.allocate(a.allocator, 'tenant-b', [{ provider_ref: 'alpha', usage_units: 200, cost_cents: 600 }, { provider_ref: 'beta', usage_units: 80, cost_cents: 240 }], 50);
  engine.forecast(a.planner, degraded ? 1800 : 1000, degraded ? 50 : 20);
  engine.budget(a.finance, 10000, degraded ? 12500 : 6200);
  engine.planCapacity(a.planner, degraded ? [
    { provider_ref: 'alpha', capacity_units: 1500, reserved_units: 300, unit_cost_micros: 3600, eligible: true },
    { provider_ref: 'beta', capacity_units: 1100, reserved_units: 200, unit_cost_micros: 3000, eligible: true }
  ] : undefined);
  engine.simulatePeak(a.resilience, degraded ? 1.5 : 1.2);
  engine.arbitrate(a.arbiter);
  engine.applyLimit(a.limits);
  engine.decide(a.manager, ['finance_owner', 'platform_owner']);
  return engine;
}
const cases = [
  ['allocates two tenants', () => assert.equal(prepare().summary().tenants, 2)],
  ['sums tenant costs', () => assert.equal(prepare().summary().allocated_cents, 2140)],
  ['baseline forecast is deterministic', () => assert.equal(prepare().summary().forecast_units, 1200)],
  ['baseline stays within budget', () => assert.equal(prepare().summary().budget, 'within_budget')],
  ['peak exceeds budget', () => assert.equal(prepare(true).summary().budget, 'exceeded')],
  ['baseline has capacity headroom', () => assert(prepare().summary().headroom_percent > 100)],
  ['peak has negative headroom', () => assert(prepare(true).summary().headroom_percent < 0)],
  ['baseline peak passes', () => assert.equal(prepare().summary().peak, 'passed')],
  ['degraded peak is constrained', () => assert.equal(prepare(true).summary().peak, 'constrained')],
  ['arbitration produces recommendation', () => assert.equal(prepare().summary().arbitration, 'recommendation_ready')],
  ['baseline limit allows traffic', () => assert.equal(prepare().summary().limit, 'allow')],
  ['peak limit blocks only in simulation', () => assert.equal(prepare(true).summary().limit, 'block_simulated')],
  ['baseline stays within budget', () => assert.equal(prepare().summary().decision, 'stay_within_budget')],
  ['degraded scenario requires finance review', () => assert.equal(prepare(true).summary().decision, 'finance_review_required')],
  ['readiness completes', () => assert.equal(prepare().readiness(a.audit).status, 'finops_rehearsal_complete')],
  ['purchases remain zero', () => assert.equal(prepare().summary().purchases, 0)],
  ['provider changes remain zero', () => assert.equal(prepare().summary().provider_changes, 0)],
  ['external changes remain false', () => assert.equal(prepare().summary().external_changes, false)],
  ['purchase execution is blocked', () => assert.throws(() => prepare().executePurchase(), { code: 'EXTERNAL_CHANGE_BLOCKED' })],
  ['role is required', () => assert.throws(() => createMultiProviderFinOps().begin({ roles: [] }, 'x'), { code: 'ROLE_REQUIRED' })],
  ['dual finance review is required', () => { const engine = createMultiProviderFinOps(); engine.begin(a.manager, 'x'); assert.throws(() => engine.decide(a.manager, ['finance_owner']), { code: 'DUAL_REVIEW_REQUIRED' }); }]
];
for (const [name, fn] of cases) test(name, fn);
test('arbitration selects the highest eligible weighted score', () => {
  const engine = createMultiProviderFinOps(); engine.begin(a.manager, 'arbitration');
  engine.forecast(a.planner, 1000, 0); engine.planCapacity(a.planner);
  const result = engine.arbitrate(a.arbiter, { provider_alpha: { cost_score: 20 }, provider_beta: { cost_score: 100, capacity_score: 100, reliability_score: 100 } });
  assert.equal(result.recommended_provider, 'provider_beta'); assert.equal(result.provider_change_authorized, false);
});
test('arbitration requires manual review when no provider is eligible', () => {
  const engine = createMultiProviderFinOps(); engine.begin(a.manager, 'ineligible');
  engine.forecast(a.planner, 1000, 0); engine.planCapacity(a.planner, [
    { provider_ref: 'alpha', capacity_units: 1000, reserved_units: 0, unit_cost_micros: 3000, eligible: false },
    { provider_ref: 'beta', capacity_units: 1000, reserved_units: 0, unit_cost_micros: 3000, eligible: false }
  ]);
  const result = engine.arbitrate(a.arbiter); assert.equal(result.status, 'manual_review'); assert.equal(result.recommended_provider, null);
});
test('soft capacity pressure produces simulated throttle and optimization decision', () => {
  const engine = createMultiProviderFinOps(); engine.begin(a.manager, 'soft-limit');
  engine.allocate(a.allocator, 'tenant', [{ provider_ref: 'alpha', usage_units: 200, cost_cents: 500 }], 0);
  engine.forecast(a.planner, 1000, 0); engine.budget(a.finance, 10000, 9000);
  engine.planCapacity(a.planner, [
    { provider_ref: 'alpha', capacity_units: 800, reserved_units: 0, unit_cost_micros: 3000, eligible: true },
    { provider_ref: 'beta', capacity_units: 500, reserved_units: 0, unit_cost_micros: 3000, eligible: true }
  ]);
  engine.simulatePeak(a.resilience, 1.2); engine.arbitrate(a.arbiter);
  assert.equal(engine.applyLimit(a.limits).action, 'throttle_simulated');
  assert.equal(engine.decide(a.manager, ['finance_owner', 'platform_owner']).decision, 'optimize_capacity');
});
function request(instance, pathname, method = 'GET') { return new Promise((resolve, reject) => { const req = http.request({ hostname: '127.0.0.1', port: instance.address().port, path: pathname, method }, response => { let body = ''; response.on('data', chunk => body += chunk); response.on('end', () => resolve({ response, body })); }); req.on('error', reject); req.end(); }); }
test('FinOps UI is private and protected', async () => { const instance = server(); await new Promise(resolve => instance.listen(0, '127.0.0.1', resolve)); try { const result = await request(instance, '/'); assert.equal(result.response.statusCode, 200); assert.match(result.body, /FinOps y capacidad multiproveedor/); assert.equal(result.response.headers['x-robots-tag'], 'noindex, nofollow'); } finally { instance.close(); } });
test('FinOps UI rejects writes and traversal', async () => { const instance = server(); await new Promise(resolve => instance.listen(0, '127.0.0.1', resolve)); try { assert.equal((await request(instance, '/', 'POST')).response.statusCode, 405); assert.equal((await request(instance, '/%2e%2e/package.json')).response.statusCode, 404); } finally { instance.close(); } });

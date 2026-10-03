'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const Ajv = require('ajv/dist/2020');
const addFormats = require('ajv-formats');

const ROOT = path.resolve(__dirname, '../..');
const schemaNames = [
  'phase47-tenant-cost-allocation', 'phase47-cohort-budget',
  'phase47-demand-forecast', 'phase47-capacity-plan',
  'phase47-peak-simulation', 'phase47-provider-arbitration',
  'phase47-automatic-limit', 'phase47-finops-decision', 'phase47-readiness'
];
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
for (const name of schemaNames) {
  ajv.addSchema(JSON.parse(fs.readFileSync(path.join(ROOT, 'contracts', `${name}.schema.json`))));
}
const validators = Object.fromEntries(schemaNames.map(name => [name, ajv.getSchema(`https://schemas.todolima.local/${name}.schema.json`)]));
const canonical = value => JSON.stringify(value, (_key, item) => item && typeof item === 'object' && !Array.isArray(item)
  ? Object.fromEntries(Object.entries(item).sort(([a], [b]) => a.localeCompare(b))) : item);
const sha = value => crypto.createHash('sha256').update(typeof value === 'string' ? value : canonical(value)).digest('hex');
const failure = (code, message) => Object.assign(new Error(message), { code });

function createMultiProviderFinOps({ now = () => new Date() } = {}) {
  let sequence = 0;
  const state = { cohortId: null, allocations: [], forecast: null, budget: null, capacity: null, simulation: null, arbitration: null, limit: null, decision: null };
  const stamp = () => now().toISOString();
  const id = prefix => `${prefix}_${sha(`${prefix}|${sequence++}|${stamp()}`).slice(0, 18)}`;
  const requireRole = (actor, role) => { if (!actor?.roles?.includes(role)) throw failure('ROLE_REQUIRED', role); };
  const validate = (name, value) => {
    if (!validators[name](value)) throw failure('SCHEMA_INVALID', `${name}: ${ajv.errorsText(validators[name].errors)}`);
    return value;
  };
  const requireStarted = () => { if (!state.cohortId) throw failure('CYCLE_NOT_STARTED', 'cohort'); };

  function begin(actor, cohortRef) {
    requireRole(actor, 'finops_manager');
    if (state.cohortId) throw failure('CYCLE_ALREADY_STARTED', 'cohort');
    state.cohortId = `cohort_${sha(cohortRef).slice(0, 16)}`;
    return { cohort_id: state.cohortId, synthetic_only: true };
  }

  function allocate(actor, tenantRef, providerCosts, sharedCostCents = 100) {
    requireRole(actor, 'cost_allocator'); requireStarted();
    const total = providerCosts.reduce((sum, item) => sum + item.cost_cents, sharedCostCents);
    const allocation = {
      schema_version: '0.1.0', allocation_id: id('allocation'), tenant_fingerprint: sha(tenantRef),
      cohort_id: state.cohortId, provider_costs: providerCosts, shared_cost_cents: sharedCostCents,
      total_cost_cents: total, currency: 'USD', synthetic_only: true, created_at: stamp()
    };
    state.allocations.push(validate('phase47-tenant-cost-allocation', allocation));
    return structuredClone(allocation);
  }

  function forecast(actor, baselineUnits = 1000, growthPercent = 20) {
    requireRole(actor, 'capacity_planner'); requireStarted();
    const forecastUnits = Math.round(baselineUnits * (1 + growthPercent / 100));
    const value = {
      schema_version: '0.1.0', forecast_id: id('forecast'), cohort_id: state.cohortId,
      horizon_days: 90, baseline_units: baselineUnits, forecast_units: forecastUnits,
      growth_percent: growthPercent, confidence: 0.85, model: 'deterministic_synthetic_v1', created_at: stamp()
    };
    state.forecast = validate('phase47-demand-forecast', value); return structuredClone(value);
  }

  function budget(actor, budgetCents = 10000, forecastCostCents = null) {
    requireRole(actor, 'finance_reviewer'); requireStarted();
    if (!state.forecast) throw failure('FORECAST_REQUIRED', 'forecast');
    const allocated = state.allocations.reduce((sum, item) => sum + item.total_cost_cents, 0);
    const projected = forecastCostCents ?? Math.max(allocated, Math.round(state.forecast.forecast_units * 4));
    const hardLimit = Math.round(budgetCents * 1.1);
    const utilization = Math.round((projected / budgetCents) * 10000) / 100;
    const status = projected > hardLimit ? 'exceeded' : projected > budgetCents * 0.8 ? 'at_risk' : 'within_budget';
    const value = {
      schema_version: '0.1.0', budget_id: id('budget'), cohort_id: state.cohortId, period: '2026-Q4',
      budget_cents: budgetCents, allocated_cents: allocated, forecast_cents: projected,
      hard_limit_cents: hardLimit, utilization_percent: utilization, status, created_at: stamp()
    };
    state.budget = validate('phase47-cohort-budget', value); return structuredClone(value);
  }

  function planCapacity(actor, providers = [
    { provider_ref: 'provider_alpha', capacity_units: 1600, reserved_units: 200, unit_cost_micros: 3200, eligible: true },
    { provider_ref: 'provider_beta', capacity_units: 1200, reserved_units: 100, unit_cost_micros: 2800, eligible: true }
  ]) {
    requireRole(actor, 'capacity_planner'); requireStarted();
    if (!state.forecast) throw failure('FORECAST_REQUIRED', 'forecast');
    const total = providers.filter(item => item.eligible).reduce((sum, item) => sum + Math.max(0, item.capacity_units - item.reserved_units), 0);
    const headroom = state.forecast.forecast_units === 0 ? 100 : Math.round(((total - state.forecast.forecast_units) / state.forecast.forecast_units) * 10000) / 100;
    const value = {
      schema_version: '0.1.0', plan_id: id('capacity'), cohort_id: state.cohortId, providers,
      total_capacity_units: total, forecast_units: state.forecast.forecast_units,
      headroom_percent: headroom, status: total >= state.forecast.forecast_units ? 'sufficient' : 'constrained', created_at: stamp()
    };
    state.capacity = validate('phase47-capacity-plan', value); return structuredClone(value);
  }

  function simulatePeak(actor, multiplier = 1.2, scenario = 'campaign_peak') {
    requireRole(actor, 'resilience_reviewer'); requireStarted();
    if (!state.capacity) throw failure('CAPACITY_REQUIRED', 'capacity');
    const demanded = Math.round(state.forecast.forecast_units * multiplier);
    const served = Math.min(demanded, state.capacity.total_capacity_units);
    const value = {
      schema_version: '0.1.0', simulation_id: id('simulation'), capacity_plan_ref: state.capacity.plan_id,
      scenario, multiplier, demanded_units: demanded, served_units: served, shed_units: demanded - served,
      status: demanded <= served ? 'passed' : 'constrained', synthetic_only: true, external_changes: false, created_at: stamp()
    };
    state.simulation = validate('phase47-peak-simulation', value); return structuredClone(value);
  }

  function arbitrate(actor, metrics = {}) {
    requireRole(actor, 'provider_arbiter'); requireStarted();
    if (!state.capacity) throw failure('CAPACITY_REQUIRED', 'capacity');
    const candidates = state.capacity.providers.map((provider, index) => {
      const supplied = metrics[provider.provider_ref] || {};
      const costScore = supplied.cost_score ?? Math.max(0, 100 - Math.round(provider.unit_cost_micros / 100));
      const capacityScore = supplied.capacity_score ?? Math.min(100, Math.round(provider.capacity_units / 20));
      const reliabilityScore = supplied.reliability_score ?? (index === 0 ? 96 : 92);
      const eligible = provider.eligible && supplied.eligible !== false;
      const composite = Math.round((costScore * 0.3 + capacityScore * 0.35 + reliabilityScore * 0.35) * 100) / 100;
      return { provider_ref: provider.provider_ref, cost_score: costScore, capacity_score: capacityScore, reliability_score: reliabilityScore, composite_score: composite, eligible };
    });
    const eligible = candidates.filter(item => item.eligible).sort((a, b) => b.composite_score - a.composite_score);
    const winner = eligible[0] || null;
    const value = {
      schema_version: '0.1.0', arbitration_id: id('arbitration'), candidates,
      recommended_provider: winner?.provider_ref || null,
      reason_codes: winner ? ['highest_weighted_eligible_score', 'recommendation_only'] : ['no_eligible_provider', 'manual_review_required'],
      status: winner ? 'recommendation_ready' : 'manual_review', dry_run: true,
      provider_change_authorized: false, created_at: stamp()
    };
    state.arbitration = validate('phase47-provider-arbitration', value); return structuredClone(value);
  }

  function applyLimit(actor) {
    requireRole(actor, 'limit_reviewer'); requireStarted();
    if (!state.simulation) throw failure('SIMULATION_REQUIRED', 'simulation');
    const hard = state.capacity.total_capacity_units;
    const soft = Math.round(hard * 0.9);
    const observed = state.simulation.demanded_units;
    const action = observed > hard ? 'block_simulated' : observed > soft ? 'throttle_simulated' : 'allow';
    const value = {
      schema_version: '0.1.0', limit_id: id('limit'), cohort_id: state.cohortId,
      soft_limit_units: soft, hard_limit_units: hard, observed_units: observed,
      action, enforcement_mode: 'simulation', external_changes: false, created_at: stamp()
    };
    state.limit = validate('phase47-automatic-limit', value); return structuredClone(value);
  }

  function decide(actor, approverRoles) {
    requireRole(actor, 'finops_manager'); requireStarted();
    if (!['finance_owner', 'platform_owner'].every(role => approverRoles.includes(role))) throw failure('DUAL_REVIEW_REQUIRED', 'roles');
    if (![state.budget, state.forecast, state.capacity, state.simulation, state.arbitration, state.limit].every(Boolean)) throw failure('EVIDENCE_INCOMPLETE', 'finops');
    const critical = state.budget.status === 'exceeded' || state.simulation.status === 'constrained' || state.arbitration.status === 'manual_review' || state.limit.action === 'block_simulated';
    const needsOptimization = !critical && (state.budget.status === 'at_risk' || state.limit.action === 'throttle_simulated');
    const value = {
      schema_version: '0.1.0', decision_id: id('decision'), cohort_id: state.cohortId,
      budget_ref: state.budget.budget_id, forecast_ref: state.forecast.forecast_id,
      capacity_ref: state.capacity.plan_id, simulation_ref: state.simulation.simulation_id,
      arbitration_ref: state.arbitration.arbitration_id, limit_ref: state.limit.limit_id,
      decision: critical ? 'finance_review_required' : needsOptimization ? 'optimize_capacity' : 'stay_within_budget',
      approver_roles: ['finance_owner', 'platform_owner'], purchase_authorized: false,
      provider_change_authorized: false, external_changes: false, created_at: stamp()
    };
    state.decision = validate('phase47-finops-decision', value); return structuredClone(value);
  }

  function readiness(actor) {
    requireRole(actor, 'finops_auditor');
    const checks = [
      ['allocations', state.allocations.length > 0], ['forecast', Boolean(state.forecast)],
      ['budget', Boolean(state.budget)], ['capacity', Boolean(state.capacity)],
      ['peak_simulation', Boolean(state.simulation)], ['arbitration', Boolean(state.arbitration)],
      ['automatic_limit', Boolean(state.limit)], ['decision', Boolean(state.decision)],
      ['zero_side_effects', true]
    ].map(([name, passed]) => ({ name, passed: Boolean(passed) }));
    const value = {
      schema_version: '0.1.0', readiness_id: id('readiness'), checks,
      blockers: ['real_billing_export', 'finance_execution_authorization', 'provider_change_authorization'],
      status: checks.every(item => item.passed) ? 'finops_rehearsal_complete' : 'blocked',
      operations_status: 'blocked', external_changes: false, generated_at: stamp()
    };
    return validate('phase47-readiness', value);
  }

  function executePurchase() { throw failure('EXTERNAL_CHANGE_BLOCKED', 'FinOps rehearsal cannot purchase capacity'); }
  function summary() {
    return {
      tenants: state.allocations.length, allocated_cents: state.allocations.reduce((sum, item) => sum + item.total_cost_cents, 0),
      budget: state.budget?.status || 'missing', forecast_units: state.forecast?.forecast_units || 0,
      headroom_percent: state.capacity?.headroom_percent ?? null, peak: state.simulation?.status || 'missing',
      arbitration: state.arbitration?.status || 'missing', limit: state.limit?.action || 'missing',
      decision: state.decision?.decision || 'missing', purchases: 0, provider_changes: 0,
      external_changes: false, publications: 0
    };
  }

  return { begin, allocate, forecast, budget, planCapacity, simulatePeak, arbitrate, applyLimit, decide, readiness, executePurchase, summary };
}

module.exports = { createMultiProviderFinOps, sha };

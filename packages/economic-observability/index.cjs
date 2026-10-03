'use strict';
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const Ajv = require('ajv/dist/2020');
const addFormats = require('ajv-formats');
const ROOT = path.resolve(__dirname, '../..');
const names = ['phase48-technical-economic-snapshot','phase48-error-budget','phase48-burn-rate','phase48-cost-anomaly','phase48-alert-cluster','phase48-incident','phase48-runbook-execution','phase48-rollback-rehearsal','phase48-response-decision','phase48-readiness'];
const ajv = new Ajv({ allErrors: true, strict: false }); addFormats(ajv);
for (const name of names) ajv.addSchema(JSON.parse(fs.readFileSync(path.join(ROOT, 'contracts', `${name}.schema.json`))));
const validators = Object.fromEntries(names.map(name => [name, ajv.getSchema(`https://schemas.todolima.local/${name}.schema.json`)]));
const canonical = value => JSON.stringify(value, (_key, item) => item && typeof item === 'object' && !Array.isArray(item) ? Object.fromEntries(Object.entries(item).sort(([a],[b]) => a.localeCompare(b))) : item);
const sha = value => crypto.createHash('sha256').update(typeof value === 'string' ? value : canonical(value)).digest('hex');
const failure = (code, message) => Object.assign(new Error(message), { code });
const round = value => Math.round(value * 100) / 100;

function createEconomicObservability({ now = () => new Date() } = {}) {
  let sequence = 0;
  const state = { scope: null, snapshot: null, budget: null, burn: null, anomaly: null, cluster: null, incident: null, runbook: null, rollback: null, decision: null };
  const stamp = () => now().toISOString();
  const id = prefix => `${prefix}_${sha(`${prefix}|${sequence++}|${stamp()}`).slice(0,18)}`;
  const role = (actor, required) => { if (!actor?.roles?.includes(required)) throw failure('ROLE_REQUIRED', required); };
  const validate = (name, value) => { if (!validators[name](value)) throw failure('SCHEMA_INVALID', `${name}: ${ajv.errorsText(validators[name].errors)}`); return value; };
  const started = () => { if (!state.scope) throw failure('CYCLE_NOT_STARTED', 'scope'); };

  function begin(actor, scopeRef) {
    role(actor, 'observability_manager');
    if (state.scope) throw failure('CYCLE_ALREADY_STARTED', 'scope');
    state.scope = sha(scopeRef);
    return { scope_fingerprint: state.scope, synthetic_only: true };
  }

  function observe(actor, metrics) {
    role(actor, 'telemetry_reviewer'); started();
    if (!Number.isInteger(metrics.requests) || metrics.requests < 1 || !Number.isInteger(metrics.failures) || metrics.failures < 0 || metrics.failures > metrics.requests) throw failure('METRICS_INVALID', 'requests/failures');
    const value = { schema_version:'0.1.0', snapshot_id:id('snapshot'), scope_fingerprint:state.scope, window_minutes:60,
      requests:metrics.requests, failures:metrics.failures, availability_percent:round(((metrics.requests-metrics.failures)/metrics.requests)*100),
      latency_p95_ms:metrics.latency_p95_ms, baseline_cost_cents:metrics.baseline_cost_cents, actual_cost_cents:metrics.actual_cost_cents,
      personal_data_fields:0, synthetic_only:true, observed_at:stamp() };
    state.snapshot = validate('phase48-technical-economic-snapshot', value); return structuredClone(value);
  }

  function evaluateErrorBudget(actor, target = 99.9) {
    role(actor, 'slo_reviewer'); started(); if (!state.snapshot) throw failure('SNAPSHOT_REQUIRED', 'snapshot');
    const allowed = state.snapshot.requests * ((100-target)/100);
    const consumed = allowed === 0 ? (state.snapshot.failures ? 10000 : 0) : round((state.snapshot.failures/allowed)*100);
    const value = { schema_version:'0.1.0', budget_id:id('errorbudget'), snapshot_ref:state.snapshot.snapshot_id, slo_target_percent:target,
      allowed_failures:round(allowed), observed_failures:state.snapshot.failures, consumed_percent:consumed, remaining_percent:round(100-consumed),
      status:consumed>100?'exhausted':consumed>=80?'at_risk':'healthy', evaluated_at:stamp() };
    state.budget = validate('phase48-error-budget', value); return structuredClone(value);
  }

  function evaluateBurnRate(actor, shortWindow, longWindow) {
    role(actor, 'slo_reviewer'); started(); if (!state.budget) throw failure('ERROR_BUDGET_REQUIRED', 'budget');
    const allowedRate = (100-state.budget.slo_target_percent)/100;
    const rate = window => allowedRate === 0 ? (window.failures ? 10000 : 0) : round((window.failures/window.requests)/allowedRate);
    const shortRate = rate(shortWindow), longRate = rate(longWindow);
    const severity = shortRate>=14 && longRate>=6 ? 'critical' : shortRate>=6 || longRate>=3 ? 'warning' : 'normal';
    const value = { schema_version:'0.1.0', burn_id:id('burn'), error_budget_ref:state.budget.budget_id, short_window_minutes:5,
      long_window_minutes:60, short_rate:shortRate, long_rate:longRate, severity, evaluated_at:stamp() };
    state.burn = validate('phase48-burn-rate', value); return structuredClone(value);
  }

  function evaluateCost(actor) {
    role(actor, 'cost_observer'); started(); if (!state.snapshot) throw failure('SNAPSHOT_REQUIRED', 'snapshot');
    const deviation = round(((state.snapshot.actual_cost_cents-state.snapshot.baseline_cost_cents)/state.snapshot.baseline_cost_cents)*100);
    const status = deviation>=50 ? 'critical' : deviation>=20 ? 'warning' : 'normal';
    const value = { schema_version:'0.1.0', anomaly_id:id('anomaly'), snapshot_ref:state.snapshot.snapshot_id,
      baseline_cents:state.snapshot.baseline_cost_cents, actual_cents:state.snapshot.actual_cost_cents,
      deviation_percent:deviation, method:'median_baseline_v1', status, evaluated_at:stamp() };
    state.anomaly = validate('phase48-cost-anomaly', value); return structuredClone(value);
  }

  function clusterAlerts(actor, occurrences = 3) {
    role(actor, 'alert_manager'); started(); if (![state.budget,state.burn,state.anomaly].every(Boolean)) throw failure('SIGNALS_INCOMPLETE', 'signals');
    const critical = state.budget.status==='exhausted' || state.burn.severity==='critical' || state.anomaly.status==='critical';
    const warning = !critical && (state.budget.status==='at_risk' || state.burn.severity==='warning' || state.anomaly.status==='warning');
    const refs = [state.budget.budget_id,state.burn.burn_id,state.anomaly.anomaly_id];
    const value = { schema_version:'0.1.0', cluster_id:id('cluster'), dedupe_key:sha(`${state.scope}|technical-economic|60`),
      scope_fingerprint:state.scope, signal_refs:refs, occurrences, severity:critical?'critical':warning?'warning':'info',
      status:'open_simulated', external_notifications:0, created_at:stamp() };
    state.cluster = validate('phase48-alert-cluster', value); return structuredClone(value);
  }

  function openIncident(actor) {
    role(actor, 'incident_commander'); started(); if (!state.cluster) throw failure('ALERT_CLUSTER_REQUIRED', 'cluster');
    if (state.cluster.severity!=='critical') throw failure('CRITICAL_ALERT_REQUIRED', 'cluster');
    const value = { schema_version:'0.1.0', incident_id:id('incident'), alert_cluster_ref:state.cluster.cluster_id, severity:'critical',
      status:'open', commander_role:'incident_commander', timeline:[{event:'opened_from_correlated_signals',occurred_at:stamp()}], external_changes:false, opened_at:stamp() };
    state.incident = validate('phase48-incident', value); return structuredClone(value);
  }

  function executeRunbook(actor) {
    role(actor, 'runbook_operator'); started(); if (!state.incident) throw failure('INCIDENT_REQUIRED', 'incident');
    const value = { schema_version:'0.1.0', execution_id:id('runbook'), incident_ref:state.incident.incident_id,
      steps:['detect','correlate_technical_and_cost','apply_safe_cap','rehearse_rollback','verify'].map((name,index)=>({name,status:index===2||index===3?'simulated':'passed'})),
      mode:'simulation', outcome:'mitigated_pending_verification', external_changes:false, executed_at:stamp() };
    state.runbook = validate('phase48-runbook-execution', value);
    state.incident.status='mitigating_simulated'; state.incident.timeline.push({event:'runbook_simulated',occurred_at:stamp()}); validate('phase48-incident',state.incident);
    return structuredClone(value);
  }

  function rehearseRollback(actor, after = {}) {
    role(actor, 'rollback_reviewer'); started(); if (!state.runbook) throw failure('RUNBOOK_REQUIRED', 'runbook');
    const afterAvailability = after.availability_percent ?? 99.95;
    const afterCost = after.cost_cents ?? state.snapshot.baseline_cost_cents;
    const passed = afterAvailability>=state.budget.slo_target_percent && afterCost<=state.snapshot.baseline_cost_cents*1.2;
    const value = { schema_version:'0.1.0', rehearsal_id:id('rollback'), runbook_ref:state.runbook.execution_id,
      before_availability_percent:state.snapshot.availability_percent, after_availability_percent:afterAvailability,
      before_cost_cents:state.snapshot.actual_cost_cents, after_cost_cents:afterCost, integrity_checks:5,
      status:passed?'passed':'failed', rollback_applied:false, external_changes:false, verified_at:stamp() };
    state.rollback=validate('phase48-rollback-rehearsal',value); return structuredClone(value);
  }

  function decide(actor, approverRoles) {
    role(actor,'observability_manager'); started();
    if (!['operations_owner','risk_reviewer'].every(required=>approverRoles.includes(required))) throw failure('DUAL_REVIEW_REQUIRED','roles');
    if (!state.cluster) throw failure('ALERT_CLUSTER_REQUIRED','cluster');
    const decision = state.cluster.severity!=='critical' ? 'observe' : state.rollback?.status==='passed' ? 'human_close_review' : 'escalate_operator';
    const value = { schema_version:'0.1.0', decision_id:id('decision'), scope_fingerprint:state.scope, alert_cluster_ref:state.cluster.cluster_id,
      incident_ref:state.incident?.incident_id||null, rollback_ref:state.rollback?.rehearsal_id||null, decision,
      approver_roles:['operations_owner','risk_reviewer'], remediation_authorized:false, external_changes:false, decided_at:stamp() };
    state.decision=validate('phase48-response-decision',value); return structuredClone(value);
  }

  function readiness(actor) {
    role(actor,'observability_auditor');
    const incidentPath = state.cluster?.severity!=='critical' || Boolean(state.incident&&state.runbook&&state.rollback);
    const checks=[['snapshot',Boolean(state.snapshot)],['error_budget',Boolean(state.budget)],['burn_rate',Boolean(state.burn)],['cost_anomaly',Boolean(state.anomaly)],['deduplicated_alert',Boolean(state.cluster)],['incident_path',incidentPath],['decision',Boolean(state.decision)],['no_personal_data',state.snapshot?.personal_data_fields===0],['zero_side_effects',true]].map(([name,passed])=>({name,passed:Boolean(passed)}));
    const value={schema_version:'0.1.0',readiness_id:id('readiness'),checks,blockers:['production_telemetry','operator_execution_authorization','verified_rollback_target'],status:checks.every(item=>item.passed)?'economic_observability_rehearsal_complete':'blocked',operations_status:'blocked',external_changes:false,generated_at:stamp()};
    return validate('phase48-readiness',value);
  }

  function remediate(){throw failure('EXTERNAL_CHANGE_BLOCKED','Economic observability rehearsal cannot remediate production');}
  function summary(){return{availability:state.snapshot?.availability_percent??null,error_budget:state.budget?.status||'missing',burn:state.burn?.severity||'missing',cost_anomaly:state.anomaly?.status||'missing',alert_severity:state.cluster?.severity||'missing',alert_clusters:state.cluster?1:0,alert_occurrences:state.cluster?.occurrences||0,incident:state.incident?.status||'none',runbook:state.runbook?.outcome||'none',rollback:state.rollback?.status||'none',decision:state.decision?.decision||'missing',external_notifications:0,remediations:0,external_changes:false,publications:0};}
  return{begin,observe,evaluateErrorBudget,evaluateBurnRate,evaluateCost,clusterAlerts,openIncident,executeRunbook,rehearseRollback,decide,readiness,remediate,summary};
}
module.exports={createEconomicObservability,sha};

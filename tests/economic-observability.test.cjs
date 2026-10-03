const test=require('node:test');const assert=require('node:assert/strict');const http=require('node:http');const {createEconomicObservability}=require('../packages/economic-observability/index.cjs');const {server}=require('../scripts/serve-economic-observability.cjs');
const actor=role=>({roles:[role]}),a={manager:actor('observability_manager'),telemetry:actor('telemetry_reviewer'),slo:actor('slo_reviewer'),cost:actor('cost_observer'),alerts:actor('alert_manager'),incident:actor('incident_commander'),runbook:actor('runbook_operator'),rollback:actor('rollback_reviewer'),audit:actor('observability_auditor')};
function prepare(degraded=false,rollback={}){const x=createEconomicObservability({now:()=>new Date('2026-10-03T20:00:00Z')});x.begin(a.manager,degraded?'bad':'good');x.observe(a.telemetry,degraded?{requests:10000,failures:40,latency_p95_ms:980,baseline_cost_cents:6000,actual_cost_cents:12500}:{requests:10000,failures:2,latency_p95_ms:280,baseline_cost_cents:6000,actual_cost_cents:6200});x.evaluateErrorBudget(a.slo);x.evaluateBurnRate(a.slo,degraded?{requests:1000,failures:50}:{requests:1000,failures:0},degraded?{requests:10000,failures:80}:{requests:10000,failures:2});x.evaluateCost(a.cost);x.clusterAlerts(a.alerts,degraded?7:3);if(degraded){x.openIncident(a.incident);x.executeRunbook(a.runbook);x.rehearseRollback(a.rollback,rollback)}x.decide(a.manager,['operations_owner','risk_reviewer']);return x}
const cases=[
['healthy availability calculated',()=>assert.equal(prepare().summary().availability,99.98)],
['degraded availability calculated',()=>assert.equal(prepare(true).summary().availability,99.6)],
['healthy error budget',()=>assert.equal(prepare().summary().error_budget,'healthy')],
['degraded error budget exhausted',()=>assert.equal(prepare(true).summary().error_budget,'exhausted')],
['normal multi-window burn rate',()=>assert.equal(prepare().summary().burn,'normal')],
['critical multi-window burn rate',()=>assert.equal(prepare(true).summary().burn,'critical')],
['normal cost variance',()=>assert.equal(prepare().summary().cost_anomaly,'normal')],
['critical cost anomaly',()=>assert.equal(prepare(true).summary().cost_anomaly,'critical')],
['healthy cluster is informational',()=>assert.equal(prepare().summary().alert_severity,'info')],
['degraded cluster is critical',()=>assert.equal(prepare(true).summary().alert_severity,'critical')],
['seven signals deduplicate into one cluster',()=>{const s=prepare(true).summary();assert.equal(s.alert_clusters,1);assert.equal(s.alert_occurrences,7)}],
['healthy path opens no incident',()=>assert.equal(prepare().summary().incident,'none')],
['critical path opens incident',()=>assert.equal(prepare(true).summary().incident,'mitigating_simulated')],
['runbook reaches verification',()=>assert.equal(prepare(true).summary().runbook,'mitigated_pending_verification')],
['rollback rehearsal passes',()=>assert.equal(prepare(true).summary().rollback,'passed')],
['failed recovery is detected',()=>assert.equal(prepare(true,{availability_percent:98,cost_cents:10000}).summary().rollback,'failed')],
['healthy decision observes',()=>assert.equal(prepare().summary().decision,'observe')],
['passed rollback awaits human closure',()=>assert.equal(prepare(true).summary().decision,'human_close_review')],
['failed rollback escalates operator',()=>assert.equal(prepare(true,{availability_percent:98,cost_cents:10000}).summary().decision,'escalate_operator')],
['readiness completes for healthy path',()=>assert.equal(prepare().readiness(a.audit).status,'economic_observability_rehearsal_complete')],
['readiness completes for rehearsed incident',()=>assert.equal(prepare(true).readiness(a.audit).status,'economic_observability_rehearsal_complete')],
['external notifications stay zero',()=>assert.equal(prepare(true).summary().external_notifications,0)],
['real remediation is blocked',()=>assert.throws(()=>prepare(true).remediate(),{code:'EXTERNAL_CHANGE_BLOCKED'})],
['role is required',()=>assert.throws(()=>createEconomicObservability().begin({roles:[]},'x'),{code:'ROLE_REQUIRED'})],
['dual review is required',()=>{const x=createEconomicObservability();x.begin(a.manager,'x');assert.throws(()=>x.decide(a.manager,['operations_owner']),{code:'DUAL_REVIEW_REQUIRED'})}],
['noncritical cluster cannot open incident',()=>assert.throws(()=>prepare().openIncident(a.incident),{code:'CRITICAL_ALERT_REQUIRED'})],
['invalid metrics are rejected',()=>{const x=createEconomicObservability();x.begin(a.manager,'x');assert.throws(()=>x.observe(a.telemetry,{requests:1,failures:2}),{code:'METRICS_INVALID'})}]
];for(const [name,fn] of cases)test(name,fn);
function request(instance,pathname,method='GET'){return new Promise((resolve,reject)=>{const req=http.request({hostname:'127.0.0.1',port:instance.address().port,path:pathname,method},response=>{let body='';response.on('data',chunk=>body+=chunk);response.on('end',()=>resolve({response,body}))});req.on('error',reject);req.end()})}
test('economic observability UI is private',async()=>{const instance=server();await new Promise(resolve=>instance.listen(0,'127.0.0.1',resolve));try{const result=await request(instance,'/');assert.equal(result.response.statusCode,200);assert.match(result.body,/La confiabilidad también tiene un coste/);assert.equal(result.response.headers['x-robots-tag'],'noindex, nofollow');assert.match(result.response.headers['content-security-policy'],/connect-src 'none'/)}finally{instance.close()}});
test('economic observability UI rejects writes and traversal',async()=>{const instance=server();await new Promise(resolve=>instance.listen(0,'127.0.0.1',resolve));try{assert.equal((await request(instance,'/','POST')).response.statusCode,405);assert.equal((await request(instance,'/%2e%2e/package.json')).response.statusCode,404)}finally{instance.close()}});

const test=require('node:test'),assert=require('node:assert/strict'),http=require('node:http'),{createPortfolioCommandCenter}=require('../packages/portfolio-command-center/index.cjs'),{server}=require('../scripts/serve-portfolio-command-center.cjs');const actor=role=>({roles:[role]}),a={manager:actor('portfolio_manager'),observer:actor('portfolio_observer'),priority:actor('priority_analyst'),queue:actor('queue_manager'),workforce:actor('workforce_planner'),sla:actor('sla_coordinator'),escalation:actor('escalation_manager'),analyst:actor('portfolio_analyst'),audit:actor('portfolio_auditor')};
const sample=[['a',{health_score:20,cost_efficiency_score:40,conversion_score:30,evidence_score:20,risk_score:95}],['b',{health_score:40,cost_efficiency_score:50,conversion_score:50,evidence_score:30,risk_score:70}],['c',{health_score:60,cost_efficiency_score:70,conversion_score:60,evidence_score:0,risk_score:50}],['d',{health_score:70,cost_efficiency_score:80,conversion_score:40,evidence_score:60,risk_score:20}],['e',{health_score:50,cost_efficiency_score:80,conversion_score:70,evidence_score:70,risk_score:30}],['f',{health_score:75,cost_efficiency_score:20,conversion_score:70,evidence_score:75,risk_score:20}],['g',{health_score:90,cost_efficiency_score:90,conversion_score:80,evidence_score:90,risk_score:10}],['h',{health_score:85,cost_efficiency_score:85,conversion_score:10,evidence_score:85,risk_score:15}]];
function prepare({limited=false,healthy=false}={}){const x=createPortfolioCommandCenter({now:()=>new Date('2026-10-03T22:00:00Z')});x.begin(a.manager,'portfolio');const rows=healthy?[['healthy',{health_score:90,cost_efficiency_score:90,conversion_score:80,evidence_score:90,risk_score:10}]]:sample;const snapshots=rows.map(([ref,d])=>x.ingest(a.observer,ref,d)),scores=x.score(a.priority),items=x.createQueue(a.queue);if(limited)x.registerOperator(a.workforce,'risk',['risk_operator'],1);else for(const [ref,roles,max]of [['risk',['risk_operator'],3],['evidence',['evidence_operator'],2],['reliability',['reliability_operator'],2],['growth',['growth_operator'],3],['finance',['finance_operator'],2]])x.registerOperator(a.workforce,ref,roles,max);const plan=x.assign(a.queue),sla=x.evaluateSla(a.sla,healthy?{P3:10}:{P0:45,P1:300,P2:300,P3:600}),escalations=x.simulateEscalations(a.escalation),rollup=x.rollup(a.analyst),decision=x.decide(a.manager,['portfolio_owner','operations_lead']);return{x,snapshots,scores,items,plan,sla,escalations,rollup,decision}}
const cases=[
['ingests eight businesses',()=>assert.equal(prepare().snapshots.length,8)],
['business identifiers are fingerprints',()=>assert.match(prepare().snapshots[0].business_fingerprint,/^[a-f0-9]{64}$/)],
['critical snapshot is classified',()=>assert.equal(prepare().snapshots[0].status,'critical')],
['healthy snapshot is classified',()=>assert.equal(prepare({healthy:true}).snapshots[0].status,'healthy')],
['duplicate business is rejected',()=>{const x=createPortfolioCommandCenter();x.begin(a.manager,'p');x.ingest(a.observer,'x',sample[0][1]);assert.throws(()=>x.ingest(a.observer,'x',sample[0][1]),{code:'BUSINESS_DUPLICATE'})}],
['invalid dimension is rejected',()=>{const x=createPortfolioCommandCenter();x.begin(a.manager,'p');assert.throws(()=>x.ingest(a.observer,'x',{...sample[0][1],risk_score:101}),{code:'DIMENSION_INVALID'})}],
['weighted score is deterministic',()=>assert.equal(prepare().scores.find(s=>s.priority==='P0').total_score,81)],
['portfolio has one P0',()=>assert.equal(prepare().rollup.priority_counts.P0,1)],
['portfolio has two P1',()=>assert.equal(prepare().rollup.priority_counts.P1,2)],
['portfolio has four P2',()=>assert.equal(prepare().rollup.priority_counts.P2,4)],
['portfolio has one P3',()=>assert.equal(prepare().rollup.priority_counts.P3,1)],
['highest risk recommends containment',()=>assert.equal(prepare().scores.find(s=>s.priority==='P0').recommended_action,'contain_risk')],
['missing evidence routes to evidence operator',()=>assert(prepare().scores.some(s=>s.required_role==='evidence_operator'))],
['conversion gap routes to growth operator',()=>assert(prepare().scores.some(s=>s.required_role==='growth_operator'))],
['cost gap routes to finance operator',()=>assert(prepare().scores.some(s=>s.required_role==='finance_operator'))],
['queue contains every business',()=>assert.equal(prepare().items.length,8)],
['queue starts with P0',()=>assert.equal(prepare().items[0].priority,'P0')],
['P0 SLA is thirty minutes',()=>assert.equal(prepare().items.find(i=>i.priority==='P0').sla_minutes,30)],
['all work is assigned with sufficient capacity',()=>{const p=prepare();assert.equal(p.plan.assignments.length,8);assert.equal(p.plan.unassigned_refs.length,0)}],
['limited capacity leaves work unassigned',()=>assert(prepare({limited:true}).plan.unassigned_refs.length>0)],
['assignments never authorize external action',()=>assert(prepare().items.every(i=>i.external_action===false))],
['three SLA breaches are detected',()=>assert.equal(prepare().rollup.sla_breaches,3)],
['three escalations are simulated',()=>assert.equal(prepare().rollup.escalations,3)],
['escalations emit no external notification',()=>assert(prepare().escalations.every(e=>e.external_notifications===0))],
['critical portfolio is held',()=>assert.equal(prepare().decision.decision,'hold_critical')],
['healthy queue remains under review',()=>assert.equal(prepare({healthy:true}).decision.decision,'review_queue')],
['readiness completes',()=>assert.equal(prepare().x.readiness(a.audit).status,'portfolio_command_rehearsal_complete')],
['real execution is blocked',()=>assert.throws(()=>prepare().x.execute(),{code:'EXTERNAL_CHANGE_BLOCKED'})],
['dual review is required',()=>{const p=prepare();assert.throws(()=>p.x.decide(a.manager,['portfolio_owner']),{code:'DUAL_REVIEW_REQUIRED'})}],
['role is required',()=>assert.throws(()=>createPortfolioCommandCenter().begin({roles:[]},'p'),{code:'ROLE_REQUIRED'})]
];for(const [name,fn]of cases)test(name,fn);
function request(instance,pathname,method='GET'){return new Promise((resolve,reject)=>{const req=http.request({hostname:'127.0.0.1',port:instance.address().port,path:pathname,method},response=>{let body='';response.on('data',chunk=>body+=chunk);response.on('end',()=>resolve({response,body}))});req.on('error',reject);req.end()})}
test('portfolio command UI is private',async()=>{const instance=server();await new Promise(resolve=>instance.listen(0,'127.0.0.1',resolve));try{const result=await request(instance,'/');assert.equal(result.response.statusCode,200);assert.match(result.body,/La siguiente acción, en el orden correcto/);assert.equal(result.response.headers['x-robots-tag'],'noindex, nofollow');assert.match(result.response.headers['content-security-policy'],/connect-src 'none'/)}finally{instance.close()}});
test('portfolio command UI rejects writes and traversal',async()=>{const instance=server();await new Promise(resolve=>instance.listen(0,'127.0.0.1',resolve));try{assert.equal((await request(instance,'/','POST')).response.statusCode,405);assert.equal((await request(instance,'/%2e%2e/package.json')).response.statusCode,404)}finally{instance.close()}});

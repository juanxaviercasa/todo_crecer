/* Offline validation after npm ci; all schema references resolve from contracts/. */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const Ajv = require('ajv/dist/2020');
const addFormats = require('ajv-formats');
const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root,p));
const json = p => JSON.parse(read(p));
const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const serialized = value => Buffer.from(JSON.stringify(value,null,2)+'\n');
const files = dir => fs.readdirSync(path.join(root,dir),{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(dir+'/'+e.name):[dir+'/'+e.name]);
// strict:false supports the three unmodified starter schemas (nullable formats,
// conditional subschemas without repeated type declarations). Formats stay enabled.
const ajv = new Ajv({allErrors:true,strict:false,validateFormats:true});
addFormats(ajv);
const schemas = files('contracts').filter(p=>p.endsWith('.schema.json')).map(json);
for (const s of schemas) {assert(ajv.validateSchema(s),JSON.stringify(ajv.errors));ajv.addSchema(s);}
for (const s of schemas) ajv.getSchema(s.$id);
const base='https://schemas.hazlocrecer.com/';
const validate=(kind,value)=>{const v=ajv.getSchema(base+kind+'.schema.json');assert(v,kind);assert(v(value),kind+': '+JSON.stringify(v.errors));};
const d='examples/golden-business/';
const kinds=['business-truth','vertical-recipe','brand-profile','site-config','site-snapshot','agent-output','agent-output.failed'];
const docs=Object.fromEntries(kinds.map(k=>[k,json(d+k+'.json')]));
const events=files(d+'events').filter(p=>p.endsWith('.json')).map(json);
let positive=0, negative=0;
for(const [k,v] of Object.entries(docs)){validate(k.split('.')[0],v);positive++;}
for(const e of events){validate('events/event',e);positive++;}
function pointer(value,p){
 assert(p.startsWith('/'),'Expected non-root JSON pointer');
 return p.slice(1).split('/').reduce((v,k)=>{k=k.replace(/~1/g,'/').replace(/~0/g,'~');assert(v!==null&&typeof v==='object'&&Object.hasOwn(v,k),'Unresolved pointer '+p);return v[k];},value);
}
function unique(values,label){assert.equal(new Set(values).size,values.length,'Duplicate '+label);}
function checkChain(all,evs){
 const t=all['business-truth'],r=all['vertical-recipe'],b=all['brand-profile'],c=all['site-config'],s=all['site-snapshot'];
 const h=k=>digest(serialized(all[k]));
 unique(t.sources.map(x=>x.source_id),'source_id');
 unique(t.field_provenance.map(x=>x.field_path),'field_path');
 const sources=new Map(t.sources.map(x=>[x.source_id,x]));
 const provenance=new Map(t.field_provenance.map(x=>[x.field_path,x]));
 for(const p of t.field_provenance){pointer(t,p.field_path);for(const source of p.source_ids)assert(sources.has(source),'Missing provenance source');}
 for(const p of r.truth_requirements.minimum_paths){assert.notEqual(pointer(t,p),null);assert(provenance.has(p),'Missing minimum-field provenance');}
 assert(r.verticals.includes(t.identity.primary_category),'Category outside recipe');
 for(const x of [b,c,s,...[all['agent-output'],all['agent-output.failed']]])assert.equal(x.business_id,t.business_id,'Business mismatch');
 for(const x of [b,c,s]){
  assert.equal(x.truth_snapshot.content_hash,h('business-truth'),'Stale truth hash');
  assert.equal(x.truth_snapshot.business_truth_version,t.schema_version);
  assert.equal(x.recipe.recipe_id,r.recipe_id);assert.equal(x.recipe.recipe_version,r.schema_version);
 }
 for(const x of [b,s])assert.equal(x.recipe.content_hash,h('vertical-recipe'));
 assert.equal(c.brand_profile_ref,b.brand_profile_id);
 assert.equal(s.brand_profile.brand_profile_id,b.brand_profile_id);
 assert.equal(s.brand_profile.content_hash,h('brand-profile'));
 assert.equal(s.site_config_hash,h('site-config'));
 assert.equal(s.site_id,c.site_id);assert.equal(s.mode,c.mode);assert.equal(s.indexing,c.seo.indexing);
 assert(t.publication_policy.may_generate_demo);
 if(!t.publication_policy.may_index_demo)assert.equal(c.seo.indexing,'noindex');
 assert.equal(c.routing.primary_hostname,'golden-business.example.invalid','Fixture must stay on reserved domain');
 assert.equal(c.status,'DRAFT');assert.equal(s.publication.status,'not_published');assert.equal(s.qa.status,'not_run');
 assert.equal(c.claim.banner_enabled,true);assert(c.claim.disclosure_text.includes('FICTICIA'));
 assert(Object.values(c.features).every(v=>v===false),'Fixture features must be disabled');
 assert.equal(c.assets.length,0);assert.equal(b.status,'proposed');
 assert(r.design_policy.allowed_layout_families.includes(b.layout_family));
 for(const fact of b.content.facts)for(const e of fact.evidence){
  assert.equal(fact.text,pointer(t,e.field_path),'Fixture facts must match source literally');
  const p=provenance.get(e.field_path);assert(p,'Missing fact provenance');
  assert(['source_verified','owner_verified'].includes(p.verification_status),'Unverified fact');
  for(const sid of e.source_ids){assert(p.source_ids.includes(sid));assert.equal(sources.get(sid).rights_status,'approved_for_internal_use');}
 }
 unique(c.sections.map(x=>x.section_id),'section_id');unique(c.sections.map(x=>x.order),'section order');
 for(const section of c.sections){
  const match=r.sections.find(x=>x.component===section.component);assert(match,'Component outside recipe');
  if(section.enabled)for(const p of match.requires_truth_paths||[])pointer(t,p);
 }
 assert.deepEqual(c.sections.map(x=>x.data),[{headline:t.identity.display_name},{body:t.description}],'Fixture section content drift');
 unique(s.artifacts.map(x=>x.path),'artifact path');assert(s.artifacts.some(x=>x.path===s.entrypoint));
 for(const a of s.artifacts){const bytes=read(d+'snapshot/'+a.path);assert.equal(a.sha256,digest(bytes));assert.equal(a.bytes,bytes.length);}
 const html=read(d+'snapshot/'+s.entrypoint).toString('utf8');
 assert(html.includes('content="noindex,nofollow"'));assert(html.includes(c.claim.disclosure_text));
 assert(html.includes(t.identity.display_name)&&html.includes(t.description));
 for(const a of [all['agent-output'],all['agent-output.failed']]){
  assert(Date.parse(a.finished_at)>=Date.parse(a.started_at),'Agent time order');
  for(const input of a.inputs){assert.equal(input.ref,d+input.kind+'.json');assert.equal(input.content_hash,h(input.kind));}
 }
 assert.deepEqual(all['agent-output'].output.document,s);
 const eventMap={
  'business-truth.validated':['business-truth','business_id'],
  'brand-profile.generated':['brand-profile','brand_profile_id'],
  'site-config.created':['site-config','site_id'],
  'site-snapshot.created':['site-snapshot','snapshot_id'],
  'agent.succeeded':['agent-output','run_id'],
  'agent.failed':['agent-output.failed','run_id']
 };
 unique(evs.map(x=>x.id),'event id');unique(evs.map(x=>x.type),'event type');
 const ids=new Map(evs.map(x=>[x.id,x]));
 assert.equal(evs.length,Object.keys(eventMap).length);
 for(const e of evs){
  const event=e.type.replace('com.hazlocrecer.','').replace(/\.v1$/,'');
  const [kind,key]=eventMap[event];assert.equal(e.subject,all[kind][key]);assert.equal(e.businessid,t.business_id);
  assert.equal(e.correlationid,'golden-flow-001');assert.equal(e.data.artifact_hash,h(kind));assert.deepEqual(e.data.document,all[kind]);
  if(e.causationid!==null){const parent=ids.get(e.causationid);assert(parent,'Unknown causation');assert.equal(parent.correlationid,e.correlationid);assert(Date.parse(parent.time)<=Date.parse(e.time));}
  const seen=new Set([e.id]);let next=e.causationid;
  while(next!==null){assert(!seen.has(next),'Causation cycle');seen.add(next);next=ids.get(next).causationid;}
 }
}
checkChain(docs,events);
const clone=x=>structuredClone(x);
const reject=(name,fn)=>{assert.throws(fn,undefined,'Negative test accepted: '+name);negative++;};
const badSchema=(name,kind,original,mutate)=>reject(name,()=>{const x=clone(original);mutate(x);validate(kind,x);});
badSchema('demo indexing','site-config',docs['site-config'],x=>x.seo.indexing='index');
badSchema('demo banner','site-config',docs['site-config'],x=>x.claim.banner_enabled=false);
badSchema('unknown brand field','brand-profile',docs['brand-profile'],x=>x.unexpected=true);
badSchema('invalid color','brand-profile',docs['brand-profile'],x=>x.color_tokens.primary='red');
badSchema('invalid date','brand-profile',docs['brand-profile'],x=>x.created_at='yesterday');
badSchema('suggestion publication','brand-profile',docs['brand-profile'],x=>x.content.suggestions[0].publish=true);
badSchema('empty evidence','brand-profile',docs['brand-profile'],x=>x.content.facts[0].evidence=[]);
badSchema('path traversal','site-snapshot',docs['site-snapshot'],x=>x.artifacts[0].path='../secret');
badSchema('snapshot indexing','site-snapshot',docs['site-snapshot'],x=>x.indexing='index');
badSchema('publish without QA','site-snapshot',docs['site-snapshot'],x=>{x.publication.status='published';x.publication.url='https://example.invalid';});
badSchema('failed with output','agent-output',docs['agent-output'],x=>x.status='failed');
badSchema('success without output','agent-output',docs['agent-output'],x=>x.output=null);
badSchema('bad nested output','agent-output',docs['agent-output'],x=>x.output.document.schema_version='9.0.0');
badSchema('wrong event type','events/event',events[0],x=>x.type='unknown');
badSchema('invalid event UUID','events/event',events[0],x=>x.id='not-a-uuid');
badSchema('wrong event document','events/event',events.find(x=>x.type.includes('agent.failed')),x=>x.data.document=docs['agent-output']);
const badChain=(name,mutate)=>reject(name,()=>{const a=clone(docs),e=clone(events);mutate(a,e);checkChain(a,e);});
badChain('missing source',a=>a['business-truth'].field_provenance[0].source_ids=['missing']);
badChain('missing pointer',a=>a['vertical-recipe'].truth_requirements.minimum_paths.push('/missing'));
badChain('business mismatch',a=>a['brand-profile'].business_id='other');
badChain('stale hash',a=>a['site-config'].truth_snapshot.content_hash='0'.repeat(64));
badChain('artifact hash',a=>a['site-snapshot'].artifacts[0].sha256='0'.repeat(64));
badChain('event hash',(a,e)=>e[0].data.artifact_hash='0'.repeat(64));
badChain('unknown causation',(a,e)=>e[0].causationid='00000000-0000-4000-8000-999999999999');
badChain('causation cycle',(a,e)=>e[0].causationid=e[0].id);
badChain('subject mismatch',(a,e)=>e[0].subject='wrong');
badChain('time order',a=>a['agent-output'].finished_at='2026-09-28T00:00:00Z');
const report={status:'passed',schemas:schemas.length,valid_examples:positive,negative_tests:negative,cross_document_checks:'passed',formats:'enabled',network_schema_resolution:false,scope:'Synthetic contract fixture only; no browser QA, deployment or real-data clearance.'};
console.log(JSON.stringify(report,null,2));

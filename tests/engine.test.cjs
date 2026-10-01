const {test,after}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const http=require('node:http');
const {ROOT,sha,encode,loadInputs,render,build}=require('../packages/site-engine/index.cjs');
const {createPreview,verifyArtifacts}=require('../packages/site-engine/server.cjs');
const input=path.join(ROOT,'examples/golden-business');
const temporary=fs.mkdtempSync(path.join(os.tmpdir(),'todolima-phase1-test-'));
after(()=>{
 const resolved=path.resolve(temporary),parent=path.resolve(os.tmpdir())+path.sep;
 assert(resolved.startsWith(parent)&&path.basename(resolved).startsWith('todolima-phase1-test-'));
 fs.rmSync(resolved,{recursive:true,force:true});
});
const fresh=()=>loadInputs(input);
function rehash(bundle){
 const d=bundle.documents,b=d['brand-profile'],c=d['site-config'];
 for(const k of ['business-truth','vertical-recipe'])bundle.hashes[k]=sha(encode(d[k]));
 b.truth_snapshot.content_hash=bundle.hashes['business-truth'];c.truth_snapshot.content_hash=bundle.hashes['business-truth'];
 b.recipe.content_hash=bundle.hashes['vertical-recipe'];
 for(const k of ['brand-profile','site-config'])bundle.hashes[k]=sha(encode(d[k]));
 return bundle;
}
const rejection=(name,code,change,{refresh=true}={})=>test(name,()=>{
 const b=fresh();change(b.documents,b);if(refresh)rehash(b);
 assert.throws(()=>render(b),error=>error.code===code);
});
test('renders verified content and external stylesheet',()=>{
 const {html,css}=render(fresh());assert(html.includes('Taller Ejemplo — FICTICIO'));assert(html.includes('noindex,nofollow'));assert(!html.includes('<script'));assert(css.includes('@media(max-width:700px)'));
});
test('escapes verified HTML-like text instead of executing it',()=>{
 const b=fresh(),d=b.documents,name='<img src=x onerror="alert(1)">';
 d['business-truth'].identity.display_name=name;d['brand-profile'].content.facts[0].text=name;
 d['site-config'].sections[0].data.headline=name;d['site-config'].seo.title=name;
 const {html}=render(rehash(b));assert(!html.includes('<img'));assert(html.includes('&lt;img src=x onerror=&quot;alert(1)&quot;&gt;'));
});
test('renders service component only with field-level evidence',()=>{
 const b=fresh(),d=b.documents;
 d['business-truth'].services=[{service_id:'sample-service',name:'Servicio ficticio',verification_status:'source_verified'}];
 d['business-truth'].field_provenance.push({field_path:'/services/0/name',source_ids:['fixture-author'],verification_status:'source_verified',confidence:1});
 d['vertical-recipe'].sections.push({component:'services',priority:3,enabled_by_default:true,requires_truth_paths:['/services/0/name']});
 d['site-config'].sections.push({section_id:'services',component:'services',enabled:true,order:3,data:{items:[{service_id:'sample-service',name:'Servicio ficticio'}]}});
 assert(render(rehash(b)).html.includes('<h3>Servicio ficticio</h3>'));
 d['business-truth'].field_provenance.pop();
 assert.throws(()=>render(rehash(b)),e=>e.code==='FACT_UNVERIFIED');
});
rejection('blocks production','SCHEMA_INVALID',d=>d['site-config'].mode='production');
rejection('blocks source rights restriction','SOURCE_BLOCKED',d=>d['business-truth'].sources[0].rights_status='restricted');
rejection('blocks real-world sources','SOURCE_BLOCKED',d=>d['business-truth'].sources[0].source_type='owner');
rejection('blocks unknown provenance reference','SOURCE_MISSING',d=>d['business-truth'].field_provenance[0].source_ids=['unknown']);
rejection('blocks unverified rendered fact','FACT_UNVERIFIED',d=>d['business-truth'].field_provenance[0].verification_status='unverified');
rejection('blocks stale truth bytes','TRUTH_STALE',(d,b)=>b.hashes['business-truth']='0'.repeat(64),{refresh:false});
rejection('blocks cross-business profile','BUSINESS_MISMATCH',d=>d['brand-profile'].business_id='another');
rejection('blocks unknown components','COMPONENT_INVALID',d=>d['site-config'].sections[1].component='custom');
rejection('blocks unexpected section data','COMPONENT_INVALID',d=>d['site-config'].sections[1].data.address='Invented');
rejection('blocks unverified section copy','CONTENT_UNVERIFIED',d=>d['site-config'].sections[1].data.body='Afirmación sin respaldo');
rejection('blocks unverified SEO','SEO_UNVERIFIED',d=>d['site-config'].seo.title='El mejor de Lima');
rejection('blocks unimplemented recipe gates','GATE_UNSUPPORTED',d=>d['vertical-recipe'].quality_policy.required_hard_gates.push('unknown-gate'));
rejection('blocks enabled integrations','FEATURE_BLOCKED',d=>d['site-config'].features.form=true);
rejection('blocks external hostname','HOST_BLOCKED',d=>d['site-config'].routing.primary_hostname='example.com');
rejection('blocks duplicate section IDs','DUPLICATE',d=>d['site-config'].sections[1].section_id='hero');
rejection('blocks unsafe site ID','SITE_ID_UNSAFE',d=>d['site-config'].site_id='../outside');
rejection('blocks missing disclosure','DISCLOSURE_MISSING',d=>d['site-config'].claim.disclosure_text='');
rejection('blocks rejected design','BRAND_REJECTED',d=>d['brand-profile'].status='rejected');
rejection('blocks unsupported layout','LAYOUT_UNSUPPORTED',d=>d['brand-profile'].layout_family='unimplemented');
test('builds real hashes and reuses identical verified output',()=>{
 const first=build(input,path.join(temporary,'build'));const again=build(input,path.join(temporary,'build'));
 assert.equal(again.destination,first.destination);assert.equal(again.reused,true);assert.equal(first.snapshot.qa.status,'not_run');
 verifyArtifacts(first.destination);
 fs.appendFileSync(path.join(first.destination,'index.html'),'tampered');
 assert.throws(()=>verifyArtifacts(first.destination),e=>e.code==='ARTIFACT_CORRUPT');
 assert.throws(()=>build(input,path.join(temporary,'build')),e=>e.code==='BUILD_CORRUPT');
});
test('invalid input fails before output is created',()=>{
 const directory=path.join(temporary,'bad-input');fs.mkdirSync(directory);
 const bundle=fresh();bundle.documents['site-config'].sections[0].data.headline='unsupported';rehash(bundle);
 for(const [k,v] of Object.entries(bundle.documents))fs.writeFileSync(path.join(directory,k+'.json'),encode(v));
 const output=path.join(temporary,'blocked-output');assert.throws(()=>build(directory,output));assert(!fs.existsSync(output));
});
test('preview limits host, methods, paths and exposes only intended assets',async()=>{
 const result=build(input,path.join(temporary,'server'));const server=createPreview(result.destination);
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 try{
  const url='http://127.0.0.1:'+server.address().port;
  const page=await fetch(url);assert.equal(page.status,200);assert.match(page.headers.get('x-robots-tag'),/noindex/);assert.match(page.headers.get('content-security-policy'),/frame-ancestors 'none'/);
  assert.equal((await fetch(url+'/styles.css')).status,200);
  assert.equal((await fetch(url+'/build-inputs.json')).status,404);
  assert.equal((await fetch(url+'/%2e%2e/package.json')).status,404);
  assert.equal((await fetch(url,{method:'POST'})).status,405);
  const hostStatus=await new Promise((resolve,reject)=>{const request=http.get(url,{headers:{Host:'evil.example'}},response=>{response.resume();resolve(response.statusCode);});request.on('error',reject);});
  assert.equal(hostStatus,403);
  assert.equal((await fetch(url,{headers:{Origin:'https://evil.example'}})).status,403);
  const head=await fetch(url,{method:'HEAD'});assert.equal(head.status,200);assert.equal(await head.text(),'');
 }finally{await new Promise(resolve=>server.close(resolve));}
});

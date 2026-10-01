'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const Ajv = require('ajv/dist/2020');
const addFormats = require('ajv-formats');
const ROOT = path.resolve(__dirname,'../..');
const VERSION='0.3.0';
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const encode = value => JSON.stringify(value,null,2)+'\n';
const ensure = (condition,code,message) => {if(!condition){const e=new Error(message);e.code=code;throw e;}};
const walk = directory => fs.readdirSync(directory,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(directory,e.name)):[path.join(directory,e.name)]);
const ajv = new Ajv({allErrors:true,strict:false,validateFormats:true});
addFormats(ajv);
for(const file of walk(path.join(ROOT,'contracts')).filter(f=>f.endsWith('.schema.json'))) ajv.addSchema(JSON.parse(fs.readFileSync(file,'utf8')));
function validate(kind,document){
 const v=ajv.getSchema('https://schemas.hazlocrecer.com/'+kind+'.schema.json');
 ensure(v && v(document),'SCHEMA_INVALID',kind+': '+JSON.stringify(v?.errors));
}
const string = {type:'string',minLength:1,maxLength:5000};
const closed = properties => ({type:'object',additionalProperties:false,required:Object.keys(properties),properties});
const componentSchemas={
 hero:closed({headline:string}),
 about:closed({body:string}),
 services:closed({items:{type:'array',minItems:1,maxItems:100,items:closed({service_id:string,name:string})}})
};
const componentValidators=Object.fromEntries(Object.entries(componentSchemas).map(([k,s])=>[k,ajv.compile(s)]));
function loadInputs(directory){
 const documents={},hashes={};
 for(const kind of ['business-truth','vertical-recipe','brand-profile','site-config']){
  const raw=fs.readFileSync(path.join(directory,kind+'.json'));
  documents[kind]=JSON.parse(raw.toString('utf8'));hashes[kind]=sha(raw);
 }
 return {documents,hashes};
}
function pointer(value,p){
 ensure(/^\/(?:[^~]|~[01])*$/.test(p),'POINTER_INVALID','Invalid JSON pointer');
 return p.slice(1).split('/').reduce((v,k)=>{
  k=k.replace(/~1/g,'/').replace(/~0/g,'~');
  ensure(v!==null&&typeof v==='object'&&Object.hasOwn(v,k),'POINTER_MISSING','Missing truth path '+p);
  return v[k];
 },value);
}
function unique(items,label){ensure(new Set(items).size===items.length,'DUPLICATE',label+' must be unique');}
function gates(bundle){
 const {documents:doc,hashes}=bundle;
 for(const [kind,value] of Object.entries(doc)) validate(kind,value);
 const t=doc['business-truth'],r=doc['vertical-recipe'],b=doc['brand-profile'],c=doc['site-config'];
 ensure(c.mode==='demo'&&c.status==='DRAFT','MODE_BLOCKED','This engine supports local DRAFT demos only');
 ensure(c.seo.indexing==='noindex'&&c.claim.banner_enabled,'INDEX_BLOCKED','Demo must disclose its status and remain noindex');
 ensure(typeof c.claim.disclosure_text==='string'&&c.claim.disclosure_text.includes('FICTIC'),'DISCLOSURE_MISSING','Synthetic disclosure required');
 ensure(c.seo.canonical_url===null&&c.claim.claim_url===null,'EXTERNAL_ACTION','External canonical and claim URLs are not supported');
 ensure(c.routing.primary_hostname.endsWith('.invalid')&&!(c.routing.aliases||[]).length,'HOST_BLOCKED','Synthetic hostname must end in .invalid without aliases');
 ensure(c.tenant_id===null,'TENANT_BLOCKED','Synthetic demos cannot claim a tenant');
 ensure(t.publication_policy.may_generate_demo&&!t.publication_policy.may_index_demo&&t.publication_policy.requires_human_review,'POLICY_BLOCKED','Synthetic generation policy required');
 ensure(Object.values(c.features).every(value=>value===false)&&(c.assets||[]).length===0,'FEATURE_BLOCKED','Integrations and assets are not supported in this local release');
 ensure(/^[a-z0-9][a-z0-9-]{0,79}$/.test(c.site_id),'SITE_ID_UNSAFE','Unsafe site_id');
 ensure(b.business_id===t.business_id&&c.business_id===t.business_id,'BUSINESS_MISMATCH','Cross-business input rejected');
 for(const x of [b,c]){
  ensure(x.truth_snapshot.content_hash===hashes['business-truth']&&x.truth_snapshot.business_truth_version===t.schema_version,'TRUTH_STALE','Stale BusinessTruth reference');
  ensure(x.recipe.recipe_id===r.recipe_id&&x.recipe.recipe_version===r.schema_version,'RECIPE_MISMATCH','Recipe reference mismatch');
 }
 ensure(b.recipe.content_hash===hashes['vertical-recipe'],'RECIPE_STALE','Stale recipe hash');
 ensure(c.brand_profile_ref===b.brand_profile_id,'BRAND_MISMATCH','Brand profile reference mismatch');
 ensure(['proposed','approved'].includes(b.status),'BRAND_REJECTED','Rejected brand cannot render');
 ensure(r.verticals.includes(t.identity.primary_category),'VERTICAL_MISMATCH','Business category not supported by recipe');
 ensure(b.layout_family==='single-column'&&(r.design_policy?.allowed_layout_families||[]).includes(b.layout_family),'LAYOUT_UNSUPPORTED','Only single-column layout is implemented');
 ensure(['inform'].includes(b.primary_goal),'GOAL_UNSUPPORTED','This release only supports informational sites');
 const supportedGates=['provenance','noindex','synthetic_disclosure'];
 ensure((r.quality_policy.required_hard_gates||[]).every(g=>supportedGates.includes(g)),'GATE_UNSUPPORTED','Recipe requires an unimplemented hard gate');
 unique(t.sources.map(s=>s.source_id),'source IDs');unique(t.field_provenance.map(p=>p.field_path),'provenance paths');
 const sources=new Map(t.sources.map(s=>[s.source_id,s]));
 const provenance=new Map(t.field_provenance.map(p=>[p.field_path,p]));
 // This is an explicit synthetic-only allowlist, not a legal clearance engine.
 for(const s of t.sources) ensure(s.source_type==='other'&&s.uri?.startsWith('urn:todolima:fixture:')&&s.rights_status==='approved_for_internal_use','SOURCE_BLOCKED','Only internal synthetic fixture sources are accepted');
 for(const p of t.field_provenance){pointer(t,p.field_path);ensure(p.source_ids.every(id=>sources.has(id)),'SOURCE_MISSING','Unknown provenance source');}
 const fact = p => {
  const value=pointer(t,p),proof=provenance.get(p);
  ensure(value!==null&&proof&&['source_verified','owner_verified'].includes(proof.verification_status),'FACT_UNVERIFIED','Unverified or missing fact '+p);
  return value;
 };
 for(const p of r.truth_requirements.minimum_paths) fact(p);
 fact('/identity/display_name');fact('/identity/primary_category');
 for(const f of b.content.facts) for(const e of f.evidence){
  ensure(f.text===fact(e.field_path),'FACT_MISMATCH','Brand fact differs from truth');
  ensure(e.source_ids.every(id=>provenance.get(e.field_path).source_ids.includes(id)),'EVIDENCE_MISMATCH','Brand evidence differs from provenance');
 }
 ensure(c.seo.title===fact('/identity/display_name'),'SEO_UNVERIFIED','SEO title must match verified name');
 if(c.seo.meta_description!==null&&c.seo.meta_description!==undefined)ensure(c.seo.meta_description===fact('/description'),'SEO_UNVERIFIED','SEO description must match verified description');
 unique(c.sections.map(s=>s.section_id),'section IDs');unique(c.sections.map(s=>s.order),'section order');
 unique(r.sections.map(s=>s.component),'recipe components');
 const sections=c.sections.filter(s=>s.enabled).sort((a,b)=>a.order-b.order);
 ensure(sections.filter(s=>s.component==='hero').length===1&&sections[0].component==='hero','HERO_REQUIRED','Exactly one hero must be first');
 for(const s of c.sections){
  ensure(/^[a-z][a-z0-9-]{0,79}$/.test(s.section_id)&&!['main','top'].includes(s.section_id),'SECTION_ID_UNSAFE','Invalid or reserved section ID');
  const cv=componentValidators[s.component];
  ensure(cv&&cv(s.data),'COMPONENT_INVALID','Unsupported component or invalid data: '+s.component);
  ensure(!s.variant,'VARIANT_UNSUPPORTED','Component variants are not implemented');
  const recipeSection=r.sections.find(x=>x.component===s.component);
  ensure(recipeSection,'COMPONENT_BLOCKED','Component absent from recipe');
  if(!s.enabled)continue;
  for(const p of recipeSection.requires_truth_paths||[])fact(p);
  if(s.component==='hero')ensure(s.data.headline===fact('/identity/display_name'),'CONTENT_UNVERIFIED','Hero differs from verified business name');
  if(s.component==='about')ensure(s.data.body===fact('/description'),'CONTENT_UNVERIFIED','About differs from verified description');
  if(s.component==='services'){
   unique(s.data.items.map(x=>x.service_id),'service IDs');
   unique((t.services||[]).map(x=>x.service_id),'truth service IDs');
   for(const service of s.data.items){
    const i=(t.services||[]).findIndex(x=>x.service_id===service.service_id);
    ensure(i>=0,'SERVICE_MISSING','Service not in BusinessTruth');
    ensure(['source_verified','owner_verified'].includes(t.services[i].verification_status),'SERVICE_UNVERIFIED','Service is unverified');
    ensure(service.name===fact('/services/'+i+'/name'),'SERVICE_UNVERIFIED','Service name not verified');
   }
  }
 }
 return {truth:t,recipe:r,brand:b,config:c,sections};
}
const escape = text => String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const labels={hero:'Inicio',about:'Información',services:'Servicios'};
function render(bundle){
 const {truth,brand,config,sections}=gates(bundle);
 const others=sections.filter(s=>s.component!=='hero');
 const nav=sections.map(s=>`<a href="#${escape(s.section_id)}">${labels[s.component]}</a>`).join('');
 const components={
  hero:s=>`<section class="hero" id="${s.section_id}" aria-labelledby="title-${s.section_id}"><div class="hero-copy"><p class="eyebrow">Un espacio para conocer</p><h1 id="title-${s.section_id}">${escape(s.data.headline)}</h1><p class="intro">Información clara, reunida en un solo lugar.</p>${others.length?`<a class="button" href="#${others[0].section_id}">Explorar información <span aria-hidden="true">↗</span></a>`:''}<p class="small-note">Prototipo local · Sin solicitudes ni transacciones</p></div><div class="graphic" aria-hidden="true"><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><div class="graphic-center">E<span>Ejemplo</span></div><span class="graphic-caption">Identidad visual de muestra</span></div></section>`,
  about:s=>`<section class="content-section" id="${s.section_id}" aria-labelledby="title-${s.section_id}"><div><p class="eyebrow">Lo esencial</p><h2 id="title-${s.section_id}">Acerca de este espacio</h2></div><div class="information-card"><p>${escape(s.data.body)}</p><span class="card-label">Contenido de demostración</span></div></section>`,
  services:s=>`<section class="services-section" id="${s.section_id}" aria-labelledby="title-${s.section_id}"><p class="eyebrow">Qué encontrarás</p><h2 id="title-${s.section_id}">Servicios de ejemplo</h2><ul class="service-grid">${s.data.items.map((item,i)=>`<li><span class="service-number" aria-hidden="true">${String(i+1).padStart(2,'0')}</span><h3>${escape(item.name)}</h3></li>`).join('')}</ul></section>`
 };
 const html=`<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex,nofollow"><meta name="description" content="${escape(config.seo.meta_description||'Demostración ficticia local.')}"><title>${escape(config.seo.title)}</title><link rel="stylesheet" href="styles.css"></head>
<body id="top"><a class="skip-link" href="#main">Saltar al contenido</a><div class="demo-notice"><span class="notice-dot" aria-hidden="true"></span><p>${escape(config.claim.disclosure_text)}</p></div>
<header class="site-header"><a class="wordmark" href="#top" aria-label="Volver al inicio"><span class="brand-symbol" aria-hidden="true">E</span><span>Espacio de ejemplo<small>Demostración local</small></span></a><nav aria-label="Navegación principal">${nav}</nav></header>
<main id="main" tabindex="-1">${sections.map(s=>components[s.component](s)).join('\n')}<aside class="closing-note" aria-label="Aviso sobre la demostración"><span aria-hidden="true">✳</span><div><h2>Una muestra, con total claridad.</h2><p>Este espacio utiliza datos ficticios. No representa un negocio real y no recibe consultas ni pagos.</p></div></aside></main>
<footer><span>${escape(truth.identity.display_name)}</span><a href="#top">Volver arriba <span aria-hidden="true">↑</span></a></footer></body></html>\n`;
 const c=brand.color_tokens;
 const css=`:root{--primary:${c.primary};--paper:${c.background};--ink:${c.text};--accent:${c.accent};--font:${brand.type_scale.font_family};font-family:var(--font);color:var(--ink);background:var(--paper);font-size:${brand.type_scale.body_px}px;line-height:1.6}*{box-sizing:border-box}html{scroll-padding-top:2rem}body{margin:0}a{color:var(--primary);text-underline-offset:.3em}a:focus-visible{outline:3px solid var(--accent);outline-offset:5px;border-radius:2px}p,h1,h2,h3{margin-top:0}h1,h2,h3{line-height:1.12;letter-spacing:-.045em;overflow-wrap:anywhere}p{overflow-wrap:anywhere}.skip-link{position:absolute;left:1rem;top:-10rem;z-index:10;background:var(--paper);padding:.75rem}.skip-link:focus{top:1rem}.demo-notice{padding:.7rem 5%;display:flex;justify-content:center;align-items:center;gap:.75rem;border-bottom:1px solid #CBD5E1;font-size:.75rem}.demo-notice p{margin:0}.notice-dot{width:.5rem;height:.5rem;border-radius:50%;background:var(--accent);flex-shrink:0}.site-header,main,footer{max-width:1200px;margin:auto;padding-left:3rem;padding-right:3rem}.site-header{min-height:116px;display:flex;justify-content:space-between;align-items:center;gap:2rem}.wordmark{display:flex;gap:.8rem;align-items:center;text-decoration:none;font-weight:700;line-height:1.3;color:var(--ink)}.wordmark small{display:block;font-weight:400;font-size:.7rem;letter-spacing:.07em;text-transform:uppercase;margin-top:.3rem}.brand-symbol{border:1px solid var(--primary);width:2.65rem;height:2.65rem;border-radius:50%;display:grid;place-items:center;font-family:serif;font-size:1.7rem}nav{display:flex;gap:1.5rem;flex-wrap:wrap}nav a{font-size:.85rem;text-decoration:none}nav a:hover{text-decoration:underline}.hero{display:grid;grid-template-columns:1.2fr 1fr;gap:3rem;align-items:center;padding:4rem 0 5rem;border-bottom:1px solid #CBD5E1}.eyebrow{font-size:.7rem;letter-spacing:.17em;text-transform:uppercase;font-weight:700;margin-bottom:1.5rem}h1{font-size:clamp(2.3rem,4.8vw,${brand.type_scale.heading_px*1.8}px);font-weight:500;margin-bottom:1.6rem;max-width:12ch}.intro{font-size:1.1rem;max-width:27ch;margin-bottom:2rem}.button{display:inline-flex;gap:2rem;align-items:center;border:1px solid var(--primary);border-radius:3rem;padding:.9rem 1.5rem;text-decoration:none;font-size:.85rem}.button:hover{background:#F1F5F9}.small-note{font-size:.65rem;margin-top:1.2rem}.graphic{position:relative;aspect-ratio:1/1.05;overflow:hidden;border-radius:50% 50% .5rem .5rem;border:1px solid #CBD5E1;background:linear-gradient(140deg,#F1F5F9,#E2E8F0);display:grid;place-items:center;color:#164E63}.orbit{position:absolute;width:85%;height:85%;border:1px solid #94A3B8;border-radius:50%;transform:rotate(-30deg) scaleX(.65)}.orbit-two{transform:rotate(35deg) scaleX(.65)}.graphic-center{font-family:serif;font-size:8rem;line-height:1;text-align:center;z-index:1}.graphic-center span{display:block;font-family:var(--font);font-size:.7rem;letter-spacing:.25em;text-transform:uppercase;margin-top:1rem}.graphic-caption{position:absolute;bottom:1.5rem;font-size:.6rem;letter-spacing:.08em}.content-section{display:grid;grid-template-columns:1fr 1.2fr;gap:3rem;padding:5rem 0}.content-section h2,.services-section h2{font-size:2.3rem;font-weight:500;max-width:13ch}.information-card{border:1px solid #CBD5E1;padding:2.2rem;border-radius:.75rem;display:flex;flex-direction:column;justify-content:space-between;gap:2rem}.information-card p{font-size:1.2rem;margin:0}.card-label{font-size:.65rem;letter-spacing:.08em;text-transform:uppercase}.closing-note{display:flex;gap:1.5rem;padding:2rem;background:#F1F5F9;color:#172554;border-radius:.75rem;margin:0 0 4rem}.closing-note>span{font-size:2rem}.closing-note h2{font-size:1.4rem;letter-spacing:-.02em;margin-bottom:.5rem}.closing-note p{font-size:.85rem;max-width:64ch;margin:0}footer{border-top:1px solid #CBD5E1;padding-top:1.7rem;padding-bottom:1.7rem;display:flex;justify-content:space-between;gap:2rem;font-size:.75rem}footer span{overflow-wrap:anywhere}.services-section{padding:0 0 4rem}.service-grid{list-style:none;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr));gap:1rem}.service-grid li{border:1px solid #CBD5E1;padding:1.5rem;border-radius:.75rem}.service-number{font-size:.75rem}.service-grid h3{font-size:1.3rem;margin-top:1.5rem;margin-bottom:0}@media(max-width:700px){.site-header,main,footer{padding-left:1.25rem;padding-right:1.25rem}.site-header{padding-top:1.5rem;padding-bottom:1.5rem;align-items:flex-start;flex-direction:column;gap:1.4rem}.demo-notice{align-items:flex-start;text-align:left;padding:.75rem 1.25rem}.notice-dot{margin-top:.35rem}nav{gap:1.3rem}.hero{grid-template-columns:1fr;gap:2.5rem;padding:2rem 0 3rem}h1{max-width:14ch}.graphic{max-width:420px;width:100%;aspect-ratio:1.3}.graphic-center{font-size:6rem}.content-section{grid-template-columns:1fr;gap:1rem;padding:3rem 0}.information-card{padding:1.5rem}.closing-note{padding:1.5rem;margin-bottom:3rem}.closing-note>span{display:none}footer{flex-direction:column;gap:.75rem}}@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important}}\n`;
 return {html,css};
}
function build(inputDirectory,outputDirectory){
 const bundle=loadInputs(inputDirectory);
 const {html,css}=render(bundle); // Gates run before any output is written.
 const {documents:d,hashes:h}=bundle,c=d['site-config'],b=d['brand-profile'];
 const buildId=sha(encode({version:VERSION,hashes:h,html:sha(html),css:sha(css)})).slice(0,20);
 // Each build gets an immutable directory. No stale QA can survive a rebuild.
 const destination=path.resolve(outputDirectory,c.site_id,buildId);
 if(fs.existsSync(destination)){
  const existing=JSON.parse(fs.readFileSync(path.join(destination,'site-snapshot.json'),'utf8'));validate('site-snapshot',existing);
  ensure(existing.build.build_id===buildId&&existing.site_config_hash===h['site-config'],'BUILD_CORRUPT','Existing snapshot differs from inputs');
  for(const [file,content] of [['index.html',html],['styles.css',css]]){
   const artifact=existing.artifacts.find(a=>a.path===file);
   ensure(artifact&&artifact.sha256===sha(content)&&artifact.bytes===Buffer.byteLength(content)&&fs.readFileSync(path.join(destination,file)).equals(Buffer.from(content)),'BUILD_CORRUPT','Existing artifact differs from build');
  }
  return {destination,snapshot:existing,reused:true};
 }
 const created=new Date().toISOString();
 const snapshot={schema_version:'0.1.0',snapshot_id:'snapshot-'+buildId,site_id:c.site_id,business_id:c.business_id,site_config_hash:h['site-config'],truth_snapshot:c.truth_snapshot,brand_profile:{brand_profile_id:b.brand_profile_id,content_hash:h['brand-profile']},recipe:b.recipe,mode:c.mode,indexing:c.seo.indexing,build:{build_id:buildId,engine_version:VERSION,created_at:created},entrypoint:'index.html',artifacts:[{path:'index.html',media_type:'text/html',sha256:sha(html),bytes:Buffer.byteLength(html)},{path:'styles.css',media_type:'text/css',sha256:sha(css),bytes:Buffer.byteLength(css)}],qa:{status:'not_run',report_ref:null},publication:{status:'not_published',url:null}};
 validate('site-snapshot',snapshot);
 fs.mkdirSync(destination,{recursive:true});
 fs.writeFileSync(path.join(destination,'index.html'),html);fs.writeFileSync(path.join(destination,'styles.css'),css);
 fs.writeFileSync(path.join(destination,'site-snapshot.json'),encode(snapshot));
 fs.writeFileSync(path.join(destination,'build-inputs.json'),encode({engine_version:VERSION,hashes:h,documents:d}));
 return {destination,snapshot};
}
module.exports={ROOT,VERSION,sha,encode,ensure,validate,loadInputs,gates,render,build,componentSchemas};

'use strict';
const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const ROOT=path.resolve(__dirname,'..');const {buildExperience,renderExperience}=require('../packages/real-estate-experience/index.cjs');const {buildAll}=require('../packages/real-estate-renderer/index.cjs');const {server}=require('../scripts/serve-experience.cjs');
const profiles=JSON.parse(fs.readFileSync(path.join(ROOT,'pilot/profiles.json'),'utf8')).profiles,catalog=JSON.parse(fs.readFileSync(path.join(ROOT,'pilot/catalog.json'),'utf8'));

test('five archetypes produce five distinct validated conversion modules',()=>{const models=profiles.map(profile=>buildExperience(profile,catalog));assert.deepEqual(models.map(x=>x.module_type),['catalog_search','project_timeline','advisory_path','lot_comparison','valuation_brief']);assert.equal(new Set(models.map(x=>x.module_type)).size,5);for(const model of models){assert.equal(model.synthetic,true);assert.equal(model.action.enabled,false);}});

test('catalog search exposes decision filters and only known synthetic references',()=>{const model=buildExperience(profiles[0],catalog);assert.equal(model.payload.filters.length,4);const known=new Set(catalog.items.map(item=>item.id));assert(model.payload.result_refs.every(ref=>known.has(ref)));});

test('developer journey marks unverified operational stages explicitly',()=>{const model=buildExperience(profiles[1],catalog);assert.equal(model.payload.stages.length,4);assert(model.payload.stages.filter(stage=>stage.status==='requires_verification').length>=3);});

test('advisory and valuation modules ask different questions',()=>{const advisory=buildExperience(profiles[2],catalog),valuation=buildExperience(profiles[4],catalog);assert.notDeepEqual(advisory.payload.questions.map(x=>x.key),valuation.payload.questions.map(x=>x.key));});

test('renderer blocks experience references outside the synthetic catalog',()=>{const model=buildExperience(profiles[0],catalog);model.payload.result_refs.push('unknown-property');assert.throws(()=>renderExperience(model,catalog),error=>error.code==='CATALOG_REFERENCE_UNKNOWN');});

test('professional pages embed one tailored module without forms or enabled contact',()=>{buildAll();for(const profile of profiles){const html=fs.readFileSync(path.join(ROOT,'dist/visual-pilot',profile.id,'index.html'),'utf8');const model=buildExperience(profile,catalog);assert.match(html,new RegExp(`data-module="${model.module_type}"`));assert.equal((html.match(/class="experience-module"/g)||[]).length,1);assert.equal(html.includes('<form'),false);assert.match(html,/Contacto desactivado|contacto autorizado/i);}});

test('experience server is read-only, noindex and offline',async()=>{const app=server();await new Promise((resolve,reject)=>{app.once('error',reject);app.listen(0,'127.0.0.1',resolve);});try{const origin=`http://127.0.0.1:${app.address().port}`,page=await fetch(origin);assert.equal(page.status,200);assert.match(page.headers.get('x-robots-tag'),/noindex/);assert.match(page.headers.get('content-security-policy'),/connect-src 'none'/);assert.equal((await fetch(origin,{method:'POST'})).status,405);}finally{await new Promise(resolve=>app.close(resolve));}});

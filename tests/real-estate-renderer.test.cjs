'use strict';
const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const ROOT=path.resolve(__dirname,'..');const {buildAll,renderProfile,experiences}=require('../packages/real-estate-renderer/index.cjs');
const profiles=JSON.parse(fs.readFileSync(path.join(ROOT,'pilot/profiles.json'),'utf8')).profiles;
const catalog=JSON.parse(fs.readFileSync(path.join(ROOT,'pilot/catalog.json'),'utf8'));

test('renders five distinct gated experiences and twenty profile pages',()=>{
 const result=buildAll();
 assert.equal(result.results.length,5);assert.equal(result.results.reduce((n,r)=>n+r.pages,0),20);
 assert.equal(new Set(result.results.map(r=>r.archetype)).size,5);
 for(const r of result.results){assert.equal(r.indexing,'noindex');assert.equal(r.publication,'not_published');assert.ok(experiences[r.archetype]);}
});

test('every generated page is disclosed, noindex and free of real candidate identity',()=>{
 const root=path.join(ROOT,'dist/visual-pilot');
 const files=[];const walk=d=>fs.readdirSync(d,{withFileTypes:true}).forEach(e=>e.isDirectory()?walk(path.join(d,e.name)):files.push(path.join(d,e.name)));walk(root);
 const realNames=['Masterhouse','LIMAin','Lago y Alva','Lago & Alva','Abad','DSI'];
 for(const file of files.filter(f=>f.endsWith('.html'))){
  const html=fs.readFileSync(file,'utf8');
  assert.match(html,/noindex,nofollow/);assert.match(html,/DEMOSTRACIÓN FICTICIA|Datos y marcas ficticios/);
  assert.doesNotMatch(html,/\b[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}\b/);assert.doesNotMatch(html,/\+?51[\s-]*9\d{8}/);
  for(const name of realNames)assert.equal(html.includes(name),false,`${name} leaked into ${file}`);
  if(!file.endsWith(path.join('visual-pilot','index.html')))assert.equal((html.match(/<h1[ >]/g)||[]).length,1);
 }
});

test('all local links and image sources resolve',()=>{
 const root=path.join(ROOT,'dist/visual-pilot');const htmlFiles=[];
 const walk=d=>fs.readdirSync(d,{withFileTypes:true}).forEach(e=>e.isDirectory()?walk(path.join(d,e.name)):e.name.endsWith('.html')&&htmlFiles.push(path.join(d,e.name)));walk(root);
 for(const file of htmlFiles){const html=fs.readFileSync(file,'utf8');for(const match of html.matchAll(/(?:href|src)="([^"#]+)(?:#[^"]*)?"/g)){const ref=match[1];if(/^(?:https?:|mailto:|tel:)/.test(ref))continue;assert.ok(fs.existsSync(path.resolve(path.dirname(file),ref)),`${ref} missing from ${file}`);}}
});

test('renderer refuses a profile that differs from validated central inputs',()=>{
 const profile={...profiles[0],name:'Nombre alterado — FICTICIO'};
 assert.throws(()=>renderProfile(profile,path.join(ROOT,'pilot/generated-inputs',profiles[0].id),path.join(ROOT,'dist/rejected'),catalog),error=>error.code==='PROFILE_MISMATCH');
});

test('visual catalog is explicitly synthetic and assets are present',()=>{
 assert.equal(catalog.synthetic,true);assert.equal(catalog.items.length,3);
 for(const item of catalog.items)assert.ok(fs.existsSync(path.join(ROOT,'dist/visual-pilot/assets',item.image)));
});

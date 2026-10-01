'use strict';
const fs=require('node:fs');const path=require('node:path');const {sha,encode}=require('../site-engine/index.cjs');
const ROOT=path.resolve(__dirname,'../..');
const clone=v=>JSON.parse(JSON.stringify(v));
function adapt(profile,templateDirectory=path.join(ROOT,'examples/golden-business')){
 const read=name=>JSON.parse(fs.readFileSync(path.join(templateDirectory,name+'.json'),'utf8'));
 const truth=clone(read('business-truth')),recipe=clone(read('vertical-recipe')),brand=clone(read('brand-profile')),site=clone(read('site-config'));
 const id='pilot-'+profile.id,source='fixture-'+profile.id;
 truth.business_id=id;truth.identity.display_name=profile.name;truth.identity.primary_category='agentes-inmobiliarios';truth.description=profile.description;
 truth.sources[0].source_id=source;truth.sources[0].uri='urn:todolima:fixture:'+profile.id;truth.sources[0].notes='Perfil sintético derivado de requisitos de experiencia; no representa al candidato real.';
 for(const p of truth.field_provenance){p.source_ids=[source];p.notes='Verificado únicamente contra el fixture sintético del piloto.';}
 truth.updated_at='2026-09-30T06:00:00Z';
 recipe.recipe_id='real-estate-'+profile.archetype;recipe.name='Receta sintética: '+profile.archetype;recipe.verticals=['agentes-inmobiliarios'];recipe.design_policy.tone_keywords=['claro','editorial',profile.archetype];
 const truthRaw=encode(truth),recipeRaw=encode(recipe),truthHash=sha(truthRaw),recipeHash=sha(recipeRaw);
 brand.brand_profile_id='brand-'+profile.id;brand.business_id=id;brand.truth_snapshot.content_hash=truthHash;brand.recipe={recipe_id:recipe.recipe_id,recipe_version:recipe.schema_version,content_hash:recipeHash};brand.primary_audience=profile.audience;brand.visual_direction=profile.archetype;brand.color_tokens=profile.colors;brand.content.facts[0].text=profile.name;brand.content.facts[0].evidence[0].source_ids=[source];brand.content.facts[1].text=profile.description;brand.content.facts[1].evidence[0].source_ids=[source];brand.created_at='2026-09-30T06:00:00Z';
 site.site_id=profile.id;site.business_id=id;site.brand_profile_ref=brand.brand_profile_id;site.truth_snapshot.content_hash=truthHash;site.recipe={recipe_id:recipe.recipe_id,recipe_version:recipe.schema_version};site.routing.primary_hostname=profile.id+'.invalid';site.seo.title=profile.name;site.seo.meta_description=profile.description;site.sections[0].data.headline=profile.name;site.sections[1].data.body=profile.description;
 return {'business-truth':truth,'vertical-recipe':recipe,'brand-profile':brand,'site-config':site};
}
function writeProfile(profile,directory){const docs=adapt(profile);fs.mkdirSync(directory,{recursive:true});for(const [name,value] of Object.entries(docs))fs.writeFileSync(path.join(directory,name+'.json'),encode(value));fs.writeFileSync(path.join(directory,'PROFILE.json'),encode({profile_id:profile.id,archetype:profile.archetype,synthetic:true,requirements_only:true}));return directory;}
module.exports={adapt,writeProfile};

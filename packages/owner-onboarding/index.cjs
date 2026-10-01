'use strict';
const fs=require('node:fs');const path=require('node:path');const Ajv=require('ajv/dist/2020');const addFormats=require('ajv-formats');
const ROOT=path.resolve(__dirname,'../..');const schema=JSON.parse(fs.readFileSync(path.join(ROOT,'contracts/owner-submission.schema.json'),'utf8'));
const ajv=new Ajv({allErrors:true,strict:false,validateFormats:true});addFormats(ajv);const validator=ajv.compile(schema);
const clone=v=>structuredClone(v);const slug=v=>String(v).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,80);
function validateSubmission(value){if(!validator(value)){const error=new Error('OwnerSubmission invalid: '+JSON.stringify(validator.errors));error.code='OWNER_SUBMISSION_INVALID';error.details=validator.errors;throw error;}return value;}
function readiness(value){
 validateSubmission(value);const checks=[];const add=(id,ok,label)=>checks.push({id,status:ok?'passed':'blocked',label});
 add('owner-status',value.status==='owner_confirmed','Confirmación del representante');
 add('declarations',Object.values(value.declarations).every(Boolean),'Declaraciones completas');
 add('service-area',value.service_areas.length>0,'Zona de servicio declarada');
 add('services',value.services.length>0,'Oferta declarada');
 const contact=value.contacts.preferred_channel==='none'||(value.contacts.preferred_channel==='email'?Boolean(value.contacts.public_email):Boolean(value.contacts.public_phone));
 add('contact',contact,'Canal público coherente');
 const assets=value.assets.every(a=>a.usage_status==='approved'&&a.relationship!=='unknown'&&Boolean(a.permission_note));
 add('asset-rights',assets,'Derechos de activos documentados');
 add('human-review',false,'Revisión humana de HazloCrecer');
 const ownerReady=checks.slice(0,-1).every(c=>c.status==='passed');
 return {status:ownerReady?'ready_for_human_review':'blocked',checks,publication:{may_generate_private_demo:ownerReady,may_publish:false,may_index:false}};
}
function toBusinessTruth(value,now=value.updated_at){
 validateSubmission(value);const state=readiness(value);if(!state.publication.may_generate_private_demo){const e=new Error('Owner submission is not ready for a private demo');e.code='ONBOARDING_BLOCKED';e.checks=state.checks;throw e;}
 const sourceId='owner-submission-'+slug(value.submission_id);const source={source_id:sourceId,source_type:'owner',uri:'urn:hazlocrecer:onboarding:'+value.submission_id,captured_at:value.owner_confirmed_at,rights_status:'needs_review',acquisition_method:'Declaración directa mediante onboarding local',notes:'Confirmado por representante; pendiente de revisión humana antes de publicar.'};
 const services=value.services.map(s=>({service_id:s.service_id,name:s.name,description:s.description,price_amount:null,price_currency:null,verification_status:'owner_verified'}));
 const contacts={phones:[],emails:[],websites:[],social_profiles:[]};if(value.contacts.public_phone)contacts.phones.push({value:value.contacts.public_phone,kind:value.contacts.preferred_channel==='whatsapp'?'whatsapp':'phone',label:'Contacto público declarado',is_primary:true});if(value.contacts.public_email)contacts.emails.push({value:value.contacts.public_email,label:'Correo público declarado',is_primary:true});
 const truth={schema_version:'0.1.0',business_id:value.business_id,identity:{display_name:value.identity.display_name,legal_name:value.identity.legal_name,primary_category:value.identity.primary_category,secondary_categories:[]},description:value.business_profile.description,location:null,contacts,hours:[],services,assets:value.assets.map(a=>({asset_id:a.asset_id,kind:a.kind,uri:a.reference,relationship_to_business:a.relationship==='commissioned'?'real_business_asset':a.relationship,usage_status:a.usage_status,license_or_permission:a.permission_note})),owner_confirmed_at:value.owner_confirmed_at,sources:[source],field_provenance:[],publication_policy:{may_generate_demo:true,may_index_demo:false,reason:'Demo privada solicitada por representante; publicación bloqueada hasta revisión humana.',requires_human_review:true},created_at:value.created_at,updated_at:now};
 const paths=['/identity/display_name','/identity/legal_name','/identity/primary_category','/description'];for(let i=0;i<services.length;i++){paths.push(`/services/${i}/name`,`/services/${i}/description`);}truth.field_provenance=paths.map(field_path=>({field_path,source_ids:[sourceId],verification_status:'owner_verified',confidence:1,last_verified_at:value.owner_confirmed_at,notes:'Declarado por representante autorizado; pendiente de revisión editorial y documental.'}));
 return truth;
}
function publicSummary(value){validateSubmission(value);return {business_id:value.business_id,display_name:value.identity.display_name,status:value.status,service_areas:value.service_areas,services:value.services.map(s=>s.name),primary_action:value.business_profile.primary_action,asset_count:value.assets.length,readiness:readiness(value)};}
module.exports={validateSubmission,readiness,toBusinessTruth,publicSummary,slug};

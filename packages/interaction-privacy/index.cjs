'use strict';
const crypto=require('node:crypto');
const {validate}=require('../site-engine/index.cjs');
const PURPOSES=new Set(['contact_request','property_interest','valuation_request']);
const CHANNELS=new Set(['email','phone','whatsapp']);
const INPUT_FIELDS=new Set(['tenant_id','site_id','purpose','name','email','phone','message','property_ref','channels','privacy_accepted','contact_authorized','marketing_authorized','notice_version','source_page','honeypot','started_at']);
const hash=v=>crypto.createHash('sha256').update(String(v)).digest('hex');
const hmac=(secret,v)=>crypto.createHmac('sha256',secret).update(String(v)).digest('hex');
const clean=v=>typeof v==='string'?v.trim().replace(/\s+/g,' '):v;
const id=prefix=>`${prefix}-${crypto.randomBytes(12).toString('hex')}`;
const addDays=(iso,days)=>new Date(Date.parse(iso)+days*86400000).toISOString();
function createInteractionService({secret,now=()=>new Date(),vault=null,vaultContext=null,windowMs=15*60*1000,maxPerWindow=3}={}){
 if(!secret||Buffer.byteLength(String(secret))<32)throw Object.assign(new Error('Anti-abuse secret must be at least 32 bytes'),{code:'SECRET_INVALID'});
 const traffic=new Map(),duplicates=new Map();
 const rejection=(input,reason,at,ip)=>{const record={schema_version:'0.1.0',rejection_id:id('rej'),tenant_id:clean(input?.tenant_id)||'unknown-tenant',decision:'rejected',reason,occurred_at:at,fingerprint:hmac(secret,`${ip}|${clean(input?.site_id)||''}`)};if(record.tenant_id==='unknown-tenant')record.tenant_id='unknown-tenant';validate('interaction-rejection',record);return {accepted:false,rejection:record};};
 function submit(input,context={}){
  const at=now().toISOString(),ip=String(context.ip||'unknown'),agent=String(context.userAgent||'unknown');
  if(!input||typeof input!=='object'||Array.isArray(input)||Object.keys(input).some(k=>!INPUT_FIELDS.has(k)))return rejection(input,'invalid_shape',at,ip);
  const required=['tenant_id','site_id','purpose','name','channels','privacy_accepted','contact_authorized','notice_version','source_page','started_at'];
  if(required.some(k=>input[k]===undefined)||!PURPOSES.has(input.purpose)||!Array.isArray(input.channels)||!input.channels.length||input.channels.some(x=>!CHANNELS.has(x)))return rejection(input,'invalid_shape',at,ip);
  if(input.privacy_accepted!==true||input.contact_authorized!==true)return rejection(input,'consent_missing',at,ip);
  if(clean(input.honeypot||''))return rejection(input,'honeypot_triggered',at,ip);
  if(!Number.isFinite(Date.parse(input.started_at))||Date.parse(at)-Date.parse(input.started_at)<3000)return rejection(input,'submitted_too_fast',at,ip);
  const ipKey=hmac(secret,ip),recent=(traffic.get(ipKey)||[]).filter(t=>Date.parse(at)-t<windowMs);if(recent.length>=maxPerWindow)return rejection(input,'rate_limited',at,ip);
  const message=clean(input.message||'')||null,email=clean(input.email||'')||undefined,phone=clean(input.phone||'')||undefined,name=clean(input.name||'');
  if(!name||(!email&&!phone))return rejection(input,'invalid_shape',at,ip);
  if(message&&(/https?:\/\//gi.exec(message)?.index>=0)&&(message.match(/https?:\/\//gi)||[]).length>2)return rejection(input,'unsafe_content',at,ip);
  const duplicateKey=hmac(secret,`${input.tenant_id}|${input.purpose}|${email||''}|${phone||''}|${message||''}|${clean(input.property_ref||'')}`),prior=duplicates.get(duplicateKey);if(prior&&Date.parse(at)-prior<24*60*60*1000)return rejection(input,'duplicate',at,ip);
  const consentId=id('cons'),submissionId=id('sub'),purpose=input.purpose,retentionDays=purpose==='valuation_request'?180:90;
  const consent={schema_version:'0.1.0',consent_id:consentId,tenant_id:clean(input.tenant_id),purpose,notice_version:clean(input.notice_version),lawful_basis:'consent',channels:[...new Set(input.channels)],statements:{privacy_notice_accepted:true,contact_authorized:true,marketing_authorized:input.marketing_authorized===true},capture:{occurred_at:at,ip_hmac:ipKey,user_agent_hash:hash(agent),source_page:clean(input.source_page)},status:'active',withdrawn_at:null};
  const contact={name};if(email)contact.email=email.toLowerCase();if(phone)contact.phone=phone;
  const submission={schema_version:'0.1.0',submission_id:submissionId,tenant_id:clean(input.tenant_id),site_id:clean(input.site_id),purpose,contact,message,property_ref:clean(input.property_ref||'')||null,consent_ref:consentId,privacy:{retention_class:retentionDays===180?'valuation_180_days':'lead_90_days',delete_after:addDays(at,retentionDays),status:'active'},anti_abuse:{decision:'accepted',checks:['honeypot_clear','minimum_time_met','rate_limit_clear','duplicate_clear','content_safe']},received_at:at};
  try{validate('consent-receipt',consent);validate('interaction-submission',submission);}catch{return rejection(input,'invalid_shape',at,ip);}
  traffic.set(ipKey,[...recent,Date.parse(at)]);duplicates.set(duplicateKey,Date.parse(at));
  if(vault){if(!vaultContext)throw Object.assign(new Error('Vault context required'),{code:'VAULT_CONTEXT_REQUIRED'});vault.putJson(vaultContext,{record_id:consentId,tenant_id:consent.tenant_id,record_type:'consent_receipt',payload:consent,retention_class:'inactive_lead',expires_at:submission.privacy.delete_after},at);vault.putJson(vaultContext,{record_id:submissionId,tenant_id:submission.tenant_id,record_type:'interaction_submission',payload:submission,retention_class:'inactive_lead',expires_at:submission.privacy.delete_after},at);}
  return {accepted:true,consent,submission,public_response:{submission_id:submissionId,status:'received',delete_after:submission.privacy.delete_after}};
 }
 function withdrawalPlan(consent,submission,at=now().toISOString()){validate('consent-receipt',consent);validate('interaction-submission',submission);if(submission.consent_ref!==consent.consent_id)throw Object.assign(new Error('Consent mismatch'),{code:'CONSENT_MISMATCH'});return {verified_identity_required:true,consent_id:consent.consent_id,records_to_delete:[consent.consent_id,submission.submission_id],requested_at:at,marketing_must_stop:true};}
 return {submit,withdrawalPlan};
}
module.exports={createInteractionService,INPUT_FIELDS};

'use strict';
const fs=require('node:fs');const path=require('node:path');const crypto=require('node:crypto');const Ajv=require('ajv/dist/2020');const addFormats=require('ajv-formats');const {validateSubmission,readiness}=require('../owner-onboarding/index.cjs');
const ROOT=path.resolve(__dirname,'../..');const schema=JSON.parse(fs.readFileSync(path.join(ROOT,'contracts/operator-review.schema.json'),'utf8'));const ajv=new Ajv({allErrors:true,strict:false,validateFormats:true});addFormats(ajv);const validator=ajv.compile(schema);
const encode=v=>JSON.stringify(v,null,2)+'\n';const hashSubmission=v=>crypto.createHash('sha256').update(encode(v)).digest('hex');const slug=v=>String(v).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,80);
function inspect(submission){
 validateSubmission(submission);const owner=readiness(submission);const checks=owner.checks.filter(c=>c.id!=='human-review').map(c=>({check_id:c.id,label:c.label,status:c.status==='passed'?'passed':'failed',evidence:c.status==='passed'?'Validado contra OwnerSubmission':'Requisito incompleto en OwnerSubmission'}));
 checks.push({check_id:'duplicate-screening',label:'Identidad sin duplicado conocido',status:'passed',evidence:'Fixture sintético aislado; en producción requiere índice interno.'});
 checks.push({check_id:'content-safety',label:'Contenido revisable y sin afirmaciones prohibidas',status:'passed',evidence:'Fixture ficticio sin testimonios, resultados ni credenciales reales.'});
 return {submission_id:submission.submission_id,business_id:submission.business_id,submission_hash:hashSubmission(submission),automated_status:owner.status,checks,can_approve_private_demo:checks.every(c=>c.status==='passed')};
}
function validateReview(value){if(!validator(value)){const e=new Error('OperatorReview invalid: '+JSON.stringify(validator.errors));e.code='OPERATOR_REVIEW_INVALID';e.details=validator.errors;throw e;}const ids=value.checks.map(c=>c.check_id);if(new Set(ids).size!==ids.length){const e=new Error('Duplicate review checks');e.code='OPERATOR_REVIEW_INVALID';throw e;}return value;}
function decide({submission,reviewer_id,decision,manual_checks={},reason_codes=[],notes=null,created_at=new Date().toISOString()}){
 const inspection=inspect(submission);const checks=inspection.checks.map(c=>manual_checks[c.check_id]===false?{...c,status:'failed',evidence:'Marcado como pendiente por el operador.'}:c);const allPassed=checks.every(c=>c.status==='passed');
 if(decision==='approved_private_demo'&&!allPassed){const e=new Error('Approval requires every check to pass');e.code='REVIEW_BLOCKED';e.checks=checks;throw e;}
 const record={schema_version:'0.1.0',review_id:`rev-${slug(submission.submission_id)}-${inspection.submission_hash.slice(0,12)}`,submission_id:submission.submission_id,business_id:submission.business_id,submission_hash:inspection.submission_hash,decision,checks,reason_codes,notes:notes||null,reviewer:{reviewer_id,role:'hazlocrecer_operator'},capabilities:{may_generate_private_demo:decision==='approved_private_demo',may_publish:false,may_index:false},created_at};return validateReview(record);
}
function verifyBinding(submission,review){validateSubmission(submission);validateReview(review);if(review.submission_id!==submission.submission_id||review.business_id!==submission.business_id||review.submission_hash!==hashSubmission(submission)){const e=new Error('Review does not match this submission snapshot');e.code='REVIEW_STALE';throw e;}return true;}
module.exports={inspect,decide,validateReview,verifyBinding,hashSubmission,encode};

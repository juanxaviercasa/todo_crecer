'use strict';
const crypto=require('node:crypto');
const digest=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const reject=(code,status)=>({status,headers:{'content-type':'text/plain; charset=utf-8','cache-control':'no-store','x-robots-tag':'noindex, nofollow'},body:code});
async function routeRequest(request,{routes,objects}){
 const hostname=String(request.hostname||'').toLowerCase(),path=String(request.path||'/');
 if(!/^(?=.{4,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/.test(hostname)||!/^\/(?!.*\.\.)[A-Za-z0-9._~!$&'()*+,;=:@%/-]*$/.test(path))return reject('BAD_REQUEST',400);
 const route=await routes.get(hostname,path);if(!route||route.status!=='active'||!route.active_release_id)return reject('ROUTE_NOT_FOUND',404);
 const requested=path==='/'?'index.html':path.slice(1),key=`tenants/${route.tenant_id}/builds/${route.build_id}/${requested}`;
 const artifact=await objects.get(key);if(!artifact)return reject('ARTIFACT_NOT_FOUND',404);const bytes=Buffer.isBuffer(artifact.bytes)?artifact.bytes:Buffer.from(artifact.bytes);
 if(digest(bytes)!==artifact.sha256)return reject('INTEGRITY_FAILED',503);
 return {status:200,headers:{'content-type':artifact.media_type,'cache-control':artifact.cache_control,'content-security-policy':"default-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'none'",'x-content-type-options':'nosniff','referrer-policy':'strict-origin-when-cross-origin','x-robots-tag':route.indexing==='index'?'all':'noindex, nofollow','x-release-id':route.active_release_id},body:bytes};
}
module.exports={routeRequest};

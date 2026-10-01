const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const {ROOT,ensure,sha,validate}=require('./index.cjs');
function latestDirectory(output=path.join(ROOT,'dist')){
 const {directory}=JSON.parse(fs.readFileSync(path.join(output,'latest.json'),'utf8'));
 ensure(typeof directory==='string'&&/^[a-z0-9-]+\/[a-f0-9]{20}$/.test(directory),'LATEST_INVALID','Invalid latest build pointer');
 return path.join(output,...directory.split('/'));
}
function verifyArtifacts(directory){
 const snapshot=JSON.parse(fs.readFileSync(path.join(directory,'site-snapshot.json'),'utf8'));
 validate('site-snapshot',snapshot);
 ensure(snapshot.publication.status==='not_published'&&snapshot.mode==='demo','SERVE_BLOCKED','Only local demo snapshots can be served');
 ensure(snapshot.artifacts.length===2&&snapshot.artifacts.some(a=>a.path==='index.html')&&snapshot.artifacts.some(a=>a.path==='styles.css'),'ARTIFACTS_INVALID','Unexpected engine artifacts');
 for(const a of snapshot.artifacts){
  const bytes=fs.readFileSync(path.join(directory,a.path));
  ensure(sha(bytes)===a.sha256&&bytes.length===a.bytes,'ARTIFACT_CORRUPT','Artifact integrity failed: '+a.path);
 }
 return snapshot;
}
function createPreview(directory){
 verifyArtifacts(directory);
 // Load once; a modified file cannot be served after its integrity check.
 const assets=new Map([
  ['/',{type:'text/html; charset=utf-8',body:fs.readFileSync(path.join(directory,'index.html'))}],
  ['/index.html',{type:'text/html; charset=utf-8',body:fs.readFileSync(path.join(directory,'index.html'))}],
  ['/styles.css',{type:'text/css; charset=utf-8',body:fs.readFileSync(path.join(directory,'styles.css'))}],
  ['/robots.txt',{type:'text/plain; charset=utf-8',body:Buffer.from('User-agent: *\nDisallow: /\n')}]
 ]);
 return http.createServer((req,res)=>{
  const allowedHost='127.0.0.1:'+serverPort(req);
  res.setHeader('X-Robots-Tag','noindex, nofollow');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Cache-Control','no-store');res.setHeader('Referrer-Policy','no-referrer');
  res.setHeader('Content-Security-Policy',"default-src 'none'; style-src 'self'; img-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'");
  if(req.headers.host!==allowedHost||(req.headers.origin&&req.headers.origin!=='http://'+allowedHost)){res.writeHead(403);return res.end('Forbidden');}
  if(!['GET','HEAD'].includes(req.method)){res.setHeader('Allow','GET, HEAD');res.writeHead(405);return res.end();}
  const pathname=req.url.split('?')[0];
  if(pathname==='/favicon.ico'){res.writeHead(204);return res.end();}
  const asset=assets.get(pathname);
  if(!asset){res.writeHead(404);return res.end('Not found');}
  res.setHeader('Content-Type',asset.type);res.setHeader('Content-Length',asset.body.length);res.writeHead(200);res.end(req.method==='HEAD'?undefined:asset.body);
 });
}
const serverPort=req=>req.socket.localPort;
module.exports={createPreview,latestDirectory,verifyArtifacts};

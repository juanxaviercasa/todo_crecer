'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),ignored=new Set(['node_modules','.git','dist']),manifestName='MANIFEST.sha256.json';
function files(dir=root){return fs.readdirSync(dir,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name)).flatMap(entry=>{if(ignored.has(entry.name))return [];const absolute=path.join(dir,entry.name);if(entry.isDirectory())return files(absolute);const relative=path.relative(root,absolute).replaceAll('\\','/');return relative===manifestName?[]:[relative];});}
const entries=files().map(file=>{const bytes=fs.readFileSync(path.join(root,file));return {path:file,bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex')};});
const manifest={format:'sha256-manifest-v1',package:'todolima-platform-phase34',version:'0.36.0',generated_at:'2026-09-30T00:00:00.000Z',entries};
fs.writeFileSync(path.join(root,manifestName),JSON.stringify(manifest,null,2)+'\n');console.log(JSON.stringify({files:entries.length,manifest:manifestName}));



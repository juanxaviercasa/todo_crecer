const fs=require('node:fs');
const path=require('node:path');
const {ROOT,build,encode}=require('../packages/site-engine/index.cjs');
try{
 const input=process.argv[2]?path.resolve(process.argv[2]):path.join(ROOT,'examples/golden-business');
 const output=process.argv[3]?path.resolve(process.argv[3]):path.join(ROOT,'dist');
 const result=build(input,output);
 fs.writeFileSync(path.join(output,'latest.json'),encode({directory:path.relative(output,result.destination).split(path.sep).join('/')}));
 console.log('Build '+(result.reused?'reused':'ready')+': '+result.destination+'\nQA: '+result.snapshot.qa.status+'. Publication: blocked (local synthetic demo).');
}catch(e){console.error((e.code||'BUILD_ERROR')+': '+e.message);process.exitCode=1;}

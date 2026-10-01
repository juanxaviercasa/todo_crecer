const {createPreview,latestDirectory}=require('../packages/site-engine/server.cjs');
try{
 const directory=latestDirectory();
 const port=Number(process.env.PORT||4173);
 if(!Number.isInteger(port)||port<1024||port>65535)throw new Error('PORT must be between 1024 and 65535');
 const server=createPreview(directory);
 server.on('error',e=>{console.error(e.message);process.exitCode=1;});
 server.listen(port,'127.0.0.1',()=>console.log('Vista local: http://127.0.0.1:'+port+'\nCtrl+C para detener. No se publica en Internet.'));
 for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close());
}catch(e){console.error(e.message+'\nEjecuta npm run build primero.');process.exitCode=1;}

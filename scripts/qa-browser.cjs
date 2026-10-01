const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const {createPreview,latestDirectory,verifyArtifacts}=require('../packages/site-engine/server.cjs');
const {encode,validate,sha}=require('../packages/site-engine/index.cjs');
async function run(){
 const directory=process.argv[2]?path.resolve(process.argv[2]):latestDirectory();
 const snapshot=verifyArtifacts(directory);
 const qaId=new Date().toISOString().replace(/[:.]/g,'-');
 const qaDirectory=path.join(directory,'qa',qaId);fs.mkdirSync(qaDirectory,{recursive:true});
 const report={scope:'Local synthetic demo; automated checks only, not a full accessibility or security audit.',created_at:new Date().toISOString(),build_id:snapshot.build.build_id,artifact_hashes:snapshot.artifacts.map(a=>({path:a.path,sha256:a.sha256})),browser:null,status:'failed',checks:[],screenshots:[],error:null};
 const server=createPreview(directory);let browser;
 const check=(name,details)=>report.checks.push({name,status:'passed',details});
 try{
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
  const origin='http://127.0.0.1:'+server.address().port;
  const channel=process.env.BROWSER_CHANNEL||'chrome';
  browser=await chromium.launch({headless:true,...(channel==='chromium'?{}:{channel})});
  report.browser={channel,version:browser.version()};
  const context=await browser.newContext();
  const external=[];
  await context.route('**/*',route=>{
   if(new URL(route.request().url()).origin!==origin){external.push(route.request().url());return route.abort();}
   return route.continue();
  });
  const page=await context.newPage();const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',msg=>{if(msg.type()==='error')errors.push(msg.text());});
  const input=JSON.parse(fs.readFileSync(path.join(directory,'build-inputs.json'),'utf8'));
  const expectedName=input.documents['business-truth'].identity.display_name;
  for(const width of [1440,768,390,320]){
   await page.setViewportSize({width,height:900});
   const response=await page.goto(origin,{waitUntil:'networkidle'});assert.equal(response.status(),200);
   assert.match(response.headers()['x-robots-tag'],/noindex/);
   assert.match(response.headers()['content-security-policy'],/form-action 'none'/);
   assert.equal(await page.locator('h1').count(),1);assert.equal(await page.locator('h1').innerText(),expectedName);
   assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'),'noindex,nofollow');
   const dimensions=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,viewport:innerWidth}));
   assert(dimensions.scroll<=dimensions.viewport+1,'Horizontal overflow at '+width);
   assert.equal(await page.locator('form,script,iframe').count(),0);
   const broken=await page.locator('a').evaluateAll(links=>links.filter(a=>!a.hash||!document.getElementById(decodeURIComponent(a.hash.slice(1)))).map(a=>a.href));
   assert.deepEqual(broken,[]);
   const computed=await page.locator('h1').evaluate(el=>getComputedStyle(el).fontSize);assert(parseFloat(computed)>20);
   check('viewport-'+width,{horizontal_overflow:false,h1:'verified',anchor_targets:'valid',stylesheet:'loaded',noindex:true});
   if(width===1440||width===390){
    const filename=width===1440?'desktop.png':'mobile.png';
    await page.screenshot({path:path.join(qaDirectory,filename),fullPage:true});
    report.screenshots.push({path:'qa/'+qaId+'/'+filename,sha256:sha(fs.readFileSync(path.join(qaDirectory,filename)))});
   }
  }
  await page.goto(origin);
  await page.keyboard.press('Tab');assert.equal(await page.locator(':focus').innerText(),'Saltar al contenido');
  await page.keyboard.press('Enter');assert.equal(await page.locator(':focus').getAttribute('id'),'main');
  check('keyboard-skip-link',{focus_destination:'main'});
  const targets=await page.locator('nav a').evaluateAll(links=>links.map(a=>a.getAttribute('href')));
  for(const href of targets){await page.locator('nav a[href="'+href+'"]').click();assert.equal(new URL(page.url()).hash,href);}
  check('navigation-clicks',{targets});
  // Inject axe through the automation execution context; CSP remains active for the page.
  const axeSource=fs.readFileSync(require.resolve('axe-core/axe.min.js'),'utf8');
  await page.evaluate(axeSource);
  const accessibility=await page.evaluate(async()=>await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));
  const violations=accessibility.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>n.target)}));
  report.accessibility={engine:accessibility.testEngine,violations,incomplete:accessibility.incomplete.map(v=>({id:v.id,description:v.description,targets:v.nodes.map(n=>n.target)})),passes:accessibility.passes.length};
  assert.deepEqual(violations,[],'Accessibility violations');
  check('axe-wcag-a-aa',{violations:0,incomplete_needs_manual_review:accessibility.incomplete.length});
  assert.deepEqual(external,[],'Unexpected external requests');assert.deepEqual(errors,[],'Browser errors');
  verifyArtifacts(directory);check('integrity-after-browser',{unchanged:true});
  check('browser-errors-and-network',{errors:0,external_requests:0});
  report.status='passed';
 }catch(e){report.error=e.message;process.exitCode=1;}
 finally{
  if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));
  const reportPath='qa/'+qaId+'/report.json';
  fs.writeFileSync(path.join(directory,reportPath),encode(report));
  snapshot.qa={status:report.status,report_ref:reportPath};validate('site-snapshot',snapshot);
  fs.writeFileSync(path.join(directory,'site-snapshot.json'),encode(snapshot));
  console.log(encode({status:report.status,checks:report.checks.length,report:path.join(directory,reportPath),error:report.error}));
 }
}
run().catch(e=>{console.error(e);process.exitCode=1;});

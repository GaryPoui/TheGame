import {chromium} from '@playwright/test';
import {writeFile,mkdir} from 'node:fs/promises';
import os from 'node:os';
const destination=process.argv[2]??'docs/evidence/campaign/runtime-profile.json';
const browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const context=await browser.newContext({viewport:{width:1440,height:900}});
const page=await context.newPage();
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const start=Date.now();
await page.goto(process.env.PLAYWRIGHT_BASE_URL??'http://127.0.0.1:4180');
await page.waitForFunction(()=>window.__THEGAME_READY__);
const readyMs=Date.now()-start;
await page.getByTestId('new-game').click();await page.getByTestId('skip-intro').click();await page.getByTestId('enter-urns').click();await page.getByTestId('skip-tutorial').click();
await page.waitForTimeout(5000);
const runs=[];
for(let run=0;run<3;run++){
 const sample=await page.evaluate(()=>new Promise(resolve=>{
  const samples=[],start=performance.now();let last=start;
  function frame(now){samples.push(now-last);last=now;if(now-start>=60000){samples.sort((a,b)=>a-b);resolve({durationMs:now-start,frames:samples.length,medianMs:samples[Math.floor(samples.length*.5)],p95Ms:samples[Math.floor(samples.length*.95)],engine:window.__THEGAME_METRICS__?.(),heap:performance.memory?{used:performance.memory.usedJSHeapSize,total:performance.memory.totalJSHeapSize}:null});}else requestAnimationFrame(frame);}
  requestAnimationFrame(frame);
 }));
 runs.push(sample);console.log(`Runtime sample ${run+1}/3 complete`);
}
const report={date:new Date().toISOString(),scope:'Local production build, Chromium headless SwiftShader software rendering. Not representative physical GPU, throttled network or accessibility evidence.',machine:{os:os.platform(),release:os.release(),arch:os.arch(),cpu:os.cpus()[0]?.model,logicalCpus:os.cpus().length,totalMemory:os.totalmem()},browser:browser.version(),viewport:{width:1440,height:900},localReadyMs:readyMs,runs,errors};
await mkdir(new URL('../docs/evidence/campaign/',import.meta.url),{recursive:true});await writeFile(destination,JSON.stringify(report,null,2)+'\n');await browser.close();console.log(destination);

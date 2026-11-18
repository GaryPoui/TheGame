import {chromium} from '@playwright/test';
import {writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createServer} from 'vite';
import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try{
 const page=await browser.newPage({viewport:{width:1366,height:768}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(pathToFileURL(resolve('.tools/clear-ui/full-dist/standalone.html')).href);
 await page.waitForFunction(()=>window.__THEGAME_READY__);
 const ready=await page.evaluate(()=>({ready:window.__THEGAME_READY__,metrics:window.__THEGAME_METRICS__?.(),warning:document.querySelector('.graphics-warning')?.textContent}));
 console.log('Escena inicial cargada.');
 if(!ready.metrics)throw Error('The actual scene did not initialize');
 await page.getByTestId('new-game').click();await page.getByTestId('skip-intro').click();await page.getByTestId('enter-urns').click();
 await page.getByTestId('toggle-cards').click();await page.getByTestId('demo-urn-0').click();
 await page.screenshot({path:'.tools/clear-ui/full-3d-tutorial.png'});
 await page.getByTestId('skip-tutorial').click();await page.getByTestId('toggle-cards').click();await page.getByTestId('urn-0').click();await page.getByTestId('confirm-choice').click();
 const result=await page.evaluate(()=>({metrics:window.__THEGAME_METRICS__?.(),history:JSON.parse(localStorage.getItem('thegame.save.v1.current')).state.history.length,text:document.querySelector('[data-testid=result-feedback]').textContent}));
 await page.screenshot({path:'.tools/clear-ui/full-3d-result.png'});
 assert.equal(result.history,1);assert.equal(result.metrics.rendering,true);
 assert.ok(result.metrics.activeNames.includes('label-1')&&result.metrics.activeNames.includes('label-2'));
 writeFileSync('.tools/clear-ui/full-3d-results.json',JSON.stringify({ready,result,errors},null,2));console.log('Vera: selección, etiquetas 3D y extracción guardada comprobadas.');
 const modules=await createServer({server:{middlewareMode:true},appType:'custom'});
 const {createGame,choose,advance,bestChoices}=await modules.ssrLoadModule('/src/core/game.ts');
 const {createContracts,applyContractCommand,currentObjective}=await modules.ssrLoadModule('/src/core/tables/contracts.ts');
 const {bestContracts}=await modules.ssrLoadModule('/src/core/math/dice.ts');
 const {createRecords,applyRecordsCommand,bestRecords}=await modules.ssrLoadModule('/src/core/tables/records.ts');
 const {createFinale}=await modules.ssrLoadModule('/src/core/tables/finale.ts');
 let base=createGame(8);base.settings.reducedMotion=true;base.settings.volume=0;
 for(let i=0;i<35&&base.phase!=='complete';i++)base=['choose','guided'].includes(base.phase)?choose(base,bestChoices(base)[0]):advance(base);
 base.seals={urns:true,contracts:false};base.contracts=createContracts(1);base.activeTable='contracts';
 const states={contracts:structuredClone(base)};
 for(let i=0;i<40&&base.contracts.phase!=='complete';i++){const c=base.contracts;base.contracts=applyContractCommand(c,{type:c.phase==='tutorial'?'begin':['offer','order'].includes(c.phase)?'sign':'next',contract:bestContracts(currentObjective(c))[0],expectedRevision:c.revision,commandId:'full-c'+c.revision});}
 base.seals.contracts=true;base.records=createRecords(1);base.activeTable='records';states.records=structuredClone(base);
 for(let i=0;i<40&&base.records.phase!=='complete';i++){const r=base.records;base.records=applyRecordsCommand(r,{type:r.phase==='tutorial'?r.diagnostic===null?'diagnose':'begin':r.phase==='feedback'?'next':'choose',choice:r.phase==='tutorial'?'no':bestRecords(r)[0],expectedRevision:r.revision,commandId:'full-a'+r.revision});}
 base.seals.records=true;base.finale=createFinale(1);base.activeTable='finale';states.finale=structuredClone(base);
 const reports=[];
 for(const [width,height] of [[1366,768],[390,844]]){
  await page.setViewportSize({width,height});
  for(const [mode,state] of Object.entries(states)){
   await page.evaluate(state=>localStorage.setItem('thegame.save.v1.current',JSON.stringify({schemaVersion:5,contentVersion:'campaign-challenge-v5',state})),state);
   await page.reload();await page.waitForFunction(()=>window.__THEGAME_READY__);await page.getByTestId('continue-game').click();
   if(mode==='contracts')await page.getByTestId('doble-begin').click();
   if(mode!=='finale')await page.waitForFunction(()=>window.__THEGAME_METRICS__?.().tableTextureReady);
   await page.screenshot({path:`.tools/clear-ui/full-${mode}-${width}.png`,fullPage:true});
   const report={mode,width,height,...await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight,metrics:window.__THEGAME_METRICS__?.(),panels:[...document.querySelectorAll('.game-panel')].map(el=>({height:el.clientHeight,scroll:el.scrollHeight}))}))};reports.push(report);
   assert.ok(report.scrollWidth<=width,mode+' desborda horizontalmente');
   assert.ok(report.scrollHeight<=height,mode+' desborda verticalmente');
   for(const panel of report.panels)assert.ok(panel.scroll<=panel.height+1,mode+' tiene scroll interno');
   if(mode!=='finale'){assert.equal(report.metrics.rendering,true);assert.equal(report.metrics.tableHost,mode==='contracts'?'doble':'ada');}
   if(mode==='contracts'){
    if(width===390){await page.getByTestId('toggle-dice-combinations').click();await page.getByTestId('contract-C').locator('.dice-combo').first().waitFor({state:'visible'});await page.getByTestId('toggle-dice-combinations').click();}
    await page.getByTestId('contract-J').click();await page.getByTestId('doble-sign').click();await page.getByTestId('doble-next').waitFor({state:'visible'});
    reports.push({mode:'contracts-draw',width,...await page.evaluate(()=>({diceRollCount:window.__THEGAME_METRICS__?.().diceRollCount,history:JSON.parse(localStorage.getItem('thegame.save.v1.current')).state.contracts.history.length}))});
    const draw=await page.evaluate(()=>JSON.parse(localStorage.getItem('thegame.save.v1.current')).state.contracts);assert.equal(draw.history.length,1);assert.equal(draw.pair.length,2);
   }
   if(mode==='records'){
    await page.getByTestId('records-diagnostic-no').click();await page.getByTestId('records-begin').click();await page.getByTestId('records-archive').click();await page.getByTestId('records-confirm').click();
    reports.push({mode:'records-decision',width,text:await page.getByTestId('records-feedback').innerText()});
   }
  }
 }
 writeFileSync('.tools/clear-ui/full-campaign-results.json',JSON.stringify({reports,errors},null,2));await modules.close();assert.equal(errors.length,0);
 console.log(JSON.stringify({screens:reports.filter(r=>r.height).map(({mode,width,height,scrollWidth,scrollHeight})=>({mode,width,height,scrollWidth,scrollHeight})),errors}));
}finally{await browser.close();}

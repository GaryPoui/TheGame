import {test,expect,type Page} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
import {createGame,type GameState} from '../../src/core/game';
import {createFinale,applyFinaleCommand,bestFinale,finaleChoices,type FinaleState} from '../../src/core/tables/finale';
import {bossMechanic} from '../../src/core/tables/boss';
import {createRecords,bestRecords} from '../../src/core/tables/records';
import {createContracts} from '../../src/core/tables/contracts';
const evidence=process.env.EVIDENCE_DIR??'docs/evidence/boss-focus';
async function open(page:Page,width=1280,height=720,table:GameState['activeTable']='finale',scale=1,finale?:FinaleState){
 await page.setViewportSize({width,height});const s=createGame(3);s.settings.volume=0;s.settings.reducedMotion=true;s.seals={urns:true,contracts:true,records:true};s.finale=createFinale(3,'boss-v1');s.activeTable='finale';
 s.activeTable=table;s.settings.textScale=scale;if(finale)s.finale=finale;if(table==='contracts')s.contracts=createContracts(1);if(table==='records')s.records=createRecords(123);
 await page.addInitScript(s=>{if(!localStorage.getItem('thegame.save.v1.current'))localStorage.setItem('thegame.save.v1.current',JSON.stringify({schemaVersion:8,contentVersion:'campaign-boss-v8',state:s}));},s);
 await page.goto('./');await page.waitForFunction(()=>window.__THEGAME_READY__);await page.getByTestId('continue-game').click();
}
async function fits(page:Page){
 const bad=await page.locator('main button,main .poker-card,main progress').evaluateAll(nodes=>nodes.filter(n=>n.checkVisibility()).filter(n=>{const r=n.getBoundingClientRect();return r.left<0||r.top<0||r.right>innerWidth+1||r.bottom>innerHeight+1;}).map(n=>n.getAttribute('data-testid')??n.textContent));
 expect(bad).toEqual([]);expect(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight+1&&document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
}
test('selecting a boss urn keeps the viewport node and its mounted canvas',async({page})=>{
 await open(page);await page.getByTestId('finale-begin').click();const viewport=await page.locator('.ada-viewport').elementHandle();const canvas=await page.locator('.ada-viewport canvas').elementHandle();
 const sample=()=>page.evaluate(()=>{const m=window.__THEGAME_METRICS__!() as {canvasResizeCount:number;urnGeometryBuilds:number;cameraFov:number};return {canvasResizeCount:m.canvasResizeCount,urnGeometryBuilds:m.urnGeometryBuilds,cameraFov:m.cameraFov};});const before=await sample();
 await page.getByTestId('finale-U').click();expect(await page.locator('.ada-viewport').evaluate((node,old)=>node===old,viewport)).toBe(true);expect(await page.locator('.ada-viewport canvas').evaluate((node,old)=>node===old,canvas)).toBe(true);
 await page.getByTestId('finale-V').click();expect(await sample()).toEqual(before);
 await mkdir(evidence,{recursive:true});await writeFile(`${evidence}/scene-stability.json`,JSON.stringify({before,afterTwoSelections:await sample(),viewportPreserved:true,canvasPreserved:true},null,2));
 await page.getByTestId('settings-button').click();await page.getByTestId('text-scale').selectOption('2');await page.getByTestId('close-dialog').click();expect((await sample()).cameraFov).toBeCloseTo(before.cameraFov,5);
});
for(const [width,height]of [[1280,720],[1024,576],[960,540],[853,480],[640,360],[512,320]])test(`all boss mechanics and result fit ${width}x${height}`,async({page})=>{
 test.setTimeout(120000);await open(page,width,height);await fits(page);await page.getByTestId('finale-begin').click();let s=createFinale(3,'boss-v1');s=applyFinaleCommand(s,{type:'begin',commandId:'b',expectedRevision:0});const seen=new Set<string>();
 for(let i=0;i<8&&seen.size<3;i++){
  const kind=bossMechanic(s);await fits(page);const frame=await page.evaluate(()=>(window.__THEGAME_METRICS__!() as {dealerFrame:{hat:{y:number};width:number}}).dealerFrame);expect(frame.hat.y).toBeGreaterThanOrEqual(0);expect(frame.hat.y).toBeLessThan(1);expect(frame.width).toBeGreaterThan(0);
  if(!seen.has(kind)){await mkdir(evidence,{recursive:true});await page.screenshot({path:`${evidence}/${kind}-${width}.png`});}seen.add(kind);const choice=bestFinale(s)[0]!;
  await page.getByTestId('finale-'+choice).click();await page.getByTestId('finale-confirm').click();s=applyFinaleCommand(s,{type:'choose',choice,commandId:'s'+s.revision,expectedRevision:s.revision});await fits(page);await expect(page.locator('.damage-breakdown')).toBeVisible();
  await page.getByTestId('finale-next').click();s=applyFinaleCommand(s,{type:'next',commandId:'s'+s.revision,expectedRevision:s.revision});
 }
 expect(seen.size).toBe(3);
});
for(const table of ['urns','contracts','records']as const)for(const [width,height]of [[853,480],[640,360],[512,320]])test(`${table} choices and feedback fit ${width}x${height}`,async({page})=>{
 await open(page,width,height,table);await fits(page);if(table==='contracts')await page.getByTestId('doble-begin').click();if(table==='records')await page.getByTestId('records-begin').click();if(table==='urns')await page.getByTestId('toggle-cards').click();await fits(page);
 if(table==='contracts'){await page.getByTestId('contract-J').click();await page.getByTestId('doble-sign').click();}else if(table==='records'){const r=createRecords(123);await page.getByTestId('records-'+bestRecords(r)[0]).click();await page.getByTestId('records-confirm').click();}else{await page.getByTestId('urn-0').click();await page.getByTestId('confirm-choice').click();}await fits(page);
 if(table==='contracts'){await page.getByTestId('doble-next').click();await fits(page);await page.getByTestId('contract-S').click();await page.getByTestId('doble-sign').click();await fits(page);}
});
test('boss resource help is contextual and does not alter the fight',async({page})=>{
 await open(page,1024,640);await page.getByTestId('finale-begin').click();const before=await page.evaluate(()=>localStorage.getItem('thegame.save.v1.current'));
 await page.getByRole('button',{name:/Combo.*cómo cargarlo y gastarlo/}).click();await expect(page.getByRole('dialog')).toContainText('Cargá y descargá el combo');await page.getByTestId('close-dialog').click();expect(await page.evaluate(()=>localStorage.getItem('thegame.save.v1.current'))).toBe(before);
});
test('options and title menu fit compact zoom with text enlarged and reduced motion',async({page})=>{
 await page.setViewportSize({width:640,height:360});await page.goto('./');await page.waitForFunction(()=>window.__THEGAME_READY__);
 await fits(page);await page.getByTestId('settings-button').click();await page.getByTestId('text-scale').selectOption('2');await page.getByTestId('reduced-motion').check();
 await expect(page.getByRole('tablist')).toHaveAttribute('aria-orientation','vertical');
 for(const tab of ['Pantalla','Sonido','Partida']){await page.getByRole('tab',{name:tab,exact:true}).click();const bad=await page.getByRole('dialog').evaluate(d=>[...d.querySelectorAll<HTMLElement>('button,select,input')].filter(e=>e.checkVisibility()).filter(e=>{const r=e.getBoundingClientRect();return r.top<0||r.bottom>innerHeight+1||r.left<0||r.right>innerWidth+1;}).map(e=>e.getAttribute('data-testid')??e.textContent));expect(bad).toEqual([]);}
 expect(await page.getByRole('dialog').evaluate(d=>d.getAnimations({subtree:true}).filter(a=>a.playState==='running').length)).toBe(0);await page.getByTestId('settings-return').click();await fits(page);
});
test('chapter menu fits the smallest desktop zoom space',async({page})=>{
 await open(page,512,320);await page.getByTestId('back-room').click();await fits(page);await expect(page.getByTestId('enter-finale')).toBeVisible();
});
test('boss guided choices remain labelled and reach the exit at maximum zoom',async({page})=>{
 let f=createFinale(3,'boss-v1');f=applyFinaleCommand(f,{type:'begin',commandId:'begin',expectedRevision:0});
 for(let i=0;i<60&&!f.boss!.needsHelp;i++)f=applyFinaleCommand(f,{type:f.phase==='choose'?'choose':'next',choice:finaleChoices(f).find(c=>!bestFinale(f).includes(c))??bestFinale(f)[0],commandId:'bad'+f.revision,expectedRevision:f.revision});
 f=applyFinaleCommand(f,{type:'assist',commandId:'assist',expectedRevision:f.revision});await open(page,512,320,'finale',1,f);
 for(let i=0;i<3;i++){await fits(page);const kind=bossMechanic(f);if(kind==='urns')await expect(page.locator('.urn-option.hinted .urn-option-head>span').first()).toBeVisible();else await expect(page.locator('.guided-choice').first()).toBeVisible();const choice=bestFinale(f)[0]!;await page.getByTestId('finale-'+choice).click();await page.getByTestId('finale-confirm').click();f=applyFinaleCommand(f,{type:'choose',choice,commandId:'good'+f.revision,expectedRevision:f.revision});await fits(page);await page.getByTestId('finale-next').click();f=applyFinaleCommand(f,{type:'next',commandId:'next'+f.revision,expectedRevision:f.revision});}
 await expect(page.getByTestId('finale-completion')).toBeVisible();await fits(page);await mkdir(evidence,{recursive:true});await page.screenshot({path:`${evidence}/guided-ending.png`});
});
test('prepared tutorials and boss reading stay reachable in the smallest zoom space',async({page})=>{
 await open(page,512,320,'contracts');const before=await page.evaluate(()=>localStorage.getItem('thegame.save.v1.current'));for(let i=0;i<3;i++){await fits(page);if(i<2)await page.getByTestId('doble-tutorial-next').click();}expect(await page.evaluate(()=>localStorage.getItem('thegame.save.v1.current'))).toBe(before);
 await page.getByTestId('doble-begin').click();await page.getByTestId('back-room').click();await page.getByTestId('enter-finale').click();await page.getByRole('button',{name:/Defensas.*cómo se pierden/}).click();
 for(let i=0;i<4;i++){expect(await page.getByRole('dialog').evaluate(d=>{const r=d.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight+1&&d.scrollHeight<=d.clientHeight+1&&[...d.querySelectorAll('button')].filter(b=>b.checkVisibility()).every(b=>b.getBoundingClientRect().bottom<=innerHeight+1);})).toBe(true);if(i<3)await page.locator('[data-guide-page=next]').click();}
});
test('compact dice combinations use a window instead of extending the table',async({page})=>{
 await open(page,640,360,'contracts');await page.getByTestId('doble-begin').click();await page.getByTestId('toggle-dice-combinations').click();await expect(page.getByRole('dialog')).toBeVisible();await expect(page.getByRole('dialog')).toContainText('Seguro');await page.getByTestId('close-dialog').click();await fits(page);
});
test('zoom density and viewport changes resize once and keep the saved fight',async({page,context})=>{
 await open(page);await page.getByTestId('finale-begin').click();const before=await page.evaluate(()=>localStorage.getItem('thegame.save.v1.current'));const cdp=await context.newCDPSession(page);
 await cdp.send('Emulation.setDeviceMetricsOverride',{width:640,height:360,deviceScaleFactor:2,mobile:false});await expect.poll(()=>page.evaluate(()=>devicePixelRatio)).toBe(2);
 await expect.poll(()=>page.evaluate(()=>(window.__THEGAME_METRICS__!() as {hardwareScale:number}).hardwareScale)).toBeCloseTo(4/3,4);await fits(page);
 expect(await page.evaluate(()=>localStorage.getItem('thegame.save.v1.current'))).toBe(before);
 await mkdir(evidence,{recursive:true});await writeFile(`${evidence}/zoom-density.json`,JSON.stringify(await page.evaluate(()=>{const m=window.__THEGAME_METRICS__!() as {hardwareScale:number;renderWidth:number;renderHeight:number};return {method:'CDP device metrics emulation, not browser toolbar zoom',cssWidth:innerWidth,cssHeight:innerHeight,devicePixelRatio,hardwareScale:m.hardwareScale,renderWidth:m.renderWidth,renderHeight:m.renderHeight,progressUnchanged:true};}),null,2));
 await cdp.send('Emulation.clearDeviceMetricsOverride');await fits(page);
});
test('boss choices fit the CSS space of a desktop enlarged to 200 percent',async({page})=>{
 await open(page,640,360);await page.getByTestId('finale-begin').click();await fits(page);await mkdir(evidence,{recursive:true});await page.screenshot({path:`${evidence}/compact-boss.png`});
});

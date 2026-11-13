import {test,expect,type Page} from '@playwright/test';
import {mkdir} from 'node:fs/promises';
import {createGame} from '../../src/core/game';
import {createFinale,applyFinaleCommand,bestFinale,finaleChoices,type FinaleState} from '../../src/core/tables/finale';
import {bossMechanic} from '../../src/core/tables/boss';
import {createRecords,applyRecordsCommand,bestRecords} from '../../src/core/tables/records';
const evidence=process.env.EVIDENCE_DIR??'docs/evidence/boss-finale';
async function open(page:Page,finale?:FinaleState,scale=1){
 const s=createGame(44);s.seals={urns:true,contracts:true,records:true};s.settings.reducedMotion=true;s.settings.volume=0;s.settings.textScale=scale;
 if(finale){s.finale=finale;s.activeTable='finale';}else{s.records=createRecords(123);s.activeTable='records';}
 await page.addInitScript(s=>{if(!localStorage.getItem('thegame.save.v1.current'))localStorage.setItem('thegame.save.v1.current',JSON.stringify({schemaVersion:8,contentVersion:'campaign-boss-v8',state:s}));},s);
 await page.goto('./');await page.getByTestId('continue-game').click();
}
async function fits(page:Page){
 if(page.viewportSize()!.width<1000)return;
 expect(await page.locator('main button, main .poker-card, main progress').evaluateAll(es=>es.filter(e=>e.checkVisibility()).filter(e=>{const b=e.getBoundingClientRect();return b.top<0||b.bottom>innerHeight+1||b.left<0||b.right>innerWidth+1;}).map(e=>e.getAttribute('data-testid')??e.textContent))).toEqual([]);
 expect(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight+1&&document.querySelector('#app')!.scrollTop===0)).toBe(true);
}
for(const [width,height,scale] of [[1280,720,1],[1024,640,1],[1024,640,2],[390,844,1]])test(`boss combines urns dice and poker ${width}x${height} text ${scale}`,async({page})=>{
 test.setTimeout(180000);await mkdir(evidence,{recursive:true});await page.setViewportSize({width:width!,height:height!});let s=createFinale(3,'boss-v1');await open(page,s,scale);
 await expect(page.getByTestId('finale-begin')).toBeVisible();await expect(page.locator('.boss-layout canvas')).toBeVisible();expect(await page.evaluate(()=> (window.__THEGAME_METRICS__!() as {tableHost:string}).tableHost)).toBe('captor');await fits(page);await page.getByTestId('finale-begin').click();s=applyFinaleCommand(s,{type:'begin',commandId:'start',expectedRevision:0});
 const seen=new Set<string>();
 for(let i=0;i<10&&seen.size<3;i++){
  const kind=bossMechanic(s);await fits(page);
  if(!seen.has(kind))await page.screenshot({path:`${evidence}/${kind}-${width}-${scale}.png`});seen.add(kind);
  const choice=bestFinale(s)[0]!;await page.getByTestId('finale-'+choice).click();await page.getByTestId('finale-confirm').click();await expect(page.getByTestId('finale-feedback')).toBeVisible();await fits(page);
  s=applyFinaleCommand(s,{type:'choose',choice,commandId:'local-'+s.revision,expectedRevision:s.revision});
  if(kind==='poker'){
   await expect(page.getByTestId('opponent-cards').getByLabel('Carta boca abajo',{exact:true})).toHaveCount(0);await expect(page.locator('.showdown-hands .poker-card')).toHaveCount(10);
   const before=await page.evaluate(()=>JSON.parse(localStorage.getItem('thegame.save.v1.current')!).state.finale);await page.reload();await page.getByTestId('continue-game').click();expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('thegame.save.v1.current')!).state.finale)).toEqual(before);
  }
  await page.getByTestId('finale-next').click();s=applyFinaleCommand(s,{type:'next',commandId:'local-'+s.revision,expectedRevision:s.revision});
 }
 expect(seen).toEqual(new Set(['urns','dice','poker']));
 await page.getByRole('button',{name:/Reglas del duelo/}).click();await expect(page.getByRole('dialog')).toBeVisible();await page.getByTestId('close-dialog').click();
});
for(const scale of [1,2])test(`Ada polish shows both best hands and preserves scoring, text ${scale}`,async({page})=>{
 await page.setViewportSize({width:1024,height:640});await open(page,undefined,scale);await page.getByTestId('records-begin').click();
 let r=createRecords(123);r=applyRecordsCommand(r,{type:'begin',commandId:'begin',expectedRevision:0});await page.getByTestId('records-'+bestRecords(r)[0]).click();await page.getByTestId('records-confirm').click();await fits(page);
 await expect(page.locator('.showdown-hands .poker-card')).toHaveCount(10);await expect(page.locator('.holdem-felt .best-card')).toHaveCount(5);await expect(page.locator('.river-card')).toHaveCount(1);await expect(page.getByTestId('records-feedback')).toContainText('Predicción:');
 await mkdir(evidence,{recursive:true});await page.screenshot({path:`${evidence}/ada-feedback-${scale}.png`});
});
test('boss defeat offers finite help, opens the door and keeps freedom on practice',async({page})=>{
 test.setTimeout(120000);let s=createFinale(3,'boss-v1');s=applyFinaleCommand(s,{type:'begin',commandId:'begin',expectedRevision:0});
 for(let i=0;i<50&&!s.boss!.needsHelp;i++)s=applyFinaleCommand(s,{type:s.phase==='choose'?'choose':'next',choice:finaleChoices(s).find(c=>!bestFinale(s).includes(c))??bestFinale(s)[0],commandId:'bad'+s.revision,expectedRevision:s.revision});
 await open(page,s);await page.getByTestId('finale-assist').click();s=applyFinaleCommand(s,{type:'assist',commandId:'assist',expectedRevision:s.revision});
 for(let i=0;i<3;i++){
  const choice=bestFinale(s)[0]!;await page.getByTestId('finale-'+choice).click();await page.getByTestId('finale-confirm').click();s=applyFinaleCommand(s,{type:'choose',choice,commandId:'local'+s.revision,expectedRevision:s.revision});await page.getByTestId('finale-next').click();s=applyFinaleCommand(s,{type:'next',commandId:'local'+s.revision,expectedRevision:s.revision});
 }
 await expect(page.getByTestId('finale-completion')).toBeVisible();await page.getByTestId('exit-house').click();await expect(page.getByTestId('back-room')).toBeVisible();
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('thegame.save.v1.current')!).state);expect(saved.freed).toBe(true);expect(saved.freedomMethod).toBe('assisted');
});
test('complete independent boss duel opens the ending and preserves freedom on replay',async({page})=>{
 test.setTimeout(180000);let s=createFinale(3,'boss-v1');await open(page,s);await page.getByTestId('finale-begin').click();s=applyFinaleCommand(s,{type:'begin',commandId:'begin',expectedRevision:0});
 for(let i=0;i<26&&s.phase!=='complete';i++){
  const choice=bestFinale(s)[0]!;await page.getByTestId('finale-'+choice).click();await page.getByTestId('finale-confirm').click();
  s=applyFinaleCommand(s,{type:'choose',choice,commandId:'local'+s.revision,expectedRevision:s.revision});await page.getByTestId('finale-next').click();s=applyFinaleCommand(s,{type:'next',commandId:'local'+s.revision,expectedRevision:s.revision});
 }
 await expect(page.getByTestId('finale-completion')).toContainText('La casa se rinde');await page.getByTestId('finale-replay').click();await expect(page.getByTestId('finale-begin')).toBeVisible();
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('thegame.save.v1.current')!).state);expect(saved.freed).toBe(true);expect(saved.freedomMethod).toBe('independent');expect(saved.seals.records).toBe(true);
});
test('boss keeps its character and playable choices without WebGL',async({page})=>{
 await page.addInitScript(()=>{
  const original=HTMLCanvasElement.prototype.getContext;
  Object.defineProperty(HTMLCanvasElement.prototype,'getContext',{value:function(this:HTMLCanvasElement,type:string,...args:unknown[]){return ['webgl','webgl2','experimental-webgl'].includes(type)?null:Reflect.apply(original,this,[type,...args]);}});
 });
 await open(page,createFinale(3,'boss-v1'));await expect(page.getByTestId('retry-graphics')).toBeVisible();await expect(page.locator('.ada-fallback-portrait')).toBeVisible();
 await page.getByTestId('finale-begin').click();await page.getByTestId('finale-U').click();await page.getByTestId('finale-confirm').click();await expect(page.getByTestId('finale-feedback')).toBeVisible();await fits(page);
});

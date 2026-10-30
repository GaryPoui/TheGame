import {test,expect,type Page} from '@playwright/test';
import {mkdir} from 'node:fs/promises';
import {createGame,choose,advance,bestChoices,type GameState} from '../../src/core/game';
import {createContracts,applyContractCommand,currentObjective} from '../../src/core/tables/contracts';
import {bestContracts} from '../../src/core/math/dice';
import {createRecords,applyRecordsCommand,bestRecords} from '../../src/core/tables/records';
import {createFinale,applyFinaleCommand,bestFinale} from '../../src/core/tables/finale';
test.use({actionTimeout:15000});
const evidence=process.env.EVIDENCE_DIR??'.tools/desktop-revision';
function fixture(table:'urns'|'contracts'|'records'|'finale'):GameState {
 let s=createGame(8);s.settings.reducedMotion=true;s.settings.volume=0;
 if(table==='urns'){s.activeTable='urns';return s;}
 while(s.phase!=='complete')s=['choose','guided'].includes(s.phase)?choose(s,bestChoices(s)[0]!):advance(s);
 s.seals={urns:true,contracts:false};s.contracts=createContracts(1);
 if(table!=='contracts'){
  while(s.contracts.phase!=='complete'){const c=s.contracts;s.contracts=applyContractCommand(c,{type:c.phase==='tutorial'?'begin':['offer','order'].includes(c.phase)?'sign':'next',contract:bestContracts(currentObjective(c))[0],expectedRevision:c.revision,commandId:'c'+c.revision});}
  s.seals.contracts=true;s.records=createRecords(11);
 }
 if(table==='finale'){while(s.records!.phase!=='complete'){const r=s.records!;s.records=applyRecordsCommand(r,{type:r.phase==='tutorial'?'begin':r.phase==='choose'?'choose':'next',choice:bestRecords(r)[0],expectedRevision:r.revision,commandId:'r'+r.revision});}s.seals.records=true;s.finale=createFinale(1);}
 s.activeTable=table;return s;
}
async function open(page:Page,s:GameState){
 await page.goto('./');await page.evaluate(s=>{localStorage.clear();localStorage.setItem('thegame.save.v1.current',JSON.stringify({schemaVersion:6,contentVersion:'campaign-cards-v6',state:s}));},s);
 await page.reload();await page.waitForFunction(()=>window.__THEGAME_READY__);await page.getByTestId('continue-game').click();
}
async function fits(page:Page){
 const clipped=await page.evaluate(()=>[...document.querySelectorAll<HTMLElement>('main button,.poker-card')].filter(el=>el.checkVisibility()).filter(el=>{const r=el.getBoundingClientRect();return r.bottom>innerHeight+1||r.top<0||r.right>innerWidth+1||r.left<0;}).map(el=>el.textContent));
 expect(clipped).toEqual([]);
 expect(await page.evaluate(()=>({x:scrollX,y:scrollY,height:document.documentElement.scrollHeight}))).toEqual({x:0,y:0,height:page.viewportSize()!.height});
}
for(const [width,height] of [[1366,768],[1280,720],[1920,1080]])test(`mouse campaign and information windows fit ${width}x${height}`,async({page})=>{
 test.setTimeout(120000);await mkdir(evidence,{recursive:true});await page.setViewportSize({width,height});
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await open(page,fixture('contracts'));await page.getByTestId('doble-begin').click();await fits(page);
 await page.waitForFunction(()=>!!window.__THEGAME_METRICS__?.());
 expect((await page.evaluate(()=>window.__THEGAME_METRICS__!())) as object).toHaveProperty('rendering',true);
 await page.getByTestId('contract-J').click();await page.getByTestId('doble-sign').click();await fits(page);
 await page.screenshot({path:`${evidence}/dice-${width}.png`});
 await page.getByRole('button',{name:/Practicar y ver las cuentas/}).click();await expect(page.getByRole('dialog')).toBeVisible();
 await page.getByRole('button',{name:/Ver los 36 pares y comparar contratos/}).click();await expect(page.getByRole('dialog')).toBeVisible();
 expect(await page.locator('dialog').evaluate(el=>el.scrollHeight<=el.clientHeight+1)).toBe(true);
 await page.getByTestId('close-dialog').click();await fits(page);
 await page.getByTestId('back-room').click();await expect(page.getByText('Recorrer la sala',{exact:true})).toHaveCount(0);await fits(page);
 await page.getByTestId('settings-button').click();await expect(page.getByRole('tab',{name:'Controles'})).toHaveCount(0);await page.getByTestId('close-dialog').click();
 await open(page,fixture('records'));await fits(page);await page.getByTestId('records-begin').click();
 for(let i=0;i<8;i++){
  const s=await page.evaluate(()=>JSON.parse(localStorage.getItem('thegame.save.v1.current')!).state.records);
  await page.getByTestId('records-'+bestRecords(s)[0]).click();await page.getByTestId('records-confirm').click();await fits(page);
  if(i===0)await page.screenshot({path:`${evidence}/ada-${width}.png`});
  await page.getByTestId('records-next').click();await fits(page);
 }
 await expect(page.getByTestId('records-completion')).toBeVisible();
 await open(page,fixture('finale'));await fits(page);await expect(page.locator('.host-final .host-table-edge')).toHaveCount(0);
 for(let i=0;i<6;i++){
  const s=await page.evaluate(()=>JSON.parse(localStorage.getItem('thegame.save.v1.current')!).state.finale);
  await page.getByTestId('finale-'+bestFinale(s)[0]).click();await page.getByTestId('finale-confirm').click();await fits(page);await page.getByTestId('finale-next').click();await fits(page);
 }
 await expect(page.getByTestId('finale-completion')).toBeVisible();await expect(page.getByText(/Un último ensayo/)).toHaveCount(0);await page.getByTestId('exit-house').click();await fits(page);
 await open(page,fixture('urns'));
 for(let i=0;i<30;i++){
  const s=await page.evaluate(()=>JSON.parse(localStorage.getItem('thegame.save.v1.current')!).state);
  if(s.phase==='complete')break;
  if(['choose','guided'].includes(s.phase)){await page.getByTestId('toggle-cards').click();await page.getByTestId('urn-'+bestChoices(s)[0]).click();await fits(page);await page.getByTestId('confirm-choice').click();}
  else await page.getByTestId('next-step').click();
  await fits(page);
 }
 await page.screenshot({path:`${evidence}/vera-complete-${width}.png`});
 expect(errors).toEqual([]);
});

import {test,expect,type Page} from '@playwright/test';
import {mkdir} from 'node:fs/promises';
import {createGame,choose,advance,bestChoices,type GameState} from '../../src/core/game';
import {createContracts,applyContractCommand,currentObjective} from '../../src/core/tables/contracts';
import {bestContracts} from '../../src/core/math/dice';
import {createRecords,applyRecordsCommand,bestRecords} from '../../src/core/tables/records';
import {createFinale} from '../../src/core/tables/finale';

const evidence=process.env.EVIDENCE_DIR??'docs/evidence/table-focus';
function campaign():GameState{
 let s=createGame(73);s.settings.reducedMotion=true;s.settings.volume=0;
 for(let i=0;i<35&&s.phase!=='complete';i++)s=['choose','guided'].includes(s.phase)?choose(s,bestChoices(s)[0] as 0|1):advance(s);
 s.contracts=createContracts(42);
 for(let i=0;i<45&&s.contracts.phase!=='complete';i++){const c=s.contracts;s.contracts=applyContractCommand(c,{commandId:'c'+c.revision,expectedRevision:c.revision,type:c.phase==='tutorial'?'begin':['offer','order'].includes(c.phase)?'sign':'next',contract:bestContracts(currentObjective(c))[0]!});}
 s.records=createRecords(12);
 for(let i=0;i<45&&s.records.phase!=='complete';i++){const r=s.records;s.records=applyRecordsCommand(r,{commandId:'r'+r.revision,expectedRevision:r.revision,type:r.phase==='tutorial'?'begin':r.phase==='choose'?'choose':'next',choice:bestRecords(r)[0]});}
 s.seals={urns:true,contracts:true,records:true,urnsMethod:'independent',contractsMethod:'independent',recordsMethod:'independent'};
 return s;
}
async function open(page:Page,s:GameState){
 await mkdir(evidence,{recursive:true});await page.addInitScript(raw=>localStorage.setItem('thegame.save.v1.current',raw),JSON.stringify({schemaVersion:3,contentVersion:'campaign-v3',state:s}));
 await page.goto('./');await page.waitForFunction(()=>window.__THEGAME_READY__);await page.getByTestId('continue-game').click();
}
async function capture(page:Page,name:string){await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));await page.screenshot({path:`${evidence}/${name}.png`,fullPage:true});}

test('urn table has an unobscured canvas; selecting objects never rerolls or recreates its context',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));const s=createGame(7);s.settings.reducedMotion=true;s.settings.volume=0;s.activeTable='urns';await open(page,s);
 const canvas=page.locator('#scene'),board=page.getByTestId('tabletop-urns');await expect(board.locator('#scene')).toHaveCount(1);
 await page.waitForFunction(()=>(window.__THEGAME_METRICS__!() as {rendering:boolean}).rendering);
 const bounds=(await canvas.boundingBox())!,panel=(await page.locator('.game-panel').boundingBox())!;
 expect(bounds.width).toBeGreaterThan(panel.width*1.8);expect(bounds.x+bounds.width).toBeLessThanOrEqual(panel.x);
 const before=await page.evaluate(()=>localStorage.getItem('thegame.save.v1.current'));
 await page.evaluate(()=>{(window as unknown as {savedCanvas:Element}).savedCanvas=document.querySelector('#scene')!;});
 const target=await page.evaluate(()=>(window.__THEGAME_METRICS__!() as {urnTargets:{x:number;y:number}[]}).urnTargets[0]!);
 await page.mouse.click(bounds.x+target.x*bounds.width,bounds.y+target.y*bounds.height);await expect(page.getByTestId('urn-0')).toHaveAttribute('aria-pressed','true');
 await page.getByTestId('urn-1').click();await page.getByTestId('toggle-cards').click();
 expect(await page.evaluate(()=>document.querySelector('#scene')===(window as unknown as {savedCanvas:Element}).savedCanvas)).toBe(true);
 expect(await page.evaluate(()=>localStorage.getItem('thegame.save.v1.current'))).toBe(before);
 await page.getByTestId('toggle-cards').click();await capture(page,'vera-desktop');expect(errors).toEqual([]);
});
test('Doble displays the resolved pair and selectable contracts together on the felt',async({page})=>{
 const s=campaign();s.contracts=createContracts(1);s.activeTable='contracts';await open(page,s);await page.getByTestId('doble-begin').click();
 const table=page.getByTestId('tabletop-contracts');await expect(table.locator('#scene')).toBeVisible();await expect(table.getByTestId('contract-J')).toBeVisible();
 await table.getByTestId('contract-J').click();await page.getByTestId('doble-sign').click();await expect(table.locator('[aria-label="D1: 3"]')).toBeVisible();await expect(table.locator('[aria-label="D2: 1"]')).toBeVisible();
 await capture(page,'doble-desktop');
});
test('Ada places source, observations and choices on the desk, including at 200 percent text',async({page})=>{
 const s=campaign();s.records=createRecords(12);s.activeTable='records';await open(page,s);await page.getByTestId('records-begin').click();
 const table=page.getByTestId('tabletop-records');await expect(table.getByRole('region',{name:'Registros observados'})).toBeVisible();await expect(table.getByTestId('records-archive')).toBeVisible();await capture(page,'ada-desktop');
 await page.setViewportSize({width:390,height:844});await page.getByTestId('settings-button').click();await page.getByTestId('text-scale').selectOption('2');await page.getByTestId('close-dialog').click();
 await table.getByTestId('records-archive').click();await page.getByTestId('records-confirm').click();await expect(page.getByTestId('records-feedback')).toContainText('Buena decisión');expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);await capture(page,'ada-narrow-200');
});
test('the host uses the same urn objects, then dice, then the exact final ledger',async({page})=>{
 const s=campaign();s.finale=createFinale(1);s.activeTable='finale';await open(page,s);
 const table=page.getByTestId('tabletop-finale');await expect(table.locator('#scene')).toBeVisible();await expect(table.getByTestId('finale-U')).toContainText('3 rojas');await capture(page,'host-urns');
 for(const choice of ['U','V']){await page.getByTestId('finale-'+choice).click();await page.getByTestId('finale-confirm').click();await page.getByTestId('finale-next').click();}
 await expect(table.locator('[aria-label="D1: sin tirar"]')).toBeVisible();await capture(page,'host-contracts');
 for(const choice of ['C','J']){await page.getByTestId('finale-'+choice).click();await page.getByTestId('finale-confirm').click();await page.getByTestId('finale-next').click();}
 await expect(table.locator('.sample-ledger')).toContainText('Álbum seleccionado');await expect(table.locator('#scene')).toHaveCount(0);await capture(page,'host-records');
});

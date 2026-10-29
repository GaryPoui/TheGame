import {test,expect,type Page} from '@playwright/test';
import {mkdir} from 'node:fs/promises';
import {createGame,choose,advance,bestChoices,type GameState} from '../../src/core/game';
import {createContracts,applyContractCommand,currentObjective} from '../../src/core/tables/contracts';
import {bestContracts} from '../../src/core/math/dice';
import {createRecords,applyRecordsCommand,bestRecords,recordsChoices} from '../../src/core/tables/records';
import {createFinale,bestFinale,finaleChoices} from '../../src/core/tables/finale';
const evidence=process.env.EVIDENCE_DIR??'docs/evidence/campaign';
function checkpoint():GameState {
 let s=createGame(73);
 for(let i=0;i<30&&s.phase!=='complete';i++)s=s.phase==='choose'||s.phase==='guided'?choose(s,bestChoices(s)[0] as 0|1):advance(s);
 s.contracts=createContracts(42);
 for(let i=0;i<40&&s.contracts.phase!=='complete';i++){
  const c=s.contracts,type=c.phase==='tutorial'?'begin':['offer','order'].includes(c.phase)?'sign':'next';
  s.contracts=applyContractCommand(c,{commandId:`c${c.revision}`,expectedRevision:c.revision,type,contract:bestContracts(currentObjective(c))[0]!});
 }
 s.seals={urns:true,contracts:true,urnsMethod:'independent',contractsMethod:'independent'};s.activeTable='records';s.records=createRecords(12);return s;
}
async function open(page:Page,s:GameState){
 await mkdir(evidence,{recursive:true});
 await page.addInitScript(raw=>{if(!sessionStorage.getItem('campaign-fixture-loaded')){localStorage.setItem('thegame.save.v1.current',raw);sessionStorage.setItem('campaign-fixture-loaded','yes');}},JSON.stringify({schemaVersion:3,contentVersion:'campaign-v3',state:s}));
 await page.goto('./');await page.waitForFunction(()=>window.__THEGAME_READY__);await page.getByTestId('continue-game').click();
}
async function saved(page:Page):Promise<GameState>{return page.evaluate(()=>JSON.parse(localStorage.getItem('thegame.save.v1.current')!).state);}
async function beginRecords(page:Page){if(await page.getByTestId('records-diagnostic-no').isVisible())await page.getByTestId('records-diagnostic-no').click();await page.getByTestId('records-begin').click();}
async function finishRecords(page:Page,good=true){
 for(let i=0;i<30;i++){
  const s=(await saved(page)).records!;if(s.phase==='complete')break;
  if(s.phase==='tutorial')await beginRecords(page);
  else if(s.phase==='feedback')await page.getByTestId('records-next').click();
  else {const id=good||s.assisted?bestRecords(s)[0]!:recordsChoices(s).find(c=>!bestRecords(s).includes(c))??bestRecords(s)[0]!;await page.getByTestId(`records-${id}`).click();await page.getByTestId('records-confirm').click();}
 }
 await expect(page.getByTestId('records-completion')).toBeVisible();
}
async function finishFinale(page:Page,good=true){
 for(let i=0;i<24;i++){
  const s=(await saved(page)).finale!;if(s.phase==='complete')break;
  if(s.phase==='feedback')await page.getByTestId('finale-next').click();
  else {const id=good||s.assisted?bestFinale(s)[0]!:finaleChoices(s).find(c=>!bestFinale(s).includes(c))!;await page.getByTestId(`finale-${id}`).click();await page.getByTestId('finale-confirm').click();}
 }
 await expect(page.getByTestId('finale-completion')).toBeVisible();
}
test('Ada, host finale, epilogue and freedom survive reload and practice',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await open(page,checkpoint());
 await beginRecords(page);await page.screenshot({path:`${evidence}/ada-desktop.png`});
 await page.getByTestId('records-archive').click();await page.keyboard.press('Enter');
 // Selection restores focus to the option; Enter repeats selection, confirm remains explicit.
 await page.getByTestId('records-confirm').click();
 const before=await saved(page);await page.reload();await page.getByTestId('continue-game').click();expect((await saved(page)).records).toEqual(before.records);
 await finishRecords(page);await page.getByTestId('enter-finale').click();await page.screenshot({path:`${evidence}/host-desktop.png`});
 await finishFinale(page);expect((await saved(page)).freed).toBe(true);
 await page.locator('details.transfer summary').click();await page.getByTestId('transfer-a').click();await expect(page.getByTestId('transfer-feedback')).toContainText('80 %');
 await page.getByTestId('exit-house').click();await expect(page.locator('body')).toHaveAttribute('data-screen','outside');
 await page.screenshot({path:`${evidence}/epilogue.png`});await page.reload();await page.getByTestId('continue-game').click();await expect(page.locator('body')).toHaveAttribute('data-screen','outside');
 if(!await page.getByTestId('back-room').isVisible())await page.locator('.panel-tools > summary').first().click();await page.getByTestId('back-room').click();await page.getByTestId('enter-finale').click();await page.getByTestId('finale-replay').click();expect((await saved(page)).freed).toBe(true);expect(errors).toEqual([]);
});
test('poor decisions lead through finite help in Ada and finale',async({page})=>{
 await open(page,checkpoint());await finishRecords(page,false);expect((await saved(page)).records!.assisted).toBe(true);
 await page.getByTestId('enter-finale').click();await finishFinale(page,false);const s=await saved(page);expect(s.finale!.merit).toBe(0);expect(s.finale!.assisted).toBe(true);expect(s.freedomMethod).toBe('assisted');
});
test('gates, narrow display, text scaling and silent keyboard choices',async({page})=>{
 const s=checkpoint();s.settings.reducedMotion=true;s.settings.volume=0;await open(page,s);await beginRecords(page);
 await page.setViewportSize({width:390,height:844});await page.getByTestId('settings-button').click();await page.getByTestId('text-scale').selectOption('2');await page.getByTestId('close-dialog').click();
 await page.getByTestId('records-archive').focus();await page.keyboard.press('Enter');await page.getByTestId('records-confirm').focus();await page.keyboard.press('Enter');await expect(page.getByTestId('records-feedback')).toContainText('Buena decisión');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);await page.screenshot({path:`${evidence}/ada-200-narrow.png`,fullPage:true});
 if(!await page.getByTestId('back-room').isVisible())await page.locator('.panel-tools > summary').first().click();await page.getByTestId('back-room').click();await expect(page.getByTestId('enter-finale')).toBeDisabled();await expect(page.getByTestId('enter-records')).toBeEnabled();
});
test('another tab changes the save without silently overwriting its progress',async({page})=>{
 await open(page,checkpoint());const raw=JSON.stringify({schemaVersion:99});await page.evaluate(raw=>{localStorage.setItem('thegame.save.v1.current',raw);window.dispatchEvent(new StorageEvent('storage',{key:'thegame.save.v1.current',newValue:raw,oldValue:'previous'}));},raw);
 await beginRecords(page);await expect(page.locator('.save-warning')).toContainText('Otra pestaña');expect(await page.evaluate(()=>localStorage.getItem('thegame.save.v1.current'))).toBe(raw);
 await page.getByTestId('settings-button').click();await page.getByTestId('delete-save').click();await page.getByTestId('confirm-delete').click();await page.getByTestId('new-game').click();await page.getByTestId('skip-intro').click();await expect(page.locator('.save-warning')).toHaveCount(0);expect((await saved(page)).intro!.ended).toBe(true);
});
test('Doble preserves a good decision through a lost roll, reload and an independent simulation',async({page})=>{
 const s=checkpoint();delete s.records;s.contracts=createContracts(1);s.activeTable='contracts';s.seals!.contracts=false;await open(page,s);
 await page.getByTestId('doble-begin').click();await page.getByTestId('contract-J').click();await page.keyboard.press('KeyE');
 await expect(page.getByTestId('doble-balance')).toHaveText('-1');await expect(page.locator('.contract-verdict')).toContainText('Buena decisión');
 const prior=(await saved(page)).contracts;await page.reload();await page.getByTestId('continue-game').click();expect((await saved(page)).contracts).toEqual(prior);
 await page.locator('.contract-lab summary').click();await page.getByTestId('simulate-100').click();expect((await saved(page)).contracts).toEqual(prior);
 await page.screenshot({path:`${evidence}/doble-good-unlucky.png`});
 for(let i=0;i<36;i++){const c=(await saved(page)).contracts!;if(c.phase==='complete')break;if(c.phase==='offer'||c.phase==='order'){await page.getByTestId('contract-'+bestContracts(currentObjective(c))[0]).click();await page.getByTestId('doble-sign').click();}else await page.getByTestId('doble-next').click();}
 await expect(page.getByTestId('doble-completion')).toBeVisible();await page.getByTestId('enter-records').click();await expect(page.getByTestId('records-diagnostic-yes')).toBeVisible();
});
test('all campaign panels remain usable at 200 percent text in a narrow window',async({page})=>{
 test.setTimeout(120_000);
 const s=checkpoint();s.seals!.records=true;s.finale=createFinale(1);s.settings.textScale=2;s.settings.volume=0;s.settings.reducedMotion=true;await page.setViewportSize({width:390,height:844});await open(page,s);
 const check=async(name:string)=>{expect(await page.evaluate(()=>document.documentElement.scrollWidth),name).toBeLessThanOrEqual(390);expect(await page.locator('.topbar').evaluate(el=>Math.max(...Array.from(el.children).filter(child=>child.getClientRects().length>0).map(child=>child.getBoundingClientRect().bottom))-el.getBoundingClientRect().bottom),name+' header overlap').toBeLessThanOrEqual(1);await page.screenshot({path:`${evidence}/${name}-200.png`,fullPage:true});};
 await check('ada-tutorial');await beginRecords(page);await check('ada');if(!await page.getByTestId('back-room').isVisible())await page.locator('.panel-tools > summary').first().click();await page.getByTestId('back-room').click();await check('room');
 await page.getByTestId('enter-urns').click();await check('vera-complete');await page.getByTestId('practice-again').click();await page.getByTestId('toggle-cards').click();await check('vera');if(!await page.getByTestId('back-room').isVisible())await page.locator('.panel-tools > summary').first().click();await page.getByTestId('back-room').click();
 await page.getByTestId('enter-contracts').click();await page.getByTestId('doble-replay').click();await page.getByTestId('doble-begin').click();await check('doble');if(!await page.getByTestId('back-room').isVisible())await page.locator('.panel-tools > summary').first().click();await page.getByTestId('back-room').click();
 await page.getByTestId('enter-finale').click();await check('host');await page.getByTestId('finale-U').click();await page.getByTestId('finale-confirm').click();await expect(page.getByTestId('finale-feedback')).toBeVisible();
});

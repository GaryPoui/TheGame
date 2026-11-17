import {test,expect,type Page} from '@playwright/test';
import {createGame,type GameState} from '../../src/core/game';
import {createContracts} from '../../src/core/tables/contracts';
import {createRecords,bestRecords} from '../../src/core/tables/records';
import {createFinale,applyFinaleCommand,bestFinale} from '../../src/core/tables/finale';
import {bossMechanic} from '../../src/core/tables/boss';
import {mkdir} from 'node:fs/promises';
const evidence=process.env.EVIDENCE_DIR??'docs/evidence/casino-finale/public-smoke';
async function open(page:Page,table:GameState['activeTable']){
 const s=createGame(3);s.settings.volume=0;s.settings.reducedMotion=true;s.seals={urns:true,contracts:true,records:true};s.activeTable=table;s.contracts=createContracts(31,'varied');s.records=createRecords(123);s.finale=createFinale(3,'boss-v1');
 if(table==='finale'){let f=applyFinaleCommand(s.finale,{type:'begin',commandId:'begin',expectedRevision:0});while(bossMechanic(f)!=='poker')f=applyFinaleCommand(f,{type:f.phase==='choose'?'choose':'next',choice:bestFinale(f)[0],commandId:'prep'+f.revision,expectedRevision:f.revision});s.finale=f;}
 if(table==='outside'){let f=s.finale;for(let i=0;i<100&&f.phase!=='complete';i++)f=applyFinaleCommand(f,{type:!f.boss!.started?'begin':f.phase==='choose'?'choose':'next',choice:bestFinale(f)[0],commandId:'win'+f.revision,expectedRevision:f.revision});s.finale=f;s.freed=true;s.freedomMethod='independent';s.settings.reducedMotion=false;}
 await page.emulateMedia({reducedMotion:'no-preference'});await page.addInitScript(s=>{if(!localStorage.getItem('thegame.save.v1.current'))localStorage.setItem('thegame.save.v1.current',JSON.stringify({schemaVersion:10,contentVersion:'campaign-casino-v10',state:s}));},s);await page.goto('./');await page.waitForFunction(()=>window.__THEGAME_READY__);await page.getByTestId('continue-game').click();await mkdir(evidence,{recursive:true});
}
test('public Doble presentation and new question accept one saved decision',async({page})=>{
 await open(page,'contracts');const r=(await page.locator('.doble-intro').boundingBox())!;expect(r.y).toBeGreaterThanOrEqual(0);await page.getByTestId('doble-begin').click();await expect(page.getByTestId('challenge-question')).toContainText('promedio');await page.getByTestId('contract-J').click();await page.getByTestId('doble-sign').click();await expect(page.getByTestId('varied-feedback')).toContainText('Buena decisión');expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('thegame.save.v1.current')!).state.contracts.variant)).toBe('varied');await page.screenshot({path:`${evidence}/doble.png`});
});
test('public boss has physical cards, one pedestal and a separate readable dock',async({page})=>{
 await open(page,'finale');const data=await page.evaluate(()=>window.__THEGAME_METRICS__!() as {pokerCardCount:number;outerTableLegs:number;centralPedestals:number;visibleHostProps:Record<string,number>});expect(data.pokerCardCount).toBe(9);expect(data.outerTableLegs).toBe(0);expect(data.centralPedestals).toBe(1);expect(data.visibleHostProps.captor).toBeGreaterThan(0);const stage=(await page.locator('.casino-stage').boundingBox())!,dock=(await page.locator('.ada-evidence').boundingBox())!;expect(dock.y).toBeGreaterThanOrEqual(stage.y+stage.height-1);await page.getByRole('button',{name:'Ver las cartas de cerca'}).click();await expect(page.getByRole('dialog').getByTestId('community-cards').locator('.poker-card')).toHaveCount(5);await page.getByTestId('close-dialog').click();await page.screenshot({path:`${evidence}/boss.png`});
});
test('public Ada deals cards and retains the additive decision bonus',async({page})=>{
 await open(page,'records');await page.getByTestId('records-begin').click();expect(await page.evaluate(()=>(window.__THEGAME_METRICS__!() as {pokerCardCount:number}).pokerCardCount)).toBe(9);const s=await page.evaluate(()=>JSON.parse(localStorage.getItem('thegame.save.v1.current')!).state.records);await page.getByTestId('records-'+bestRecords(s)[0]).click();await page.getByTestId('records-confirm').click();await expect(page.getByTestId('poker-points-breakdown')).toContainText('Decisión: +2');await page.screenshot({path:`${evidence}/ada.png`});
});
test('public painted victory can replay and skip the first person exit',async({page})=>{
 await open(page,'outside');await expect(page.getByTestId('victory-screen')).toContainText('Ganaste');expect(await page.locator('.street-dawn').evaluate(n=>getComputedStyle(n).backgroundImage)).toContain('escape-dawn-v1.png');await page.getByTestId('replay-escape').click();await expect(page.getByTestId('skip-escape')).toBeVisible();expect(await page.evaluate(()=>(window.__THEGAME_METRICS__!() as {escapeActive:boolean}).escapeActive)).toBe(true);await page.getByTestId('skip-escape').click();await expect(page.getByTestId('victory-screen')).toBeVisible();await page.screenshot({path:`${evidence}/victory.png`});
});

import {test,expect,type Page} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
import {createGame,choose,advance,bestChoices} from '../../src/core/game';
import {createContracts} from '../../src/core/tables/contracts';
const evidence=process.env.EVIDENCE_DIR??'.tools/dice-roll';
async function open(page:Page,reducedMotion=false){
 let s=createGame(8);for(let i=0;i<35&&s.phase!=='complete';i++)s=['choose','guided'].includes(s.phase)?choose(s,bestChoices(s)[0] as 0|1):advance(s);
 s.contracts=createContracts(1);s.seals={urns:true,contracts:false};s.activeTable='contracts';s.settings.volume=0;s.settings.reducedMotion=reducedMotion;
 await page.addInitScript(raw=>{if(!localStorage.getItem('thegame.save.v1.current'))localStorage.setItem('thegame.save.v1.current',raw);},JSON.stringify({schemaVersion:5,contentVersion:'campaign-challenge-v5',state:s}));await page.goto('./');await page.waitForFunction(()=>window.__THEGAME_READY__);await page.getByTestId('continue-game').click();await page.getByTestId('doble-begin').click();
}
const metrics=(page:Page)=>page.evaluate(()=>window.__THEGAME_METRICS__!() as {diceRolling:boolean;diceRollCount:number;dicePositions:{x:number;y:number;z:number}[];activeNames:string[]});
const saved=(page:Page)=>page.evaluate(()=>JSON.parse(localStorage.getItem('thegame.save.v1.current')!).state.contracts);

test('visible table rolls once, settles on the saved pair and preserves the canvas',async({page})=>{
 await mkdir(evidence,{recursive:true});await open(page);await page.waitForTimeout(1200);
 await expect(page.getByTestId('dice-viewport').locator('canvas')).toHaveCount(1);await writeFile(`${evidence}/table-metrics.json`,JSON.stringify(await metrics(page),null,2));await page.screenshot({path:`${evidence}/table-ready.png`});
 expect((await metrics(page)).activeNames).toEqual(expect.arrayContaining(['table-felt','table-edge','contract-die-0','contract-die-1']));
 await page.getByTestId('contract-J').click();await page.getByTestId('doble-sign').click();
 await expect(page.getByTestId('dice-status')).toHaveText('Tirando los dados…');await expect(page.getByTestId('doble-next')).toBeDisabled();
 const first=await metrics(page),record=await saved(page);expect(first.diceRolling).toBe(true);expect(first.diceRollCount).toBe(1);
 await page.waitForTimeout(120);expect((await metrics(page)).dicePositions).not.toEqual(first.dicePositions);await page.screenshot({path:`${evidence}/table-rolling.png`});
 await expect(page.getByTestId('dice-status')).toHaveText(`Dado 1: ${record.pair[0]} · Dado 2: ${record.pair[1]} · Suma ${record.pair[0]+record.pair[1]}`);await expect(page.getByTestId('doble-next')).toBeEnabled();
 expect(await saved(page)).toEqual(record);expect((await metrics(page)).diceRolling).toBe(false);await writeFile(`${evidence}/result-metrics.json`,JSON.stringify(await metrics(page),null,2));await page.screenshot({path:`${evidence}/table-result.png`});
 await page.getByTestId('doble-next').click();expect((await metrics(page)).diceRollCount).toBe(1);await expect(page.getByTestId('dice-status')).toContainText('Tirada anterior');await page.getByTestId('contract-S').click();await page.getByTestId('doble-sign').click();expect((await metrics(page)).diceRollCount).toBe(1);
 await page.getByTestId('back-room').click();await expect(page.locator('body > #scene')).toHaveCount(1);await page.getByTestId('enter-urns').click();await expect(page.locator('body > #scene')).toHaveCount(1);
 await page.reload();await page.waitForFunction(()=>window.__THEGAME_READY__);await page.getByTestId('continue-game').click();expect((await saved(page)).pair).toEqual(record.pair);
});

test('reduced motion shows the exact result immediately without a roll animation',async({page})=>{
 await open(page,true);await page.getByTestId('contract-S').click();await page.getByTestId('doble-sign').click();
 await expect(page.getByTestId('dice-status')).toContainText('Suma');await expect(page.getByTestId('doble-next')).toBeEnabled();expect((await metrics(page)).diceRollCount).toBe(0);expect((await metrics(page)).diceRolling).toBe(false);
});

test('HTML table and numbered result remain usable when WebGL is unavailable',async({page})=>{
 await page.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;Object.defineProperty(HTMLCanvasElement.prototype,'getContext',{value:function(this:HTMLCanvasElement,type:string,...args:unknown[]){return ['webgl','webgl2','experimental-webgl'].includes(type)?null:Reflect.apply(original,this,[type,...args]);}});});
 await open(page,true);await expect(page.locator('.dice-table-fallback')).toBeVisible();await page.getByTestId('contract-C').click();await page.getByTestId('doble-sign').click();const c=await saved(page);await expect(page.getByTestId('dice-status')).toContainText(`Suma ${c.pair[0]+c.pair[1]}`);await expect(page.getByTestId('doble-next')).toBeEnabled();
});

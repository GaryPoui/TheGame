import {test,expect,type Page} from '@playwright/test';
import {mkdir} from 'node:fs/promises';
import {createGame,choose,advance,bestChoices} from '../../src/core/game';
import {createContracts,applyContractCommand,currentObjective} from '../../src/core/tables/contracts';
import {bestContracts} from '../../src/core/math/dice';
import {createRecords,applyRecordsCommand,bestRecords} from '../../src/core/tables/records';
const evidence=process.env.EVIDENCE_DIR??'.tools/ada-layout';
function checkpoint(comparison=false){
 let s=createGame(7);s.settings.volume=0;s.settings.reducedMotion=true;
 for(let i=0;i<35&&s.phase!=='complete';i++)s=['choose','guided'].includes(s.phase)?choose(s,bestChoices(s)[0] as 0|1):advance(s);
 s.contracts=createContracts(4);for(let i=0;i<40&&s.contracts.phase!=='complete';i++){const c=s.contracts;s.contracts=applyContractCommand(c,{type:c.phase==='tutorial'?'begin':['offer','order'].includes(c.phase)?'sign':'next',contract:bestContracts(currentObjective(c))[0],commandId:'c'+c.revision,expectedRevision:c.revision});}
 s.records=createRecords(1,false,'photos-v2');s.activeTable='records';s.seals={urns:true,contracts:true};
 if(comparison){for(let i=0;i<20&&!(s.records.phase==='choose'&&s.records.round===2);i++){const r=s.records;s.records=applyRecordsCommand(r,{type:r.phase==='tutorial'?r.diagnostic===null?'diagnose':'begin':r.phase==='feedback'?'next':'choose',choice:r.phase==='tutorial'?'no':bestRecords(r)[0],commandId:'a'+r.revision,expectedRevision:r.revision});}}
 return s;
}
async function open(page:Page,comparison=false){await page.addInitScript(raw=>{if(!localStorage.getItem('thegame.save.v1.current'))localStorage.setItem('thegame.save.v1.current',raw);},JSON.stringify({schemaVersion:5,contentVersion:'campaign-challenge-v5',state:checkpoint(comparison)}));await page.goto('./');await page.waitForFunction(()=>window.__THEGAME_READY__);await page.getByTestId('continue-game').click();}
async function tableReady(page:Page){await expect.poll(()=>page.evaluate(()=>{const m=window.__THEGAME_METRICS__!() as {tableHost:string;tableTextureReady:boolean};return m.tableHost==='ada'&&m.tableTextureReady;})).toBe(true);await expect(page.getByTestId('ada-viewport').locator('canvas')).toHaveCount(1);}
async function fits(page:Page,width:number){expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);const panel=(await page.locator('.archive-panel').boundingBox())!;expect(panel.x).toBeGreaterThanOrEqual(0);expect(panel.x+panel.width).toBeLessThanOrEqual(width);}

test('Ada uses the shared table with responsive photos and an unscored diagnostic',async({page})=>{
 await mkdir(evidence,{recursive:true});await open(page);await tableReady(page);const before=await page.evaluate(()=>localStorage.getItem('thegame.save.v1.current'));
 for(const [width,height] of [[1673,840],[1440,900],[1366,768],[900,900],[390,844]]){await page.setViewportSize({width:width!,height:height!});await page.evaluate(()=>scrollTo(0,0));await tableReady(page);await fits(page,width!);await expect(page.locator('.ada-evidence .result-photo')).toHaveCount(4);await page.screenshot({path:`${evidence}/ada-diagnostic-${width}.png`,fullPage:true});}
 expect(await page.evaluate(()=>localStorage.getItem('thegame.save.v1.current'))).toBe(before);await page.getByTestId('records-diagnostic-no').click();await expect(page.getByTestId('records-diagnostic-feedback')).toContainText('La respuesta es No');await page.getByTestId('records-begin').click();await page.getByTestId('records-archive').click();await page.getByTestId('records-confirm').click();await expect(page.locator('.photo-lost')).toHaveCount(4);await page.screenshot({path:`${evidence}/ada-revealed-mobile.png`,fullPage:true});await page.getByTestId('back-room').click();await expect(page.locator('body > #scene')).toHaveCount(1);
});

test('advanced album comparison keeps all records and playable choices visible',async({page})=>{
 await mkdir(evidence,{recursive:true});await open(page,true);await tableReady(page);await expect(page.locator('.ada-album-group')).toHaveCount(2);await expect(page.locator('.ada-album-group').nth(0).locator('.result-photo')).toHaveCount(4);await expect(page.locator('.ada-album-group').nth(1).locator('.result-photo')).toHaveCount(8);
 for(const [width,height] of [[1440,900],[390,844]]){await page.setViewportSize({width:width!,height:height!});await fits(page,width!);await page.screenshot({path:`${evidence}/ada-comparison-${width}.png`,fullPage:true});}
 await page.getByTestId('records-both').click();await expect(page.getByTestId('records-confirm')).toBeEnabled();await page.getByTestId('records-confirm').click();await expect(page.getByTestId('records-feedback')).toContainText('Buena decisión');
});

test('Ada photo decisions work with the matching HTML table when WebGL is unavailable',async({page})=>{
 await page.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;Object.defineProperty(HTMLCanvasElement.prototype,'getContext',{value:function(this:HTMLCanvasElement,type:string,...args:unknown[]){return ['webgl','webgl2','experimental-webgl'].includes(type)?null:Reflect.apply(original,this,[type,...args]);}});});await open(page);await expect(page.locator('.ada-table-fallback')).toBeVisible();await expect(page.locator('.ada-fallback-portrait')).toBeVisible();await page.getByTestId('records-diagnostic-no').click();await page.getByTestId('records-begin').click();await page.getByTestId('records-archive').click();await page.getByTestId('records-confirm').click();await expect(page.getByTestId('records-feedback')).toContainText('Buena decisión');
});

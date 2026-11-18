import {test,expect,type Page} from '@playwright/test';
import {createGame} from '../../src/core/game';
import {createFinale} from '../../src/core/tables/finale';
import {createContracts} from '../../src/core/tables/contracts';
import {createRecords} from '../../src/core/tables/records';
import {mkdir,writeFile} from 'node:fs/promises';
const evidence=process.env.EVIDENCE_DIR??'docs/evidence/urns-zoom';
async function open(page:Page){
 const s=createGame(3);s.settings.volume=0;s.settings.reducedMotion=true;s.activeTable='urns';
 await page.addInitScript(s=>localStorage.setItem('thegame.save.v1.current',JSON.stringify({schemaVersion:8,contentVersion:'campaign-boss-v8',state:s})),s);
 await page.goto('./');await page.waitForFunction(()=>window.__THEGAME_READY__);await page.getByTestId('continue-game').click();
}
async function fits(page:Page){
 const bad=await page.locator('main button,main canvas,main .game-panel,main .table-heading').evaluateAll(nodes=>nodes.filter(n=>n.checkVisibility()).filter(n=>{const r=n.getBoundingClientRect();return r.left< -1||r.top< -1||r.right>innerWidth+1||r.bottom>innerHeight+1;}).map(n=>({id:n.getAttribute('data-testid')??n.className,rect:n.getBoundingClientRect().toJSON()})));
 expect(bad).toEqual([]);
 expect(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight+1&&document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
}
test('normal urn decisions provide counts without calculated probabilities',async({page})=>{
 await open(page);await page.getByTestId('toggle-cards').click();
 for(const id of ['urn-0','urn-1']){await expect(page.getByTestId(id)).not.toContainText('%');await expect(page.getByTestId(id).locator('.odds')).toHaveCount(0);await expect(page.getByTestId(id).locator('.inventory')).toBeVisible();}
});
test('Vera glass remains clickable after resize, settings and a return from the room',async({page})=>{
 await open(page);await page.setViewportSize({width:1093,height:615});
 await page.getByTestId('settings-button').click();await page.getByTestId('text-scale').selectOption('2');await page.getByTestId('close-dialog').click();await fits(page);
 const clickUrn=async()=>{const r=await page.locator('.vera-viewport canvas').boundingBox();const p=await page.evaluate(()=>(window.__THEGAME_METRICS__!() as {urnTargets:{x:number;y:number}[]}).urnTargets[0]!);await page.mouse.click(r!.x+p.x*r!.width,r!.y+p.y*r!.height);await expect(page.getByTestId('urn-0')).toHaveAttribute('aria-pressed','true');};
 await clickUrn();await page.getByRole('button',{name:'Ayuda y opciones'}).click();await page.getByRole('dialog').getByTestId('back-room').click();await page.getByTestId('enter-urns').click();await page.getByTestId('skip-tutorial').click();await clickUrn();await fits(page);
});
test('intermediate zoom keeps the other tables inside the screen',async({page})=>{
 test.setTimeout(120000);
 for(const table of ['contracts','records','finale']as const){
  const s=createGame(3);s.settings.volume=0;s.settings.reducedMotion=true;s.activeTable=table;s.seals={urns:true,contracts:true,records:true};s.finale=createFinale(3,'boss-v1');
  s.contracts=createContracts(1);s.records=createRecords(123);
  await page.goto('./');await page.evaluate(s=>{localStorage.setItem('thegame.save.v1.current',JSON.stringify({schemaVersion:8,contentVersion:'campaign-boss-v8',state:s}));},s);await page.reload();await page.waitForFunction(()=>window.__THEGAME_READY__);await page.getByTestId('continue-game').click();
  if(table==='contracts')await page.getByTestId('doble-begin').click();if(table==='records')await page.getByTestId('records-begin').click();if(table==='finale')await page.getByTestId('finale-begin').click();
  for(const [width,height]of [[1093,615],[1000,601],[800,640],[768,614]]){await page.setViewportSize({width,height});await fits(page);}
 }
});
test('Vera table and choices fit intermediate zoom sizes before and after extraction',async({page})=>{
 test.setTimeout(150000);await open(page);await page.getByTestId('toggle-cards').click();
 const sizes=[[1366,768],[1200,675],[1093,615],[1000,601],[911,512],[800,640],[768,614],[640,512],[548,439],[500,400]];
 await mkdir(evidence,{recursive:true});const frames=[];
 for(const [width,height]of sizes){await page.setViewportSize({width,height});await fits(page);await page.getByTestId('urn-0').click();await fits(page);
  const bounds=await page.locator('.vera-viewport').boundingBox();expect(bounds).not.toBeNull();expect(bounds!.height).toBeGreaterThan(100);
  const m=await page.evaluate(()=>(window.__THEGAME_METRICS__!() as {urnTargets:{x:number;y:number}[];tableFrame:{x:number;y:number}[]}));
  for(const point of [...m.urnTargets,...m.tableFrame]){expect(point.x).toBeGreaterThanOrEqual(0);expect(point.x).toBeLessThanOrEqual(1);expect(point.y).toBeGreaterThanOrEqual(0);expect(point.y).toBeLessThanOrEqual(1);}
  frames.push({width,height,bounds,...m});
 }
 await page.screenshot({path:`${evidence}/compact-choice.png`});await page.getByTestId('confirm-choice').click();
 for(const [width,height]of sizes){await page.setViewportSize({width,height});await fits(page);}
 await page.setViewportSize({width:1093,height:615});await page.screenshot({path:`${evidence}/intermediate-result.png`});await writeFile(`${evidence}/frames.json`,JSON.stringify(frames,null,2));
});

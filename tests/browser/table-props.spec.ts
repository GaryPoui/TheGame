import {test,expect,type Page} from '@playwright/test';
import {createGame} from '../../src/core/game';
import {createRecords,bestRecords,applyRecordsCommand} from '../../src/core/tables/records';
import {createFinale,applyFinaleCommand,bestFinale} from '../../src/core/tables/finale';
import {bossMechanic} from '../../src/core/tables/boss';
import {mkdir,writeFile} from 'node:fs/promises';
const evidence=process.env.EVIDENCE_DIR??'docs/evidence/table-props';
async function open(page:Page,table:'urns'|'records'|'finale',width=1280,height=720){
 await page.setViewportSize({width,height});const s=createGame(3);s.settings.volume=0;s.settings.reducedMotion=true;s.activeTable=table;s.seals={urns:true,contracts:true,records:true};s.finale=createFinale(3,'boss-v1');s.records=createRecords(123);
 await page.addInitScript(s=>{if(!localStorage.getItem('thegame.save.v1.current'))localStorage.setItem('thegame.save.v1.current',JSON.stringify({schemaVersion:8,contentVersion:'campaign-boss-v8',state:s}));},s);await page.goto('./');await page.waitForFunction(()=>window.__THEGAME_READY__);await page.getByTestId('continue-game').click();
}
async function fits(page:Page){expect(await page.locator('main button,main canvas,main .poker-card').evaluateAll(nodes=>nodes.filter(n=>n.checkVisibility()).filter(n=>{const r=n.getBoundingClientRect();return r.left< -1||r.top< -1||r.right>innerWidth+1||r.bottom>innerHeight+1}).map(n=>n.getAttribute('data-testid')??n.className))).toEqual([]);expect(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight+1&&document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);}
for(const [width,height]of [[1280,720],[1093,615],[640,360],[390,844]])test(`Vera tutorial updates the same stage and remaining cards ${width}x${height}`,async({page})=>{
 await mkdir(evidence,{recursive:true});await open(page,'urns',width,height);await page.getByRole('button',{name:'Ayuda y opciones'}).click();await page.getByRole('dialog').getByTestId('repeat-tutorial').click();const save=await page.evaluate(()=>localStorage.getItem('thegame.save.v1.current'));
 await expect(page.locator('.tutorial-viewport canvas')).toBeVisible();await fits(page);await page.getByTestId('toggle-cards').click();await page.getByTestId('demo-urn-0').click();await page.getByTestId('tutorial-next').click();
 await expect(page.getByTestId('demo-urn-0')).toContainText('2/4');await expect(page.getByTestId('demo-urn-0')).toContainText('50 %');await expect.poll(()=>page.evaluate(()=>(window.__THEGAME_METRICS__!() as {visibleUrnTokens:number}).visibleUrnTokens)).toBe(6);await fits(page);
 await page.screenshot({path:`${evidence}/tutorial-${width}.png`});await page.getByTestId('tutorial-next').click();await page.getByTestId('toggle-cards').click();await page.getByTestId('demo-urn-1').click();await page.getByTestId('tutorial-next').click();
 await expect(page.getByTestId('demo-urn-1')).toContainText('1/1');await expect(page.getByTestId('demo-urn-1')).toContainText('100 %');await expect.poll(()=>page.evaluate(()=>(window.__THEGAME_METRICS__!() as {visibleUrnTokens:number}).visibleUrnTokens)).toBe(5);await fits(page);expect(await page.evaluate(()=>localStorage.getItem('thegame.save.v1.current'))).toBe(save);
});
for(const [width,height]of [[1280,720],[1093,615],[640,360]])test(`boss swaps actual urns dice and cards on the felt ${width}x${height}`,async({page})=>{
 test.setTimeout(120000);await mkdir(evidence,{recursive:true});await open(page,'finale',width,height);await page.getByTestId('finale-begin').click();let f=createFinale(3,'boss-v1');f=applyFinaleCommand(f,{type:'begin',commandId:'begin',expectedRevision:0});const seen=new Set<string>(),samples=[];
 while(seen.size<3){
  const kind=bossMechanic(f);const m=await page.evaluate(()=>(window.__THEGAME_METRICS__!() as {visibleUrnVessels:number;diceFaces:number[][];pokerCardCount:number;pokerDeckCount:number;pokerReady:boolean}));
  if(kind==='urns'){expect(m.visibleUrnVessels).toBe(2);expect(m.diceFaces).toHaveLength(0);expect(m.pokerCardCount).toBe(0);await expect(page.locator('.boss-choices')).not.toContainText('%');await expect(page.locator('.boss-choices .odds')).toHaveCount(0);}
  if(kind==='dice'){expect(m.visibleUrnVessels).toBe(0);expect(m.diceFaces).toHaveLength(2);expect(m.pokerCardCount).toBe(0);}
  if(kind==='poker'){expect(m.visibleUrnVessels).toBe(0);expect(m.diceFaces).toHaveLength(0);expect(m.pokerCardCount).toBe(9);expect(m.pokerDeckCount).toBe(4);await expect.poll(()=>page.evaluate(()=>(window.__THEGAME_METRICS__!() as {pokerReady:boolean}).pokerReady)).toBe(true);if(height!<600){await page.getByRole('button',{name:'Ver las cartas de cerca'}).click();await expect(page.getByRole('dialog').getByTestId('player-cards').locator('.poker-card')).toHaveCount(2);await page.getByTestId('close-dialog').click();}}
  await fits(page);if(!seen.has(kind))await page.screenshot({path:`${evidence}/boss-${kind}-${width}.png`});seen.add(kind);samples.push({kind,...m});const choice=bestFinale(f)[0]!;
  await page.getByTestId('finale-'+choice).click();await page.getByTestId('finale-confirm').click();f=applyFinaleCommand(f,{type:'choose',choice,commandId:'choose'+f.revision,expectedRevision:f.revision});await fits(page);
  if(kind==='dice'){const faces=await page.evaluate(()=>(window.__THEGAME_METRICS__!() as {diceFaces:number[][]}).diceFaces);expect(faces.map(d=>d[0])).toEqual(f.pair);}
  if(kind==='poker')await page.screenshot({path:`${evidence}/boss-poker-reveal-${width}.png`});await page.getByTestId('finale-next').click();f=applyFinaleCommand(f,{type:'next',commandId:'next'+f.revision,expectedRevision:f.revision});
 }
 await writeFile(`${evidence}/props-${width}.json`,JSON.stringify(samples,null,2));
});
test('Ada awards the decision bonus separately and preserves it on reload',async({page})=>{
 await open(page,'records');await page.getByTestId('records-begin').click();const read=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('thegame.save.v1.current')!).state.records);const s=await read();expect(s.decisionBonus).toBe(true);const choice=bestRecords(s)[0]!;
 await page.getByTestId('records-'+choice).click();await page.getByTestId('records-confirm').click();const n=await read();expect(n.holdem.result.decisionBonus).toBe(2);expect(n).toEqual(applyRecordsCommand(s,n.journal.at(-1)));await expect(page.getByTestId('poker-points-breakdown')).toContainText('Decisión: +2');await fits(page);await page.reload();await page.waitForFunction(()=>window.__THEGAME_READY__);await page.getByTestId('continue-game').click();expect(await read()).toEqual(n);
});

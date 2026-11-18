import {test,expect,type Page} from '@playwright/test';
import {mkdir} from 'node:fs/promises';
import {createGame,choose,advance,bestChoices,type GameState} from '../../src/core/game';
import {createContracts} from '../../src/core/tables/contracts';
import {createRecords,bestRecords} from '../../src/core/tables/records';

test.use({actionTimeout:15000});
const evidence=process.env.EVIDENCE_DIR??'.tools/requirements-review';
function fixture(table:'contracts'|'records'):GameState {
 let s=createGame(8);s.settings.reducedMotion=true;s.settings.volume=0;
 for(let i=0;i<35&&s.phase!=='complete';i++)s=['choose','guided'].includes(s.phase)?choose(s,bestChoices(s)[0] as 0|1):advance(s);
 s.seals={urns:true,contracts:table==='records'};s.activeTable=table;
 if(table==='contracts')s.contracts=createContracts(1);else s.records=createRecords(11,false,'cards-v1');
 return s;
}
async function open(page:Page,s:GameState){
 await page.goto('./');await page.evaluate(s=>{localStorage.clear();localStorage.setItem('thegame.save.v1.current',JSON.stringify({schemaVersion:6,contentVersion:'campaign-cards-v6',state:s}));},s);
 await page.reload();await page.waitForFunction(()=>window.__THEGAME_READY__);await page.getByTestId('continue-game').click();
}
async function check(page:Page){
 expect(await page.locator('h1,h2,h3,h4,h5,h6').evaluateAll(nodes=>nodes.filter(el=>el.checkVisibility()&&el.textContent?.includes('.')).map(el=>el.textContent))).toEqual([]);
 expect(await page.evaluate(()=>document.documentElement.scrollHeight)).toBe(page.viewportSize()!.height);
 expect(await page.locator('main button').evaluateAll(nodes=>nodes.filter(el=>el.checkVisibility()).filter(el=>{const r=el.getBoundingClientRect();return r.bottom>innerHeight+1||r.top<0||r.left<0||r.right>innerWidth+1;}).map(el=>el.textContent))).toEqual([]);
}
for(const [width,height] of [[1024,640],[1280,720],[1440,900]])test(`requested changes fit ${width}x${height} and tutorials preserve progress`,async({page})=>{
 test.setTimeout(120000);await mkdir(evidence,{recursive:true});await page.setViewportSize({width:width!,height:height!});
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await open(page,fixture('contracts'));const beforeDice=await page.evaluate(()=>localStorage.getItem('thegame.save.v1.current'));
 for(let i=0;i<3;i++){await check(page);if(i<2)await page.getByTestId('doble-tutorial-next').click();}
 await page.getByRole('button',{name:/Cómo calcular el promedio/}).click();await expect(page.getByRole('dialog')).toContainText('(6 × 23 − 30 × 1) ÷ 36');await page.getByTestId('close-dialog').click();
 expect(await page.evaluate(()=>localStorage.getItem('thegame.save.v1.current'))).toBe(beforeDice);
 await page.getByTestId('doble-begin').click();await check(page);await expect(page.getByTestId('contract-C')).toContainText('Ganás 5 o perdés 1');
 await expect.poll(async()=>page.evaluate(()=>((window.__THEGAME_METRICS__?.() as {activeNames:string[]})?.activeNames??[]).filter(n=>n==='table-leg').length)).toBe(4);
 await page.getByTestId('contract-J').click();await page.getByTestId('doble-sign').click();await check(page);
 await page.screenshot({path:`${evidence}/dice-${width}.png`});
 await page.getByTestId('settings-button').click();await expect(page.getByRole('tab',{name:'Pantalla',exact:true})).toBeVisible();await expect(page.getByRole('switch',{name:'Reducir movimiento',exact:true})).toBeChecked();await page.getByRole('tab',{name:'Sonido',exact:true}).click();await expect(page.getByTestId('volume-value')).toHaveText('0 %');await page.getByTestId('close-dialog').click();
 await open(page,fixture('records'));const beforeCards=await page.evaluate(()=>localStorage.getItem('thegame.save.v1.current'));
 await check(page);await expect(page.getByTestId('records-tutorial-step')).toContainText('1 de 3');await page.getByTestId('records-tutorial-next').click();await check(page);await expect(page.locator('.tutorial-accounts')).toContainText('4 ÷ 6');
 await page.getByTestId('records-tutorial-next').click();await check(page);await expect(page.locator('.tutorial-accounts')).toContainText('3 ÷ 5');
 expect(await page.evaluate(()=>localStorage.getItem('thegame.save.v1.current'))).toBe(beforeCards);
 await page.screenshot({path:`${evidence}/cards-tutorial-${width}.png`});await page.getByTestId('records-tutorial-back').click();await expect(page.getByTestId('records-tutorial-step')).toContainText('2 de 3');await page.getByTestId('records-tutorial-next').click();await page.getByTestId('records-begin').click();
 const cards=await page.evaluate(()=>JSON.parse(localStorage.getItem('thegame.save.v1.current')!).state.records);await page.getByTestId('records-'+bestRecords(cards)[0]).click();await page.getByTestId('records-confirm').click();await check(page);
 expect(await page.locator('.archive-panel').evaluate(el=>getComputedStyle(el).fontFamily.split(',')[0]!.trim())).toBe('Arial');
 await page.getByTestId('back-room').click();await check(page);expect(errors).toEqual([]);
});

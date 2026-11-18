import {test,expect,type Page} from '@playwright/test';
import {mkdir} from 'node:fs/promises';
import {createGame} from '../../src/core/game';
import {createContracts} from '../../src/core/tables/contracts';
import {createRecords} from '../../src/core/tables/records';
import {createFinale} from '../../src/core/tables/finale';
const evidence=process.env.EVIDENCE_DIR??'docs/evidence/deep-polish';
async function ready(page:Page){await page.goto('./');await page.waitForFunction(()=>window.__THEGAME_READY__);}
test('3D dice have visible pips before the first roll',async({page})=>{
 const s=createGame(18);s.seals={urns:true,contracts:false};s.contracts=createContracts(1);s.activeTable='contracts';s.settings.reducedMotion=true;s.settings.volume=0;
 await page.addInitScript(s=>localStorage.setItem('thegame.save.v1.current',JSON.stringify({schemaVersion:8,contentVersion:'campaign-boss-v8',state:s})),s);
 await ready(page);await page.getByTestId('continue-game').click();await page.getByTestId('doble-begin').click();
 await expect.poll(()=>page.evaluate(()=>(window.__THEGAME_METRICS__!() as {activeNames:string[]}).activeNames.filter(n=>n==='contract-pip').length)).toBeGreaterThan(0);
 await mkdir(evidence,{recursive:true});await page.screenshot({path:`${evidence}/dice-ready.png`});
 await page.getByTestId('contract-S').click();await page.getByTestId('doble-sign').click();
 await expect(page.getByTestId('dice-status')).toContainText('Suma');await page.screenshot({path:`${evidence}/dice-result.png`});
 const pair=await page.evaluate(()=>JSON.parse(localStorage.getItem('thegame.save.v1.current')!).state.contracts.pair);
 const faces=await page.evaluate(()=>(window.__THEGAME_METRICS__!() as {diceFaces:number[][]}).diceFaces);
 expect(faces.map(f=>f[0])).toEqual(pair);for(const values of faces){expect([...values].sort()).toEqual([1,2,3,4,5,6]);expect(values[0]!+values[1]!).toBe(7);expect(values[2]!+values[3]!).toBe(7);expect(values[4]!+values[5]!).toBe(7);}
});
for(const [width,height,scale] of [[1280,720,1],[1024,640,2],[390,844,2]])test(`guided poker and nine hand examples fit ${width} text ${scale} without altering progress`,async({page})=>{
 await page.setViewportSize({width:width!,height:height!});const s=createGame(18);s.seals={urns:true,contracts:true};s.records=createRecords(123);s.activeTable='records';s.settings.reducedMotion=true;s.settings.volume=0;s.settings.textScale=scale!;
 await page.addInitScript(s=>{if(!localStorage.getItem('thegame.save.v1.current'))localStorage.setItem('thegame.save.v1.current',JSON.stringify({schemaVersion:8,contentVersion:'campaign-boss-v8',state:s}));},s);
 await ready(page);await page.getByTestId('continue-game').click();const before=await page.evaluate(()=>localStorage.getItem('thegame.save.v1.current'));
 await page.getByRole('button',{name:'Probar una mano guiada',exact:true}).click();await expect(page.getByRole('dialog')).toContainText('Ejemplo preparado');await expect(page.locator('[data-demo-reveal]')).toBeDisabled();
 await page.locator('[data-demo-choice="three-kind"]').click();await page.locator('[data-demo-reveal]').click();await expect(page.locator('.guide-result')).toContainText('Ganar con una categoría distinta no alcanza');await fitsDialog(page);
 await page.locator('[data-demo-reset]').click();await page.locator('[data-demo-choice="full-house"]').click();await page.locator('[data-demo-reveal]').click();await expect(page.locator('.guide-result')).toContainText('24 puntos');await fitsDialog(page);
 await mkdir(evidence,{recursive:true});await page.screenshot({path:`${evidence}/poker-guide-${width}.png`});await page.getByTestId('close-dialog').click();await expect(page.getByRole('button',{name:'Probar una mano guiada',exact:true})).toBeFocused();
 expect(await page.evaluate(()=>localStorage.getItem('thegame.save.v1.current'))).toBe(before);
 await page.getByRole('button',{name:'Manos y reglas',exact:false}).click();let seen='';for(let i=0;i<30;i++){await fitsDialog(page);seen+=await page.locator('.reading-pages').innerText();if(await page.locator('[data-page="next"]').isDisabled())break;await page.locator('[data-page="next"]').click();}
 expect(seen).toContain('9 de 9');expect(seen).toContain('Escalera de color');await page.getByTestId('close-dialog').click();expect(await page.evaluate(()=>localStorage.getItem('thegame.save.v1.current'))).toBe(before);
});
async function fitsDialog(page:Page){
 const fit=await page.getByRole('dialog').evaluate(d=>{const r=d.getBoundingClientRect();return {bottom:r.bottom,top:r.top,height:innerHeight,overflow:d.scrollHeight-d.clientHeight,bodyOverflow:(d.querySelector('.modal-body')!.scrollHeight-d.querySelector('.modal-body')!.clientHeight),buttons:[...d.querySelectorAll('button')].filter(b=>b.checkVisibility()).filter(b=>b.getBoundingClientRect().bottom>innerHeight||b.getBoundingClientRect().top<0).map(b=>b.textContent)};});
 expect(fit.top,JSON.stringify(fit)).toBeGreaterThanOrEqual(0);expect(fit.bottom,JSON.stringify(fit)).toBeLessThanOrEqual(fit.height);expect(fit.overflow,JSON.stringify(fit)).toBeLessThanOrEqual(1);expect(fit.bodyOverflow,JSON.stringify(fit)).toBeLessThanOrEqual(1);expect(fit.buttons).toEqual([]);
}
test('boss teaching pages explain defence, combo and the comparison without changing the fight',async({page})=>{
 const s=createGame(18);s.seals={urns:true,contracts:true,records:true};s.finale=createFinale(3,'boss-v1');s.activeTable='finale';s.settings.reducedMotion=true;s.settings.volume=0;s.settings.textScale=2;
 await page.setViewportSize({width:1024,height:640});await page.addInitScript(s=>localStorage.setItem('thegame.save.v1.current',JSON.stringify({schemaVersion:8,contentVersion:'campaign-boss-v8',state:s})),s);await ready(page);await page.getByTestId('continue-game').click();const before=await page.evaluate(()=>localStorage.getItem('thegame.save.v1.current'));
 await page.getByRole('button',{name:'Aprender el duelo',exact:true}).click();let text='';for(let i=0;i<4;i++){await fitsDialog(page);text+=await page.getByRole('dialog').innerText();if(i<3)await page.locator('[data-guide-page="next"]').click();}expect(text).toContain('30 × 7 = 210');expect(text).toContain('seis defensas');await page.getByTestId('close-dialog').click();expect(await page.evaluate(()=>localStorage.getItem('thegame.save.v1.current'))).toBe(before);
});
test('settings made before starting a game survive reload without creating a game',async({page})=>{
 await ready(page);await page.getByTestId('settings-button').click();await page.getByTestId('text-scale').selectOption('1.25');await page.getByTestId('reduced-motion').check();await page.getByRole('tab',{name:'Sonido',exact:true}).click();await page.getByTestId('volume').fill('0');
 await page.reload();await page.getByTestId('settings-button').click();await expect(page.getByTestId('text-scale')).toHaveValue('1.25');await expect(page.getByTestId('reduced-motion')).toBeChecked();await page.getByRole('tab',{name:'Sonido',exact:true}).click();await expect(page.getByTestId('volume')).toHaveValue('0');
 expect(await page.evaluate(()=>localStorage.getItem('thegame.save.v1.current'))).toBeNull();
});
test('nested dice accounts fit enlarged text and return focus to the table after resize',async({page})=>{
 const s=createGame(18);s.seals={urns:true,contracts:false};s.contracts=createContracts(1);s.activeTable='contracts';s.settings.reducedMotion=true;s.settings.volume=0;s.settings.textScale=2;
 await page.setViewportSize({width:1024,height:640});await page.addInitScript(s=>localStorage.setItem('thegame.save.v1.current',JSON.stringify({schemaVersion:8,contentVersion:'campaign-boss-v8',state:s})),s);await ready(page);await page.getByTestId('continue-game').click();await page.getByTestId('doble-begin').click();const before=await page.evaluate(()=>localStorage.getItem('thegame.save.v1.current'));
 const trigger=page.getByRole('button',{name:/Practicar y ver las cuentas/});await trigger.click();await page.getByRole('button',{name:/Ver los 36 pares y comparar contratos/}).click();
 let seen='';for(let i=0;i<25;i++){await fitsDialog(page);seen+=await page.locator('.reading-pages').innerText();if(await page.locator('[data-page="next"]').isDisabled())break;await page.locator('[data-page="next"]').click();}expect(seen).toContain('36 pares');expect(seen).toContain('Promedio');
 await page.setViewportSize({width:1280,height:720});await fitsDialog(page);await page.getByTestId('close-dialog').click();await expect(trigger).toBeFocused();expect(await page.evaluate(()=>localStorage.getItem('thegame.save.v1.current'))).toBe(before);
});

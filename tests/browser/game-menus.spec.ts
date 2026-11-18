import {test,expect,type Page} from '@playwright/test';
import {mkdir} from 'node:fs/promises';
import {createGame,choose,advance,bestChoices} from '../../src/core/game';
import {createDialogue,applyDialogue} from '../../src/core/dialogue/runner';
import {INTRO} from '../../src/content/intro';
const evidence=process.env.EVIDENCE_DIR??'.tools/game-menu-review';
async function open(page:Page){
 let s=createGame(8);s=choose(s,bestChoices(s)[0] as 0|1);s.activeTable='urns';s.settings.volume=0;s.settings.reducedMotion=true;
 await page.addInitScript(s=>localStorage.setItem('thegame.save.v1.current',JSON.stringify({schemaVersion:6,contentVersion:'campaign-cards-v6',state:s})),s);
 await page.goto('./');await page.waitForFunction(()=>window.__THEGAME_READY__);
}
async function fits(page:Page){
 expect(await page.locator('.settings-modal').evaluate(el=>{const b=el.getBoundingClientRect();return b.x>=0&&b.y>=0&&b.right<=innerWidth+1&&b.bottom<=innerHeight+1;})).toBe(true);
 expect(await page.locator('.settings-content').evaluate(el=>el.scrollHeight<=el.clientHeight+1&&el.scrollWidth<=el.clientWidth+1)).toBe(true);
 const clipped=await page.locator('dialog button,dialog input,dialog select').evaluateAll(nodes=>nodes.filter(el=>el.checkVisibility()).filter(el=>{const r=el.getBoundingClientRect();return r.y<0||r.bottom>innerHeight+1||r.x<0||r.right>innerWidth+1;}).map(el=>el.getAttribute('data-testid')??el.textContent));
 expect(clipped).toEqual([]);
}
for(const [width,height] of [[1024,640],[1440,900],[390,844]])for(const scale of [1,2])test(`game options fit ${width}x${height}, text ${scale}`,async({page})=>{
 test.setTimeout(90000);await mkdir(evidence,{recursive:true});await page.setViewportSize({width:width!,height:height!});await open(page);
 const before=await page.evaluate(()=>JSON.parse(localStorage.getItem('thegame.save.v1.current')!).state);
 await expect(page.getByRole('navigation',{name:'Menú principal'})).toBeVisible();
 if(width===1440&&scale===1)await page.screenshot({path:`${evidence}/main-menu.png`});
 await page.getByTestId('settings-button').click();await expect(page.getByRole('dialog',{name:'Opciones',exact:true})).toBeVisible();
 await page.getByTestId('text-scale').selectOption(String(scale));
 for(const tab of ['Pantalla','Sonido','Partida']){
  await page.getByRole('tab',{name:tab,exact:true}).click();await fits(page);
  if(width===1440||scale===1)await page.screenshot({path:`${evidence}/options-${tab}-${width}-${scale}.png`});
 }
 await page.getByRole('tab',{name:'Pantalla',exact:true}).click();await page.getByRole('tab',{name:'Pantalla',exact:true}).press('ArrowDown');await expect(page.getByRole('tab',{name:'Sonido',exact:true})).toBeFocused();
 await page.getByTestId('volume').fill('0.4');await page.getByRole('button',{name:'Subir volumen',exact:true}).click();await expect(page.getByTestId('volume-value')).toHaveText('45 %');
 await page.getByRole('tab',{name:'Pantalla',exact:true}).click();
 if(scale===1){await expect(page.getByRole('button',{name:'Reducir tamaño de texto',exact:true})).toBeDisabled();await page.getByRole('button',{name:'Aumentar tamaño de texto',exact:true}).click();await expect(page.getByTestId('text-scale')).toHaveValue('1.25');}
 else await expect(page.getByRole('button',{name:'Aumentar tamaño de texto',exact:true})).toBeDisabled();
 await page.getByTestId('settings-return').click();await expect(page.getByTestId('settings-button')).toBeFocused();
 const after=await page.evaluate(()=>JSON.parse(localStorage.getItem('thegame.save.v1.current')!).state);expect(after.history).toEqual(before.history);expect(after.rng).toEqual(before.rng);expect(after.settings.volume).toBe(.45);
});

test('menu confirmations and return to title protect the save',async({page})=>{
 test.setTimeout(90000);await open(page);const saved=()=>page.evaluate(()=>localStorage.getItem('thegame.save.v1.current'));const before=await saved();
 await page.getByTestId('new-game').click();await expect(page.getByTestId('confirm-new-game')).toBeVisible();await page.getByTestId('cancel-dialog').click();expect(await saved()).toBe(before);
 await page.getByTestId('settings-button').click();await page.getByRole('tab',{name:'Partida',exact:true}).click();await page.getByTestId('delete-save').click();await page.getByTestId('cancel-delete').click();expect(await saved()).toBe(before);await expect(page.getByRole('tab',{name:'Partida',exact:true})).toHaveAttribute('aria-selected','true');
 await page.getByTestId('settings-return').click();await page.getByTestId('continue-game').click();await page.getByTestId('settings-button').click();await page.getByRole('tab',{name:'Partida',exact:true}).click();await page.getByTestId('return-main-menu').click();await expect(page.getByTestId('continue-game')).toBeVisible();
 const final=JSON.parse((await saved())!);expect(final.state.history).toEqual(JSON.parse(before!).state.history);expect(final.state.rng).toEqual(JSON.parse(before!).state.rng);
});

test('chapter menu keeps locks and provides a path back',async({page})=>{
 await mkdir(evidence,{recursive:true});let s=createGame(8);s.settings.reducedMotion=true;s.settings.volume=0;s.intro=applyDialogue(INTRO,createDialogue(INTRO),{id:'skip',revision:0,type:'skip'});
 await page.addInitScript(s=>localStorage.setItem('thegame.save.v1.current',JSON.stringify({schemaVersion:6,contentVersion:'campaign-cards-v6',state:s})),s);await page.goto('./');await page.waitForFunction(()=>window.__THEGAME_READY__);await page.getByTestId('continue-game').click();
 await expect(page.getByRole('heading',{name:'Elegí una mesa'})).toBeVisible();await expect(page.getByTestId('enter-contracts')).toHaveAttribute('aria-disabled','true');await expect(page.getByTestId('enter-contracts')).toBeDisabled();await page.getByTestId('enter-contracts').dispatchEvent('click');await expect(page.locator('body')).toHaveAttribute('data-screen','room');
 await page.screenshot({path:`${evidence}/chapter-menu.png`});await page.getByRole('button',{name:'Volver al inicio',exact:true}).click();await expect(page.getByRole('navigation',{name:'Menú principal'})).toBeVisible();
});

for(const scale of [1,2])test(`seal and confirmation menus fit text ${scale}`,async({page})=>{
 await mkdir(evidence,{recursive:true});await page.setViewportSize({width:1280,height:720});let s=createGame(8);s.settings.textScale=scale;s.settings.reducedMotion=true;s.settings.volume=0;
 for(let i=0;i<35&&s.phase!=='complete';i++)s=['choose','guided'].includes(s.phase)?choose(s,bestChoices(s)[0] as 0|1):advance(s);s.activeTable='urns';
 await page.addInitScript(s=>localStorage.setItem('thegame.save.v1.current',JSON.stringify({schemaVersion:6,contentVersion:'campaign-cards-v6',state:s})),s);await page.goto('./');await page.waitForFunction(()=>window.__THEGAME_READY__);await page.getByTestId('continue-game').click();await expect(page.getByTestId('completion')).toBeVisible();
 expect(await page.locator('.completion-card button').evaluateAll(nodes=>nodes.filter(el=>{const r=el.getBoundingClientRect();return r.top<0||r.bottom>innerHeight+1;}).map(el=>el.textContent))).toEqual([]);await page.screenshot({path:`${evidence}/seal-${scale}.png`});
 await page.getByTestId('settings-button').click();await page.getByRole('tab',{name:'Partida',exact:true}).click();await page.getByTestId('delete-save').click();
 expect(await page.getByTestId('confirm-delete').evaluate(el=>el.getBoundingClientRect().bottom<=innerHeight)).toBe(true);await page.screenshot({path:`${evidence}/confirmation-${scale}.png`});await page.getByTestId('cancel-delete').click();await page.getByTestId('settings-return').click();await expect(page.getByTestId('completion')).toBeVisible();
});

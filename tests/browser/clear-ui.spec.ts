import {test,expect} from '@playwright/test';
import {mkdir} from 'node:fs/promises';
import {completeIntro} from './story-navigation';
import {createGame,choose,advance,bestChoices,defaultSettings} from '../../src/core/game';
import {createContracts} from '../../src/core/tables/contracts';
import {createRecords} from '../../src/core/tables/records';

declare global { interface Window { __THEGAME_READY__: boolean } }

const evidence='.tools/settings-inputs';
test('settings inputs support keyboard, live volume, persistence and restoring defaults',async({page})=>{
 await page.goto('./');await page.waitForFunction(()=>window.__THEGAME_READY__);
 await page.getByTestId('new-game').click();await page.getByTestId('intro-back').click();await page.getByTestId('settings-button').click();
 const motion=page.getByRole('switch',{name:'Reducir movimiento',exact:true});
 await expect(motion).toHaveAccessibleDescription('Sin movimientos de cámara ni animaciones de reposo.');
 await motion.focus();await motion.press('Space');await expect(motion).toBeChecked();await expect(page.getByTestId('motion-state')).toHaveText('Activado');
 const textScale=page.getByRole('combobox',{name:'Tamaño de texto',exact:true});
 await expect(textScale).toHaveAccessibleDescription('Incluye explicaciones y subtítulos.');
 await textScale.selectOption('1.25');
 await page.getByRole('tab',{name:'Sonido',exact:true}).click();
 const volume=page.getByRole('slider',{name:'Volumen',exact:true});
 await expect(volume).toHaveAccessibleDescription('En cero, el juego queda en silencio.');
 await volume.fill('0.35');await expect(page.getByTestId('volume-value')).toHaveText('35 %');await expect(volume).toHaveAttribute('aria-valuetext','35 %');
 await volume.press('Home');await expect(page.getByTestId('volume-value')).toHaveText('0 %');
 await volume.press('ArrowRight');await expect(page.getByTestId('volume-value')).toHaveText('5 %');
 await volume.press('End');await expect(page.getByTestId('volume-value')).toHaveText('100 %');
 await page.getByTestId('close-dialog').click();await page.reload();await page.getByTestId('settings-button').click();
 await expect(page.getByTestId('text-scale')).toHaveValue('1.25');await expect(page.getByTestId('reduced-motion')).toBeChecked();
 await page.getByRole('tab',{name:'Sonido',exact:true}).click();await expect(page.getByTestId('volume-value')).toHaveText('100 %');
 await page.getByRole('tab',{name:'Partida',exact:true}).click();await page.getByTestId('restore-settings').click();await expect(page.getByTestId('text-scale')).toHaveValue(String(defaultSettings.textScale));await expect(page.getByTestId('reduced-motion')).not.toBeChecked();
 await page.getByRole('tab',{name:'Sonido',exact:true}).click();await expect(page.getByTestId('volume-value')).toHaveText(`${Math.round(defaultSettings.volume*100)} %`);
});

for (const viewport of [{width:1440,height:900},{width:1366,height:768},{width:390,height:844}]) {
 for (const scale of ['1','2']) {
  test(`settings controls fit ${viewport.width}x${viewport.height} with text scale ${scale}`,async({page})=>{
   await mkdir(evidence,{recursive:true});await page.setViewportSize(viewport);
   await page.goto('./');await page.waitForFunction(()=>window.__THEGAME_READY__);
   await page.getByTestId('settings-button').click();
   await page.getByRole('combobox',{name:'Tamaño de texto',exact:true}).selectOption(scale);
   await page.getByRole('switch',{name:'Reducir movimiento',exact:true}).check();
    const tabBounds=await page.getByRole('tablist').boundingBox();
    for (const tab of await page.getByRole('tab').all()) {
     const fit=await tab.evaluate(element=>{
      const bounds=element.getBoundingClientRect(),text=document.createRange();text.selectNodeContents(element);
      const label=text.getBoundingClientRect();return {left:bounds.left,right:bounds.right,labelLeft:label.left,labelRight:label.right};
     });
     expect(fit.left).toBeGreaterThanOrEqual(tabBounds!.x);expect(fit.right).toBeLessThanOrEqual(tabBounds!.x+tabBounds!.width+1);
     expect(fit.labelLeft).toBeGreaterThanOrEqual(fit.left);expect(fit.labelRight).toBeLessThanOrEqual(fit.right);
    }
   for (const tab of ['Pantalla','Sonido']) {
    await page.getByRole('tab',{name:tab,exact:true}).click();
    const panel=page.getByRole('tabpanel');
    const controls=panel.locator('input,select');
    for (const control of await controls.all()) {
     await control.scrollIntoViewIfNeeded();
     const bounds=await control.boundingBox();expect(bounds).not.toBeNull();
     expect(bounds!.x).toBeGreaterThanOrEqual(0);expect(bounds!.x+bounds!.width).toBeLessThanOrEqual(viewport.width);
     expect(bounds!.y).toBeGreaterThanOrEqual(0);expect(bounds!.y+bounds!.height).toBeLessThanOrEqual(viewport.height);
     expect(bounds!.height).toBeGreaterThanOrEqual(44);expect(bounds!.width).toBeGreaterThanOrEqual(44);
    }
    for (const row of await panel.locator('.setting-row').all()) {
     const label=(await row.locator('.setting-label').boundingBox())!;
     const control=(await row.locator('.setting-select,.setting-switch,.setting-volume-control').boundingBox())!;
     expect(Math.max(control.x-label.x-label.width,control.y-label.y-label.height)).toBeGreaterThanOrEqual(4);
    }
    const fit=await page.locator('.settings-modal .modal-body').evaluate(element=>({width:element.clientWidth,scrollWidth:element.scrollWidth}));
    expect(fit.scrollWidth).toBeLessThanOrEqual(fit.width+1);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport.width);
    if(tab==='Sonido') {
     await page.getByRole('slider',{name:'Volumen',exact:true}).fill('0.65');
     await expect(page.getByTestId('volume-value')).toHaveText('65 %');
    }
    await page.locator('.settings-modal .modal-body').evaluate(element=>{element.scrollTop=0;});
    await page.screenshot({path:`${evidence}/settings-${tab==='Pantalla'?'display':'sound'}-${viewport.width}-${scale}.png`,fullPage:true});
   }
   await page.getByTestId('close-dialog').click();await expect(page.getByTestId('settings-button')).toBeFocused();
  });
 }
}

test('clear language, settings tabs and tutorial replay preserve campaign progress',async({page})=>{
 await mkdir(evidence,{recursive:true});await page.goto('./');await page.waitForFunction(()=>window.__THEGAME_READY__);
 await expect(page.getByRole('navigation',{name:'Menú principal'})).toContainText('Opciones');await expect(page.locator('.menu-copy h1')).not.toContainText('.');
 await page.getByTestId('settings-button').click();await page.getByTestId('reduced-motion').check();
 await page.getByRole('tab',{name:'Sonido',exact:true}).click();await page.getByTestId('volume').fill('0');
 await expect(page.getByRole('tab',{name:'Controles',exact:true})).toHaveCount(0);await expect(page.locator('[data-testid^="bind-"]')).toHaveCount(0);
 await page.screenshot({path:`${evidence}/settings.png`});await page.getByTestId('close-dialog').click();
 await page.getByTestId('new-game').click();await completeIntro(page);await page.getByTestId('enter-urns').click();
 await page.getByTestId('toggle-cards').click();await expect(page.getByTestId('demo-urn-0')).toContainText('Urna 1');
 await expect(page.getByTestId('toggle-cards')).toHaveText('Ocultar urnas');
 await page.getByTestId('demo-urn-0').click();await page.getByTestId('tutorial-next').click();await page.getByTestId('tutorial-next').click();
 await page.getByTestId('toggle-cards').click();await page.getByTestId('demo-urn-1').click();await page.getByTestId('tutorial-next').click();
 await expect(page.getByRole('navigation',{name:'Páginas de las cuentas'})).toBeVisible();
 await page.getByTestId('tutorial-help-next').click();await expect(page.locator('[data-tutorial-help-page]:visible')).toContainText('Urna 1 · ahora');
 await page.getByTestId('tutorial-help-previous').click();await expect(page.locator('[data-tutorial-help-page]:visible')).toContainText('Urna 1 · antes');
 await page.getByTestId('tutorial-next').click();
 await page.getByTestId('toggle-cards').click();await page.getByTestId('urn-1').click();await page.getByTestId('confirm-choice').click();
 const before=await page.evaluate(()=>localStorage.getItem('thegame.save.v1.current'));
 await page.getByRole('button',{name:'Repasar el tema y ver un video'}).click();
 await expect(page.locator('.learning-topics a')).toHaveAttribute('href',/khanacademy.*basic-probability/);await page.getByTestId('close-dialog').click();
 expect(await page.evaluate(()=>localStorage.getItem('thegame.save.v1.current'))).toBe(before);
 await page.reload();await expect(page.getByTestId('continue-game')).toContainText('Reanudar partida');
});

test('capture all primary screens and report viewport fit at desktop and mobile sizes',async({browser,baseURL})=>{
 test.setTimeout(180000);
 await mkdir(evidence,{recursive:true});
 const reports:unknown[]=[];
 for(const [width,height] of [[1366,768],[1440,900],[390,844]]){
  for(const mode of ['menu','tutorial','urns','contracts','records']){
   const page=await browser.newPage({baseURL,viewport:{width:width!,height:height!}});
   const s=createGame(8);s.settings.reducedMotion=true;s.settings.volume=0;
   if(mode==='contracts'||mode==='records'){
    for(let i=0;i<35&&s.phase!=='complete';i++)Object.assign(s,['choose','guided'].includes(s.phase)?choose(s,bestChoices(s)[0] as 0|1):advance(s));
    s.seals={urns:true,contracts:true};
    if(mode==='contracts'){s.contracts=createContracts(1);s.activeTable='contracts';}
    else {s.records=createRecords(1);s.activeTable='records';}
   }
   await page.addInitScript(raw=>localStorage.setItem('thegame.save.v1.current',raw),JSON.stringify({schemaVersion:5,contentVersion:'campaign-challenge-v5',state:s}));
   await page.goto('./');await page.waitForFunction(()=>window.__THEGAME_READY__);
   if(mode==='tutorial'||mode==='urns'){
    await page.getByTestId('new-game').click();await completeIntro(page);await page.getByTestId('enter-urns').click();
    if(mode==='urns')await page.getByTestId('skip-tutorial').click();await page.getByTestId('toggle-cards').click();
   }else if(mode!=='menu'){
    await page.getByTestId('continue-game').click();if(mode==='contracts')await page.getByTestId('doble-begin').click();
   }
   await page.waitForTimeout(500);
   const fit=await page.evaluate(()=>({width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight,panels:[...document.querySelectorAll('.game-panel')].map(el=>({height:el.clientHeight,scroll:el.scrollHeight}))}));
   reports.push({mode,width,height,...fit});expect(fit.scrollWidth).toBeLessThanOrEqual(width!);
   await page.screenshot({path:`${evidence}/${mode}-${width}.png`,fullPage:true});await page.close();
  }
 }
 console.log(JSON.stringify(reports));
});

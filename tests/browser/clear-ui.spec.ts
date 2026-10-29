import {test,expect} from '@playwright/test';
import {mkdir} from 'node:fs/promises';
import {createGame,choose,advance,bestChoices} from '../../src/core/game';
import {createContracts} from '../../src/core/tables/contracts';
import {createRecords} from '../../src/core/tables/records';

const evidence='.tools/clear-ui';
test('clear language, settings tabs and tutorial replay preserve campaign progress',async({page})=>{
 await mkdir(evidence,{recursive:true});await page.goto('./');await page.waitForFunction(()=>window.__THEGAME_READY__);
 await expect(page.locator('.topbar')).toHaveText('Ajustes');await expect(page.locator('.menu-copy h1')).not.toContainText('.');
 await page.getByTestId('settings-button').click();await page.getByTestId('reduced-motion').check();
 await page.getByRole('tab',{name:'Sonido',exact:true}).click();await page.getByTestId('volume').fill('0');
 await page.getByRole('tab',{name:'Controles',exact:true}).click();await expect(page.getByTestId('bind-urn-u')).toBeVisible();
 await page.screenshot({path:`${evidence}/settings.png`});await page.getByTestId('close-dialog').click();
 await page.getByTestId('new-game').click();await page.getByTestId('skip-intro').click();await page.getByTestId('enter-urns').click();
 await page.getByTestId('toggle-cards').click();await expect(page.getByTestId('demo-urn-0')).toContainText('Urna 1');
 await expect(page.getByTestId('toggle-cards')).toContainText('tarjetas');
 await page.getByTestId('demo-urn-0').click();await page.getByTestId('tutorial-next').click();await page.getByTestId('tutorial-next').click();
 await page.getByTestId('toggle-cards').click();await page.getByTestId('demo-urn-1').click();await page.getByTestId('tutorial-next').click();
 await expect(page.getByText('Volver a leer el tutorial', {exact:true})).toBeVisible();await page.getByTestId('tutorial-next').click();
 await page.getByTestId('toggle-cards').click();await page.getByTestId('urn-1').click();await page.getByTestId('confirm-choice').click();
 const before=await page.evaluate(()=>localStorage.getItem('thegame.save.v1.current'));
 await page.getByRole('button',{name:'Repasar el tema y ver un video'}).click();
 await expect(page.locator('.learning-topics a')).toHaveAttribute('href',/khanacademy.*basic-probability/);await page.getByTestId('close-dialog').click();
 expect(await page.evaluate(()=>localStorage.getItem('thegame.save.v1.current'))).toBe(before);
 await page.reload();await expect(page.getByTestId('continue-game')).toContainText('Reanudar partida');
});

test('capture all primary screens and report viewport fit at desktop and mobile sizes',async({browser})=>{
 await mkdir(evidence,{recursive:true});
 const reports:unknown[]=[];
 for(const [width,height] of [[1366,768],[1440,900],[390,844]]){
  for(const mode of ['menu','tutorial','urns','contracts','records']){
   const page=await browser.newPage({viewport:{width:width!,height:height!}});
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
    await page.getByTestId('new-game').click();await page.getByTestId('skip-intro').click();await page.getByTestId('enter-urns').click();
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

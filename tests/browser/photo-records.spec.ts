import {test,expect} from '@playwright/test';
import {mkdir} from 'node:fs/promises';
import {createGame,choose,advance,bestChoices} from '../../src/core/game';
import {createContracts,applyContractCommand,currentObjective} from '../../src/core/tables/contracts';
import {bestContracts} from '../../src/core/math/dice';
import {createRecords} from '../../src/core/tables/records';
const evidence=process.env.EVIDENCE_DIR??'.tools/photo-records';
for(const answer of ['yes','no'])test(`initial ${answer} is unscored, survives reload, then reveals missing photos`,async({page})=>{
 const s=createGame(7);s.settings.volume=0;s.settings.reducedMotion=true;
 for(let i=0;i<35&&s.phase!=='complete';i++)Object.assign(s,['choose','guided'].includes(s.phase)?choose(s,bestChoices(s)[0] as 0|1):advance(s));
 s.contracts=createContracts(4);for(let i=0;i<40&&s.contracts.phase!=='complete';i++){const c=s.contracts;s.contracts=applyContractCommand(c,{type:c.phase==='tutorial'?'begin':['offer','order'].includes(c.phase)?'sign':'next',contract:bestContracts(currentObjective(c))[0],commandId:'c'+c.revision,expectedRevision:c.revision});}
 s.records=createRecords(1,false,answer==='yes'?'photos-v2':'photos-v1');s.activeTable='records';s.seals={urns:true,contracts:true};
 await page.addInitScript(raw=>{if(!sessionStorage.getItem('loaded')){localStorage.setItem('thegame.save.v1.current',raw);sessionStorage.setItem('loaded','yes');}},JSON.stringify({schemaVersion:3,contentVersion:'campaign-v3',state:s}));
 await page.goto('./');await page.waitForFunction(()=>window.__THEGAME_READY__);await page.getByTestId('continue-game').click();await expect(page.getByTestId('records-begin')).toHaveCount(0);
 await page.getByTestId('records-diagnostic-'+answer).click();await expect(page.getByTestId('records-diagnostic-feedback')).toContainText('La respuesta es No');
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('thegame.save.v1.current')!).state.records);expect(saved.diagnostic).toBe(answer);expect(saved.merit).toBe(0);expect(saved.history).toHaveLength(0);expect(saved.rng.count).toBe(0);
 await page.reload();await page.getByTestId('continue-game').click();await expect(page.getByTestId('records-diagnostic-feedback')).toContainText(answer==='yes'?'Elegiste Sí':'Elegiste No');
 await mkdir(evidence,{recursive:true});await page.screenshot({path:`${evidence}/diagnostic-${answer}.png`});
 await page.getByTestId('records-begin').click();await page.getByTestId('records-archive').click();await page.getByTestId('records-confirm').click();await expect(page.locator('.photo-lost')).toHaveCount(4);await expect(page.getByTestId('records-feedback')).toContainText('Faltaban las derrotas');await page.screenshot({path:`${evidence}/all-photos-${answer}.png`});
 if(answer==='no'){
  await page.getByTestId('records-next').click();await page.getByTestId('records-close').click();await page.getByTestId('records-confirm').click();await page.getByTestId('records-next').click();
  for(let i=0;i<2;i++){await page.getByTestId('records-no').click();await page.getByTestId('records-confirm').click();await page.getByTestId('records-next').click();}
  const ids=await page.locator('.result-photo small').allTextContents();expect(ids).toEqual(['Partida 1','Partida 4','Partida 6','Partida 8']);
  await page.getByTestId('records-archive').click();await page.getByTestId('records-confirm').click();expect(await page.locator('.photo-won small').allTextContents()).toEqual(ids);
 }
 if(answer==='yes'){await page.setViewportSize({width:390,height:844});await page.getByTestId('settings-button').click();await page.getByTestId('text-scale').selectOption('2');await page.getByTestId('close-dialog').click();expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);await page.screenshot({path:`${evidence}/photos-narrow-200.png`,fullPage:true});}
});

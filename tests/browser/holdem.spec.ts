import {test,expect} from '@playwright/test';
import {mkdir} from 'node:fs/promises';
import {createGame} from '../../src/core/game';
import {createRecords,applyRecordsCommand} from '../../src/core/tables/records';
import {choosePrediction} from '../../src/core/tables/holdem';
for(const [width,height,scale] of [[1280,720,1],[1024,640,1],[390,844,1],[1280,720,2],[1024,640,2]])test(`Ada holdem ${width}x${height} text ${scale}: hidden cards, prediction, reveal and reload`,async({page})=>{
 test.setTimeout(120000);await page.setViewportSize({width:width!,height:height!});const s=createGame(77);s.seals={urns:true,contracts:true};s.records=createRecords(123);s.activeTable='records';s.settings.reducedMotion=true;s.settings.volume=0;s.settings.textScale=scale!;
 await page.addInitScript(s=>{if(!localStorage.getItem('thegame.save.v1.current'))localStorage.setItem('thegame.save.v1.current',JSON.stringify({schemaVersion:7,contentVersion:'campaign-holdem-v7',state:s}));},s);
 await page.goto('./');await page.getByTestId('continue-game').click();await expect(page.getByTestId('records-begin')).toBeVisible();await page.getByTestId('records-begin').click();
 await expect(page.getByTestId('player-cards').getByRole('img')).toHaveCount(2);await expect(page.getByTestId('opponent-cards').getByLabel('Carta boca abajo',{exact:true})).toHaveCount(2);await expect(page.getByTestId('community-cards').getByLabel('Carta boca abajo',{exact:true})).toHaveCount(1);
 const choice=choosePrediction(s.records!.holdem!.player,s.records!.holdem!.board);await page.getByTestId('records-'+choice).click();await page.getByTestId('records-confirm').click();await expect(page.getByTestId('records-feedback')).toBeVisible();await expect(page.getByTestId('opponent-cards').getByLabel('Carta boca abajo',{exact:true})).toHaveCount(0);
 const before=await page.evaluate(()=>JSON.parse(localStorage.getItem('thegame.save.v1.current')!).state.records);await page.reload();await page.getByTestId('continue-game').click();expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('thegame.save.v1.current')!).state.records)).toEqual(before);
 await page.getByTestId('records-next').click();await expect(page.getByTestId('records-confirm')).toBeVisible();
 if(width!>=1000){expect(await page.locator('main button, .holdem-felt .poker-card').evaluateAll(es=>es.filter(e=>e.checkVisibility()).filter(e=>e.getBoundingClientRect().bottom>innerHeight+1).map(e=>e.textContent))).toEqual([]);expect(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight+1)).toBe(true);}
 await mkdir('docs/evidence/ada-holdem',{recursive:true});await page.screenshot({path:`docs/evidence/ada-holdem/table-${width}-${scale}.png`});
 await page.getByRole('button',{name:/Manos y reglas/}).click();await expect(page.getByRole('dialog')).toBeVisible();await page.getByTestId('close-dialog').click();
});
test('Ada help remains finite and retains earned points and seals',async({page})=>{
 const s=createGame(7);s.seals={urns:true,contracts:true};let r=createRecords(10);r=applyRecordsCommand(r,{type:'begin',commandId:'begin',expectedRevision:0});
 for(let i=0;i<23;i++){r=applyRecordsCommand(r,{type:'choose',choice:'straight-flush',commandId:'choose'+i,expectedRevision:r.revision});r=applyRecordsCommand(r,{type:'next',commandId:'next'+i,expectedRevision:r.revision});}
 s.records=r;s.activeTable='records';s.settings.reducedMotion=true;
 await page.addInitScript(s=>localStorage.setItem('thegame.save.v1.current',JSON.stringify({schemaVersion:7,contentVersion:'campaign-holdem-v7',state:s})),s);await page.goto('./');await page.getByTestId('continue-game').click();await page.getByTestId('records-assist').click();await expect(page.getByTestId('records-completion')).toContainText('sin añadir puntos');
});

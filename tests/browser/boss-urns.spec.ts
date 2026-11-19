import {test,expect,type Page} from '@playwright/test';
import {mkdir} from 'node:fs/promises';
import {createGame} from '../../src/core/game';
import {createFinale,type FinaleState} from '../../src/core/tables/finale';
const evidence=process.env.EVIDENCE_DIR??'docs/evidence/boss-urns';
async function open(page:Page,boss=true,scale=1,experience:FinaleState['experience']='boss-v1'){
 const state=createGame(3);state.settings.reducedMotion=true;state.settings.volume=0;state.settings.textScale=scale;
 if(boss){state.seals={urns:true,contracts:true,records:true};state.finale=createFinale(3,experience);state.activeTable='finale';}
 else {state.activeTable='urns';}
 await page.addInitScript(state=>{if(!localStorage.getItem('thegame.save.v1.current'))localStorage.setItem('thegame.save.v1.current',JSON.stringify({schemaVersion:8,contentVersion:'campaign-boss-v8',state}));},state);
 await page.goto('./');await page.waitForFunction(()=>typeof window.__THEGAME_METRICS__==='function');await page.getByTestId('continue-game').click();if(boss)await page.getByTestId('finale-begin').click();
}
async function metrics(page:Page){return page.evaluate(()=>window.__THEGAME_METRICS__!() as {visibleUrnVessels:number;visibleUrnTokens:number;selectedUrn:number|null;highlightedUrnMeshes:number;urnTargets:{x:number;y:number}[]});}
async function fits(page:Page){if(page.viewportSize()!.width<1000)return;expect(await page.locator('main button,main progress').evaluateAll(es=>es.filter(e=>e.checkVisibility()).filter(e=>{const r=e.getBoundingClientRect();return r.top<0||r.bottom>innerHeight+1||r.left<0||r.right>innerWidth+1;}).map(e=>e.textContent))).toEqual([]);}
for(const [width,height,scale] of [[1280,720,1],[1024,640,2],[390,844,1]])test(`boss uses Vera glass urns and tickets ${width}x${height} text ${scale}`,async({page})=>{
 test.setTimeout(90000);await page.setViewportSize({width:width!,height:height!});await open(page,true,scale);
 expect((await metrics(page)).visibleUrnVessels).toBe(2);expect((await metrics(page)).visibleUrnTokens).toBe(11);
 await expect(page.getByTestId('finale-U')).toHaveClass(/urn-option/);await expect(page.getByTestId('finale-V')).toContainText('Urna 2');await fits(page);
 const before=await page.evaluate(()=>JSON.parse(localStorage.getItem('thegame.save.v1.current')!).state.finale);
 if(width!>=1000){const m=await metrics(page),rect=await page.locator('.ada-viewport canvas').boundingBox();await page.mouse.click(rect!.x+m.urnTargets[0]!.x*rect!.width,rect!.y+m.urnTargets[0]!.y*rect!.height);}
 else await page.getByTestId('finale-U').click();
 await expect(page.getByTestId('finale-U')).toHaveAttribute('aria-pressed','true');expect((await metrics(page)).selectedUrn).toBe(0);expect((await metrics(page)).highlightedUrnMeshes).toBeGreaterThan(0);
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('thegame.save.v1.current')!).state.finale.rng)).toEqual(before.rng);
 await page.getByTestId('finale-confirm').click();await expect(page.getByTestId('finale-feedback')).toBeVisible();expect((await metrics(page)).visibleUrnTokens).toBe(10);await fits(page);
 await page.getByTestId('finale-next').click();expect((await metrics(page)).visibleUrnTokens).toBe(10);await fits(page);
 await mkdir(evidence,{recursive:true});await page.screenshot({path:`${evidence}/boss-urns-${width}-${scale}.png`});
});
test('Vera still uses the same urns and shared controls',async({page})=>{
 await open(page,false);await page.getByTestId('toggle-cards').click();await expect(page.getByTestId('urn-0')).toHaveClass(/urn-option/);await expect(page.getByTestId('urn-1')).toContainText('Urna 2');
 await page.getByTestId('urn-0').click();expect((await metrics(page)).visibleUrnVessels).toBe(2);expect((await metrics(page)).selectedUrn).toBe(0);
 await page.getByTestId('confirm-choice').click();await expect(page.getByTestId('next-step')).toBeVisible();expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('thegame.save.v1.current')!).state.phase)).toBe('revealed');
});
test('the new boss shows both close inventories and keeps the second draw after reload',async({page})=>{
 await page.setViewportSize({width:1280,height:720});
 await open(page,true,1,'boss-v3');
 await expect(page.getByTestId('finale-U')).toContainText('4 rojas');
 const right=page.getByTestId('finale-V');
 await expect(right).toContainText('3 rojas');
 await expect(right).not.toContainText('%');
 expect((await metrics(page)).visibleUrnTokens).toBe(12);
 const position=(await metrics(page)).urnTargets[1]!;
 const rect=(await page.locator('.ada-viewport canvas').boundingBox())!;
 await page.mouse.click(rect.x+position.x*rect.width,rect.y+position.y*rect.height);
 await expect(right).toHaveAttribute('aria-pressed','true');
 await page.getByTestId('finale-confirm').click();
 await expect(page.getByTestId('finale-feedback')).toContainText('Salió roja');
 await page.getByTestId('finale-next').click();
 await page.reload();
 await page.getByTestId('continue-game').click();
 await expect(right).toContainText('2 rojas');
 await page.getByTestId('finale-U').click();
 await page.getByTestId('finale-confirm').click();
 await expect(page.getByTestId('boss-health')).toHaveText('32/36');
 await fits(page);
});

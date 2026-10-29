import { expect, test, type Page } from '@playwright/test';
import { createGame, choose, advance, type GameState } from '../../src/core/game';
import { mkdir } from 'node:fs/promises';

const evidence = process.env.EVIDENCE_DIR ?? 'docs/evidence/urn-feedback';
async function load(page: Page, state?: GameState) {
  if(state) await page.addInitScript(raw => localStorage.setItem('thegame.save.v1.current', raw), JSON.stringify({schemaVersion:1,contentVersion:'urns-mvp-v1',state}));
  await page.goto('./');
  await page.waitForFunction(() => window.__THEGAME_READY__);
  if(state) await page.getByTestId('continue-game').click();
  else {
    await page.getByTestId('new-game').click();
    await page.getByTestId('skip-intro').click();
    await page.getByTestId('enter-urns').click();
    await page.getByTestId('skip-tutorial').click();
  }
}
function fixture(color: 'red' | 'blue') {
  for(let seed=1;seed<10000;seed++) {
    const state=createGame(seed);
    if(choose(state,0).last!.color===color) return state;
  }
  throw Error('No fixture');
}
test('cards start hidden; card and real canvas urn share one glowing selection', async ({page}) => {
  const errors: string[]=[]; page.on('pageerror', e=>errors.push(e.message));
  await mkdir(evidence,{recursive:true});
  await load(page);
  await expect(page.getByRole('heading',{name:'Las urnas',exact:true})).toBeVisible();
  await expect(page.getByTestId('urn-0')).toBeHidden();
  await page.getByTestId('toggle-cards').click();
  await page.getByTestId('urn-0').click();
  await expect(page.locator('.answer-correct,.answer-incorrect')).toHaveCount(0);
  await expect(page.getByTestId('urn-0')).toHaveAttribute('aria-pressed','true');
  expect(await page.evaluate(()=>(window.__THEGAME_METRICS__!() as {selectedUrn:number}).selectedUrn)).toBe(0);
  await page.waitForTimeout(1500);
  await page.screenshot({path:`${evidence}/selected.png`});
  await page.getByTestId('toggle-cards').click();
  await expect(page.getByTestId('urn-0')).toBeHidden();
  expect(await page.evaluate(()=>(window.__THEGAME_METRICS__!() as {selectedUrn:number}).selectedUrn)).toBe(0);
  const target=await page.evaluate(()=>(window.__THEGAME_METRICS__!() as {urnTargets:{x:number;y:number}[]}).urnTargets[1]!);
  const canvas=(await page.locator('#scene').boundingBox())!;
  await page.mouse.click(canvas.x+target.x*canvas.width,canvas.y+target.y*canvas.height);
  await expect(page.getByTestId('urn-1')).toHaveAttribute('aria-pressed','true');
  await expect(page.getByTestId('urn-0')).toHaveAttribute('aria-pressed','false');
  expect(await page.evaluate(()=>(window.__THEGAME_METRICS__!() as {selectedUrn:number}).selectedUrn)).toBe(1);
  await page.getByTestId('confirm-choice').click();
  await expect(page.getByTestId('urn-0')).toHaveClass(/answer-correct/);
  await expect(page.getByTestId('urn-1')).toHaveClass(/answer-incorrect/);
  await expect(page.getByTestId('urn-1')).toContainText('Tu elección');
  await page.screenshot({path:`${evidence}/incorrect.png`});
  await page.setViewportSize({width:390,height:844});
  await page.screenshot({path:`${evidence}/incorrect-narrow.png`,fullPage:true});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await page.setViewportSize({width:1440,height:900});
  await page.reload();await page.getByTestId('continue-game').click();
  await expect(page.getByTestId('urn-1')).toHaveClass(/answer-incorrect/);
  await page.getByTestId('next-step').click();
  await expect(page.getByTestId('urn-0')).toBeHidden();
  expect(errors).toEqual([]);
});
test('equal chances make both cards correct, using the counts before extraction', async ({page}) => {
  await load(page,advance(choose(fixture('red'),0)));
  await page.getByTestId('toggle-cards').click();
  await page.getByTestId('urn-1').click();
  await page.getByTestId('confirm-choice').click();
  await expect(page.locator('.answer-correct')).toHaveCount(2);
  await expect(page.locator('.answer-incorrect')).toHaveCount(0);
  await expect(page.getByTestId('result-feedback')).toContainText('Las dos urnas');
  await expect(page.getByTestId('urn-1')).toContainText('1 de 2');
});
test('a correct choice stays green when luck draws the other color', async ({page}) => {
  await load(page,fixture('blue'));
  await page.getByTestId('toggle-cards').click();await page.getByTestId('urn-0').click();
  await expect(page.getByTestId('urn-0')).toHaveAttribute('aria-pressed','true');
  await page.getByTestId('confirm-choice').click();
  await expect(page.getByTestId('urn-0')).toHaveClass(/answer-correct/);
  await expect(page.getByTestId('result-feedback')).toContainText('aunque elijas bien');
  await expect(page.getByTestId('urn-0')).toContainText('3 de 5');
  await page.screenshot({path:`${evidence}/correct-unlucky.png`});
});

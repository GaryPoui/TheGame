import {test,expect} from '@playwright/test';
import {mkdir} from 'node:fs/promises';
const evidence=process.env.EVIDENCE_DIR??'.tools/table-tutorial';
test('Vera guides a normal table through two prepared draws without changing the campaign',async({page})=>{
 await mkdir(evidence,{recursive:true});await page.goto('./');await page.waitForFunction(()=>window.__THEGAME_READY__);
 await page.getByTestId('settings-button').click();await page.getByTestId('reduced-motion').check();await page.getByTestId('volume').fill('0');await page.getByTestId('close-dialog').click();
 await page.getByTestId('new-game').click();await page.getByTestId('skip-intro').click();await page.getByTestId('enter-urns').click();
 const before=await page.evaluate(()=>localStorage.getItem('thegame.save.v1.current'));
 await expect(page.locator('aside img')).toHaveCount(0);await expect(page.getByTestId('demo-urn-0')).toBeHidden();
 await page.getByTestId('toggle-cards').click();await page.getByTestId('demo-urn-1').click();await expect(page.getByTestId('tutorial-next')).toBeDisabled();
 await page.waitForTimeout(1000);const target=await page.evaluate(()=>(window.__THEGAME_METRICS__!() as {urnTargets:{x:number;y:number}[]}).urnTargets[0]!);const canvas=(await page.locator('#scene').boundingBox())!;
 await page.mouse.click(canvas.x+target.x*canvas.width,canvas.y+target.y*canvas.height);await expect(page.getByTestId('demo-urn-0')).toHaveAttribute('aria-pressed','true');await expect(page.getByTestId('tutorial-next')).toBeEnabled();
 await page.screenshot({path:`${evidence}/tutorial-choice.png`});await page.getByTestId('tutorial-next').click();await expect(page.getByTestId('demo-urn-0')).toHaveClass(/answer-correct/);await expect(page.getByTestId('demo-urn-1')).toHaveClass(/answer-incorrect/);
 await expect(page.locator('.tutorial-coach')).toContainText('dos rojas de cuatro');await page.getByTestId('tutorial-next').click();await page.keyboard.press('KeyD');await expect(page.getByTestId('demo-urn-1')).toHaveAttribute('aria-pressed','true');await page.keyboard.press('KeyE');
 await expect(page.locator('.answer-correct')).toHaveCount(2);await expect(page.locator('.result-card')).toContainText('azul');await page.screenshot({path:`${evidence}/tutorial-second-draw.png`});
 await page.getByTestId('tutorial-next').click();await expect(page.locator('body')).toHaveAttribute('data-screen','table');await expect(page.getByTestId('urn-0')).toBeHidden();expect(await page.evaluate(()=>localStorage.getItem('thegame.save.v1.current'))).toBe(before);
});

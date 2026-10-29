import {test,expect} from '@playwright/test';
import {mkdir} from 'node:fs/promises';
const evidence=process.env.EVIDENCE_DIR??'docs/evidence/campaign';
test('dialogue resumes its checkpoint, replays without rewards, and releases control',async({page})=>{
 await page.goto('./');await page.waitForFunction(()=>window.__THEGAME_READY__);await page.getByTestId('new-game').click();
 await expect(page.getByTestId('intro-next')).toBeEnabled();await page.getByTestId('intro-next').click();await page.reload();await page.getByTestId('continue-game').click();
 await expect(page.getByTestId('intro-next')).toBeEnabled();await expect(page.locator('body')).toHaveAttribute('data-camera-mode','dialogue');
 const before=await page.evaluate(()=>localStorage.getItem('thegame.save.v1.current'));await page.getByTestId('intro-history').click();await expect(page.locator('dialog')).toContainText('grilletes');await page.getByTestId('close-dialog').click();expect(await page.evaluate(()=>localStorage.getItem('thegame.save.v1.current'))).toBe(before);
 await page.getByTestId('intro-next').click();await page.getByTestId('intro-next').click();await expect(page.locator('body')).toHaveAttribute('data-camera-mode','exploration');
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('thegame.save.v1.current')!).state.intro.effects)).toEqual(['released']);
 await page.reload();await page.getByTestId('continue-game').click();await expect(page.locator('body')).toHaveAttribute('data-screen','room');
});
test('room uses mouse selection without walking or remapping controls',async({page})=>{
 await page.goto('./');await page.getByTestId('new-game').click();await page.getByTestId('skip-intro').click();
 await expect(page.locator('.room-walk')).toHaveCount(0);
 const before=await page.evaluate(()=>localStorage.getItem('thegame.save.v1.current'));
 await page.keyboard.press('KeyW');await page.keyboard.press('KeyD');expect(await page.evaluate(()=>localStorage.getItem('thegame.save.v1.current'))).toBe(before);
 await page.getByTestId('settings-button').click();await expect(page.getByRole('tab',{name:'Controles',exact:true})).toHaveCount(0);await expect(page.locator('[data-testid^="bind-"]')).toHaveCount(0);await page.getByTestId('close-dialog').click();
 await page.getByTestId('enter-urns').click();await page.getByTestId('skip-tutorial').click();await page.getByRole('button',{name:/Ayuda y opciones/}).click();await page.getByTestId('back-room').click();
 await expect(page.locator('body')).toHaveAttribute('data-screen','room');await expect(page.getByTestId('enter-finale')).toHaveAttribute('aria-disabled','true');
});
test('optional street memory uses limited steps and returns to the dark opening',async({page})=>{
 await mkdir(evidence,{recursive:true});await page.goto('./');await page.getByTestId('new-game').click();await expect(page.getByTestId('remember-street')).toBeVisible();await page.getByTestId('remember-street').click();
 for(let i=0;i<8;i++)await page.getByTestId('street-forward').click();await expect(page.getByTestId('street-forward')).toBeDisabled();await page.screenshot({path:`${evidence}/street-memory.png`});await page.getByTestId('street-return').click();await expect(page.locator('body')).toHaveAttribute('data-intro-phase','dark');await page.getByTestId('skip-intro').click();await expect(page.getByTestId('enter-urns')).toBeEnabled();
});
test('a lost WebGL context leaves the table controls and committed result usable',async({page})=>{
 await page.goto('./');await page.waitForFunction(()=>window.__THEGAME_READY__);await page.getByTestId('new-game').click();await page.getByTestId('skip-intro').click();await page.getByTestId('enter-urns').click();await page.getByTestId('skip-tutorial').click();
 const supported=await page.evaluate(()=>{const gl=document.querySelector<HTMLCanvasElement>('#scene')!.getContext('webgl2');const ext=gl?.getExtension('WEBGL_lose_context');(window as unknown as {loss:WEBGL_lose_context|null}).loss=ext??null;ext?.loseContext();return !!ext;});
 expect(supported).toBe(true);await expect(page.locator('.graphics-warning')).toContainText('Se interrumpió');await page.getByTestId('toggle-cards').click();await page.getByTestId('urn-0').click();await page.getByTestId('confirm-choice').click();await expect(page.getByTestId('result-feedback')).toBeVisible();
 await page.evaluate(()=>(window as unknown as {loss:WEBGL_lose_context}).loss.restoreContext());await expect(page.locator('.graphics-warning')).toHaveCount(0);
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('thegame.save.v1.current')!).state.history.length)).toBe(1);
});

import {test,expect,type Page} from '@playwright/test';
import {mkdir} from 'node:fs/promises';
import {completeIntro} from './story-navigation';
const evidence=process.env.EVIDENCE_DIR??'.tools/table-tutorial';
async function expectTutorialFits(page:Page):Promise<void>{
 const fit=await page.locator('.tutorial-table').evaluate(root=>{
  const footer=root.querySelector('.tutorial-footer')!.getBoundingClientRect();
  const elements=[root,...root.querySelectorAll<HTMLElement>('.tutorial-heading,.tutorial-workspace,.tutorial-help,.tutorial-reading,.tutorial-controls,.game-panel,.tutorial-footer,[data-tutorial-help-page],button')].filter(element=>element.getClientRects().length);
  return {width:innerWidth,height:innerHeight,pageWidth:document.documentElement.scrollWidth,pageHeight:document.documentElement.scrollHeight,elements:elements.map(element=>{const rect=element.getBoundingClientRect();return {name:element.className||element.getAttribute('data-testid'),width:element.clientWidth,scrollWidth:element.scrollWidth,height:element.clientHeight,scrollHeight:element.scrollHeight,left:rect.left,top:rect.top,right:rect.right,bottom:rect.bottom,aboveFooter:element.matches('.tutorial-controls,.tutorial-workspace')?rect.bottom<=footer.top:true};})};
 });
 expect(fit.pageHeight).toBeLessThanOrEqual(fit.height);expect(fit.pageWidth).toBeLessThanOrEqual(fit.width);
 for(const element of fit.elements){
  expect(element.scrollWidth,JSON.stringify(element)).toBeLessThanOrEqual(element.width+1);
  expect(element.scrollHeight,JSON.stringify(element)).toBeLessThanOrEqual(element.height+1);
  expect(element.left,JSON.stringify(element)).toBeGreaterThanOrEqual(0);expect(element.top,JSON.stringify(element)).toBeGreaterThanOrEqual(0);
  expect(element.right,JSON.stringify(element)).toBeLessThanOrEqual(fit.width+1);expect(element.bottom,JSON.stringify(element)).toBeLessThanOrEqual(fit.height+1);
  expect(element.aboveFooter,JSON.stringify(element)).toBe(true);
 }
}

test('tutorial no-scroll layout at 1366px',async({page})=>{
 await page.setViewportSize({width:1366,height:768});await page.goto('./');await page.waitForFunction(()=>window.__THEGAME_READY__);
 const gold=await page.getByTestId('new-game').evaluate(element=>getComputedStyle(element).backgroundColor);
 await page.getByTestId('new-game').click();await completeIntro(page);await page.getByTestId('enter-urns').click();
 await expect(page.getByRole('heading',{name:'Tutorial',exact:true})).toBeVisible();
 await expect(page.getByTestId('skip-tutorial')).toHaveCSS('background-color',gold);
 await page.getByTestId('toggle-cards').click();await page.getByTestId('demo-urn-0').click();
 await page.getByTestId('tutorial-help-next').focus();await page.keyboard.press('Enter');
 await expect(page.locator('[data-tutorial-help-page]:visible')).toHaveAttribute('data-tutorial-help-page','1');
 await page.getByTestId('tutorial-help-previous').focus();await page.keyboard.press('Enter');
 await expect(page.locator('[data-tutorial-help-page]:visible')).toHaveAttribute('data-tutorial-help-page','0');
 await expect(page.getByTestId('tutorial-help-next')).toBeFocused();
 await expectTutorialFits(page);
});

test('Vera guides a normal table through two prepared draws without changing the campaign',async({page})=>{
 await mkdir(evidence,{recursive:true});await page.goto('./');await page.waitForFunction(()=>window.__THEGAME_READY__);
 await page.getByTestId('settings-button').click();await page.getByTestId('reduced-motion').check();await page.getByRole('tab',{name:'Sonido',exact:true}).click();await page.getByTestId('volume').fill('0');await page.getByTestId('close-dialog').click();
 await page.getByTestId('new-game').click();await completeIntro(page);await page.getByTestId('enter-urns').click();
 const before=await page.evaluate(()=>localStorage.getItem('thegame.save.v1.current'));
 await expect(page.locator('.tutorial-badge')).toContainText('Tutorial');await expect(page.locator('.tutorial-step')).toHaveText('Paso 1 de 4');
 await expect(page.locator('.game-panel [data-testid="skip-tutorial"]')).toHaveCount(0);await expect(page.getByTestId('skip-tutorial')).toBeVisible();
 await expect(page.getByTestId('tutorial-calculation-0')).toContainText('3 ÷ 5 × 100 = 60 %');await expect(page.getByTestId('tutorial-calculation-1')).toContainText('1 ÷ 2 × 100 = 50 %');
 await expect(page.locator('aside img')).toHaveCount(0);await expect(page.getByTestId('demo-urn-0')).toBeHidden();
 await page.getByTestId('toggle-cards').click();await page.getByTestId('demo-urn-1').click();await expect(page.getByTestId('tutorial-next')).toBeDisabled();await expect(page.locator('.tutorial-coach')).toContainText('50 %');await expect(page.locator('.tutorial-coach')).toContainText('60 %');
 await page.waitForTimeout(1000);const target=await page.evaluate(()=>(window.__THEGAME_METRICS__!() as {urnTargets:{x:number;y:number}[]}).urnTargets[0]!);const canvas=(await page.locator('#scene').boundingBox())!;
 await page.mouse.click(canvas.x+target.x*canvas.width,canvas.y+target.y*canvas.height);await expect(page.getByTestId('demo-urn-0')).toHaveAttribute('aria-pressed','true');await expect(page.getByTestId('tutorial-next')).toBeEnabled();
 await page.screenshot({path:`${evidence}/tutorial-choice.png`});await page.getByTestId('tutorial-next').click();await expect(page.getByTestId('demo-urn-0')).toHaveClass(/answer-correct/);await expect(page.getByTestId('demo-urn-1')).toHaveClass(/answer-incorrect/);
 await expect(page.locator('.tutorial-coach')).toContainText('dos rojas de cuatro');await page.getByTestId('tutorial-next').click();await page.getByTestId('toggle-cards').click();await page.getByTestId('demo-urn-1').click();await expect(page.getByTestId('demo-urn-1')).toHaveAttribute('aria-pressed','true');await page.getByTestId('tutorial-next').click();
 await expect(page.getByTestId('tutorial-comparison')).toContainText('50 % = 50 %');
 await expect(page.getByTestId('tutorial-calculation-1')).toContainText('1 ÷ 1 × 100 = 100 %');
 await expect(page.locator('.answer-correct')).toHaveCount(2);await expect(page.locator('.result-card')).toContainText('azul');await page.screenshot({path:`${evidence}/tutorial-second-draw.png`});
 await page.getByTestId('tutorial-next').click();await expect(page.locator('body')).toHaveAttribute('data-screen','table');await expect(page.getByTestId('urn-0')).toBeHidden();expect(await page.evaluate(()=>localStorage.getItem('thegame.save.v1.current'))).toBe(before);
});

for (const choice of [0,1]) {
 test(`equal tutorial chances accept urn ${choice+1} and explain its remaining inventory`,async({page})=>{
  await page.goto('./');await page.waitForFunction(()=>window.__THEGAME_READY__);
  await page.getByTestId('settings-button').click();await page.getByTestId('reduced-motion').check();await page.getByTestId('close-dialog').click();
  await page.getByTestId('new-game').click();await completeIntro(page);await page.getByTestId('enter-urns').click();
  const before=await page.evaluate(()=>localStorage.getItem('thegame.save.v1.current'));
  await page.getByTestId('toggle-cards').click();await page.getByTestId('demo-urn-0').click();await page.getByTestId('tutorial-next').click();
  await expect(page.getByTestId('tutorial-calculation-0')).toContainText('2 ÷ 4 × 100 = 50 %');
  await expect(page.getByTestId('skip-tutorial')).toBeVisible();await page.getByTestId('tutorial-next').click();
  await expect(page.getByTestId('tutorial-comparison')).toContainText('50 % = 50 %');
  await page.getByTestId('toggle-cards').click();await page.getByTestId(`demo-urn-${choice}`).click();await expect(page.getByTestId('tutorial-next')).toBeEnabled();await page.getByTestId('tutorial-next').click();
  await expect(page.locator('.answer-correct')).toHaveCount(2);await expect(page.locator('.tutorial-coach')).toContainText('50 % de roja y 50 % de azul');
    await expect(page.locator('.tutorial-math-note')).toContainText('La elección anterior se juzga con las cuentas de antes');
  await expect(page.getByTestId(`tutorial-calculation-${choice}`)).toContainText(choice===0?'2 ÷ 3 × 100 ≈ 66,7 %':'1 ÷ 1 × 100 = 100 %');
  await page.getByTestId('skip-tutorial').click();await expect(page.locator('body')).toHaveAttribute('data-screen','table');
  expect(await page.evaluate(()=>localStorage.getItem('thegame.save.v1.current'))).toBe(before);
 });
}

for (const viewport of [{width:1440,height:900},{width:1366,height:768},{width:390,height:844}]) {
 for (const scale of ['1','2']) {
  test(`tutorial help and separate exit fit ${viewport.width}x${viewport.height} at text scale ${scale}`,async({page})=>{
   await mkdir(evidence,{recursive:true});await page.setViewportSize(viewport);
   await page.goto('./');await page.waitForFunction(()=>window.__THEGAME_READY__);
   await page.getByTestId('settings-button').click();await page.getByTestId('reduced-motion').check();await page.getByTestId('text-scale').selectOption(scale);
   await page.getByRole('tab',{name:'Sonido',exact:true}).click();await page.getByTestId('volume').fill('0');await page.getByTestId('close-dialog').click();
   await page.getByTestId('new-game').click();await completeIntro(page);await page.getByTestId('enter-urns').click();
   const before=await page.evaluate(()=>localStorage.getItem('thegame.save.v1.current'));
   for (let step=0;step<4;step++) {
    await expect(page.locator('.tutorial-step')).toHaveText(`Paso ${step+1} de 4`);
    await expect(page.locator('.tutorial-badge')).toContainText('Tutorial');
    await expect(page.locator('.game-panel [data-testid="skip-tutorial"]')).toHaveCount(0);
    const exit=(await page.getByTestId('skip-tutorial').boundingBox())!;
    expect(exit.y).toBeGreaterThanOrEqual(0);expect(exit.y+exit.height).toBeLessThanOrEqual(viewport.height);
    expect(exit.height).toBeGreaterThanOrEqual(44);
    await expectTutorialFits(page);
    if(step===0||step===2) {
     await page.getByTestId('toggle-cards').click();
     await page.getByTestId(`demo-urn-${step===0?0:1}`).click();
    }
    await expectTutorialFits(page);
    await page.screenshot({path:`${evidence}/tutorial-choice-${viewport.width}-${scale}-step-${step+1}.png`});
    if(viewport.width<1000)await page.getByTestId('tutorial-view-help').click();
    let readings='';let helpPage=0;
    while(true){
     await expectTutorialFits(page);
     const active=page.locator('[data-tutorial-help-page]:visible');await expect(active).toHaveCount(1);
     readings+=await active.innerText();
     if(helpPage===0)await page.screenshot({path:`${evidence}/tutorial-help-${viewport.width}-${scale}-step-${step+1}.png`});
     if(await page.getByTestId('tutorial-help-next').isDisabled())break;
     await page.getByTestId('tutorial-help-next').click();expect(++helpPage).toBeLessThan(20);
    }
    expect(readings).toContain(step<2?'3 ÷ 5 × 100 = 60 %':'2 ÷ 4 × 100 = 50 %');
    expect(readings).toContain('1 ÷ 2 × 100 = 50 %');
    if(step===1)expect(readings).toContain('(3 − 1) ÷ (5 − 1) = 2 ÷ 4 = 50 %');
    if(step===3){expect(readings).toContain('1 ÷ 1 × 100 = 100 %');expect(readings).toContain('La elección anterior se juzga con las cuentas de antes');expect(readings).toContain('Las cuentas de «ahora» sirven para la próxima extracción');}
    await expect(page.getByTestId('tutorial-help-previous')).toBeFocused();
    await page.getByTestId('tutorial-help-previous').click();
    await expect(page.locator('[data-tutorial-help-page]:visible')).toHaveAttribute('data-tutorial-help-page',String(helpPage-1));
    if(viewport.width<1000)await page.getByTestId('tutorial-view-choice').click();
    const next=(await page.getByTestId('tutorial-next').boundingBox())!;
    expect(next.y).toBeGreaterThanOrEqual(0);expect(next.y+next.height).toBeLessThanOrEqual(viewport.height);
    await page.getByTestId('tutorial-next').click();
   }
   await expect(page.locator('body')).toHaveAttribute('data-screen','table');
   expect(await page.evaluate(()=>localStorage.getItem('thegame.save.v1.current'))).toBe(before);
  });
 }
}

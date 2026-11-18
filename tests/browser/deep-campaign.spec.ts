import {test,expect,type Page} from '@playwright/test';
import {mkdir} from 'node:fs/promises';
import {bestChoices,type GameState} from '../../src/core/game';
import {bestContracts} from '../../src/core/math/dice';
import {currentObjective} from '../../src/core/tables/contracts';
import {bestRecords} from '../../src/core/tables/records';
import {bestFinale} from '../../src/core/tables/finale';
import {completeIntro} from './story-navigation';
const evidence=process.env.EVIDENCE_DIR??'docs/evidence/deep-polish';
const saved=(page:Page):Promise<GameState>=>page.evaluate(()=>JSON.parse(localStorage.getItem('thegame.save.v1.current')!).state);
test('new campaign reaches every tutorial, seal and the saved ending using the mouse',async({page})=>{
 test.setTimeout(240000);await mkdir(evidence,{recursive:true});await page.setViewportSize({width:1280,height:720});const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('./');await page.waitForFunction(()=>window.__THEGAME_READY__);
 await page.getByTestId('settings-button').click();await page.getByTestId('reduced-motion').check();await page.getByRole('tab',{name:'Sonido',exact:true}).click();await page.getByTestId('volume').fill('0');await page.getByTestId('close-dialog').click();
 await page.getByTestId('new-game').click();await completeIntro(page);await page.getByTestId('enter-urns').click();
 for(let step=0;step<4;step++){if(step===0||step===2){await page.getByTestId('toggle-cards').click();await page.getByTestId('demo-urn-0').click();}await page.getByTestId('tutorial-next').click();}
 for(let i=0;i<35;i++){const s=await saved(page);if(s.phase==='complete')break;if(s.phase==='choose'||s.phase==='guided'){if(await page.getByTestId('urn-0').isHidden())await page.getByTestId('toggle-cards').click();await page.getByTestId('urn-'+bestChoices(s)[0]).click();await page.getByTestId('confirm-choice').click();}else await page.getByTestId('next-step').click();}
 await expect(page.getByTestId('completion')).toBeVisible();await page.screenshot({path:`${evidence}/vera-seal.png`});await page.getByTestId('enter-contracts').click();
 for(let i=0;i<3;i++)await page.getByTestId('doble-tutorial-next').click();
 for(let i=0;i<35;i++){const c=(await saved(page)).contracts!;if(c.phase==='complete')break;if(c.phase==='offer'||c.phase==='order'){await page.getByTestId('contract-'+bestContracts(currentObjective(c))[0]).click();await page.getByTestId('doble-sign').click();}else await page.getByTestId('doble-next').click();}
 await expect(page.getByTestId('doble-completion')).toBeVisible();await page.screenshot({path:`${evidence}/doble-seal.png`});await page.getByTestId('enter-records').click();
 await page.getByRole('button',{name:'Probar una mano guiada',exact:true}).click();await page.locator('[data-demo-choice="full-house"]').click();await page.locator('[data-demo-reveal]').click();await page.getByTestId('close-dialog').click();await page.getByTestId('records-begin').click();
 for(let i=0;i<90;i++){const r=(await saved(page)).records!;if(r.phase==='complete')break;if(r.phase==='choose'){if(r.round>=23){await page.getByTestId('records-assist').click();continue;}await page.getByTestId('records-'+bestRecords(r)[0]).click();await page.getByTestId('records-confirm').click();}else await page.getByTestId('records-next').click();}
 await expect(page.getByTestId('records-completion')).toBeVisible();await page.screenshot({path:`${evidence}/ada-seal.png`});await page.getByTestId('enter-finale').click();await page.getByTestId('finale-begin').click();
 for(let i=0;i<90;i++){const f=(await saved(page)).finale!;if(f.phase==='complete')break;if(f.boss!.needsHelp){await page.getByTestId('finale-assist').click();continue;}if(f.phase==='choose'){await page.getByTestId('finale-'+bestFinale(f)[0]).click();await page.getByTestId('finale-confirm').click();}else await page.getByTestId('finale-next').click();}
 await expect(page.getByTestId('finale-completion')).toBeVisible();await page.getByTestId('exit-house').click();await expect(page.locator('body')).toHaveAttribute('data-screen','outside');await page.screenshot({path:`${evidence}/ending.png`});
 expect((await saved(page)).freed).toBe(true);await page.reload();await page.getByTestId('continue-game').click();await expect(page.locator('body')).toHaveAttribute('data-screen','outside');expect(errors).toEqual([]);
});

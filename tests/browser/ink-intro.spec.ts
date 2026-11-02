import { expect, test } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { completeIntro } from './story-navigation';
const evidence = process.env.EVIDENCE_DIR ?? 'docs/evidence/ink';

for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  test(`captor fades into the opening at ${viewport.width}px`, async ({ page }) => {
    await mkdir(evidence, { recursive: true });
    await page.setViewportSize(viewport);
    await page.goto('./');
    await page.waitForFunction(() => window.__THEGAME_READY__);
    await page.getByTestId('new-game').click();
    expect(await page.locator('#captor').evaluate(element => Number(getComputedStyle(element).opacity))).toBe(0);
    await page.waitForFunction(() => {
      const opacity = Number(getComputedStyle(document.querySelector('#captor')!).opacity);
      return document.body.dataset.introPhase === 'reveal' && opacity > .2 && opacity < .8;
    });
    const opacity = await page.locator('#captor').evaluate(element => Number(getComputedStyle(element).opacity));
    expect(opacity).toBeGreaterThan(0);
    expect(opacity).toBeLessThan(1);
    await page.screenshot({ path: `${evidence}/captor-fade-${viewport.width}-middle.png` });
    await expect(page.locator('#captor')).toHaveCSS('opacity', '1');
    await expect(page.locator('body')).toHaveAttribute('data-intro-phase', 'lit');
    await page.screenshot({ path: `${evidence}/captor-fade-${viewport.width}-lit.png` });
  });
}

test('dark opening reveals the captor, lights the room and preserves table play', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await mkdir(evidence, { recursive: true });
  await page.goto('./');
  await page.waitForFunction(() => window.__THEGAME_READY__);
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: `${evidence}/menu.png` });
  await page.getByTestId('new-game').click();
  await expect(page.locator('body')).toHaveAttribute('data-intro-phase', 'dark');
  await expect(page.locator('#blackout')).toHaveCSS('opacity', '1');
  await expect(page.locator('#captor')).toBeHidden();
  await expect(page.getByTestId('intro-next')).toBeDisabled();
  await page.screenshot({ path: `${evidence}/intro-dark.png` });
  await expect(page.locator('body')).toHaveAttribute('data-intro-phase', 'reveal');
  await expect(page.locator('#captor')).toBeVisible();
  await expect(page.getByTestId('intro-back')).toBeFocused();
  await page.screenshot({ path: `${evidence}/intro-reveal.png` });
  await expect(page.locator('body')).toHaveAttribute('data-intro-phase', 'lit');
  await page.getByTestId('intro-next').click();
  await page.getByTestId('intro-next').click();
  await expect(page.locator('#intro-vera')).toBeVisible();
  await expect(page.locator('#captor')).toBeHidden();
  await page.getByTestId('intro-next').click();
  await page.getByTestId('enter-urns').click();
  await page.getByTestId('skip-tutorial').click();
  await page.getByTestId('toggle-cards').click();
  await page.waitForTimeout(1500);
  await expect(page.locator('.graphics-warning')).toHaveCount(0);
  await page.screenshot({ path: `${evidence}/table.png` });
  await page.getByTestId('urn-0').click();
  await page.getByTestId('confirm-choice').click();
  await expect(page.getByTestId('result-feedback')).toBeVisible();
  expect(errors).toEqual([]);
});

test('two story controls navigate back without repeating saved dialogue effects', async ({ page }) => {
  await page.goto('./');
  await page.waitForFunction(() => window.__THEGAME_READY__);
  await page.getByTestId('new-game').click();
  const navigation = page.getByRole('navigation', { name: 'Navegación de la historia' });
  await expect(navigation.getByRole('button')).toHaveCount(2);
  await expect(page.getByTestId('intro-back')).toHaveText('Atrás');
  await page.getByTestId('intro-back').click();
  await expect(page.locator('body')).toHaveAttribute('data-screen', 'menu');
  await page.getByTestId('continue-game').click();
  await expect(page.getByTestId('intro-next')).toBeEnabled();
  await page.getByTestId('intro-back').press('Tab');
  await expect(page.getByTestId('intro-next')).toBeFocused();
  await page.getByTestId('intro-next').press('Enter');
  await page.getByTestId('intro-next').click();
  await expect(page.locator('#intro-vera')).toBeVisible();
  const saved = await page.evaluate(() => localStorage.getItem('thegame.save.v1.current'));
  for (let revisit = 0; revisit < 20; revisit++) {
    await page.getByTestId('intro-back').click();
    await expect(page.locator('.dialogue-progress')).toHaveText('2 de 3');
    await page.getByTestId('intro-next').click();
  }
  expect(await page.evaluate(() => localStorage.getItem('thegame.save.v1.current'))).toBe(saved);
  await page.reload();
  await page.getByTestId('continue-game').click();
  await expect(page.locator('.dialogue-progress')).toHaveText('3 de 3');
  await page.getByTestId('intro-back').click();
  await page.getByTestId('intro-back').click();
  await expect(page.locator('.dialogue-progress')).toHaveText('1 de 3');
  await page.getByTestId('intro-next').click();
  await page.getByTestId('intro-next').click();
  await page.getByTestId('intro-next').click();
  await expect(page.getByTestId('enter-urns')).toBeEnabled();
  const dialogue = await page.evaluate(() => JSON.parse(localStorage.getItem('thegame.save.v1.current')!).state.intro);
  expect(dialogue.ended).toBe(true);
  expect(dialogue.effects).toEqual(['released']);
});

test('reduced motion shortens the darkness and stops character motion', async ({ page }) => {
  await page.goto('./');
  await page.getByTestId('settings-button').click();
  await page.getByTestId('reduced-motion').check();
  await page.getByRole('tab',{name:'Sonido',exact:true}).click();await page.getByTestId('volume').fill('0');
  await page.getByTestId('close-dialog').click();
  await page.getByTestId('new-game').click();
  await expect(page.locator('body')).toHaveAttribute('data-intro-phase', 'lit', { timeout: 1500 });
  expect(await page.locator('#captor').evaluate(el => getComputedStyle(el).animationName)).toBe('none');
  await expect(page.locator('#captor')).toHaveCSS('transition-duration', '0s');
  await expect(page.locator('#captor')).toHaveCSS('opacity', '1');
  await completeIntro(page);
  await expect(page.getByTestId('enter-urns')).toBeVisible();
});

test('system reduced motion disables the captor fade', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  await page.waitForFunction(() => window.__THEGAME_READY__);
  await page.getByTestId('new-game').click();
  await expect(page.locator('body')).toHaveAttribute('data-intro-phase', 'reveal');
  await expect(page.locator('#captor')).toHaveCSS('transition-duration', '0s');
  await expect(page.locator('#captor')).toHaveCSS('opacity', '1');
});

test('returning to the menu cancels later opening changes', async ({ page }) => {
  await page.goto('./');
  await page.getByTestId('new-game').click();
  await page.getByTestId('intro-back').click();
  await page.waitForTimeout(3500);
  await expect(page.locator('body')).toHaveAttribute('data-screen', 'menu');
  await expect(page.getByTestId('continue-game')).toBeFocused();
  await page.getByTestId('continue-game').click();
  await expect(page.locator('.dialogue-progress')).toHaveText('1 de 3');
});

for (const viewport of [{ width: 1440, height: 900 }, { width: 1366, height: 768 }, { width: 390, height: 844 }]) {
  for (const textScale of ['1', '2']) {
    test(`story controls fit ${viewport.width}x${viewport.height} with text scale ${textScale}`, async ({ page }) => {
      await mkdir(evidence, { recursive: true });
      await page.setViewportSize(viewport);
      await page.goto('./');
      await page.waitForFunction(() => window.__THEGAME_READY__);
      await page.getByTestId('settings-button').click();
      await page.getByTestId('reduced-motion').check();
      await page.getByTestId('text-scale').selectOption(textScale);
      await page.getByTestId('close-dialog').click();
      await page.getByTestId('new-game').click();
      await expect(page.locator('body')).toHaveAttribute('data-intro-phase', 'lit');
      const navigation = page.getByRole('navigation', { name: 'Navegación de la historia' });
      for (let line = 0; line < 3; line++) {
        await expect(navigation.getByRole('button')).toHaveCount(2);
        await page.getByTestId('intro-next').scrollIntoViewIfNeeded();
        for (const button of await navigation.getByRole('button').all()) {
          const fit = await button.evaluate(element => {
            const rect = element.getBoundingClientRect();
            return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom, height: rect.height, clipped: element.scrollWidth > element.clientWidth + 1 };
          });
          expect(fit.left).toBeGreaterThanOrEqual(0);
          expect(fit.right).toBeLessThanOrEqual(viewport.width);
          expect(fit.top).toBeGreaterThanOrEqual(0);
          expect(fit.bottom).toBeLessThanOrEqual(viewport.height);
          expect(fit.height).toBeGreaterThanOrEqual(44);
          expect(fit.clipped).toBe(false);
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport.width);
        await page.screenshot({ path: `${evidence}/story-${viewport.width}-${textScale}-${line + 1}.png` });
        await page.getByTestId('intro-next').click();
      }
      await expect(page.getByTestId('enter-urns')).toBeVisible();
    });
  }
}

import { expect, test } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
const evidence = process.env.EVIDENCE_DIR ?? 'docs/evidence/ink';

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
  await expect(page.getByTestId('skip-intro')).toBeFocused();
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

test('reduced motion shortens the darkness and stops character motion', async ({ page }) => {
  await page.goto('./');
  await page.getByTestId('settings-button').click();
  await page.getByTestId('reduced-motion').check();
  await page.getByRole('tab',{name:'Sonido',exact:true}).click();await page.getByTestId('volume').fill('0');
  await page.getByTestId('close-dialog').click();
  await page.getByTestId('new-game').click();
  await expect(page.locator('body')).toHaveAttribute('data-intro-phase', 'lit', { timeout: 1500 });
  expect(await page.locator('#captor').evaluate(el => getComputedStyle(el).animationName)).toBe('none');
  await page.getByTestId('skip-intro').click();
  await expect(page.getByTestId('enter-urns')).toBeVisible();
});

test('skipping the dark opening cancels later scene changes', async ({ page }) => {
  await page.goto('./');
  await page.getByTestId('new-game').click();
  await page.getByTestId('skip-intro').click();
  await page.getByTestId('enter-urns').click();
  await page.getByTestId('skip-tutorial').click();
  await page.getByTestId('toggle-cards').click();
  await page.getByTestId('urn-1').click();
  await page.waitForTimeout(3500);
  await expect(page.getByTestId('urn-1')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('body')).toHaveAttribute('data-screen', 'table');
});

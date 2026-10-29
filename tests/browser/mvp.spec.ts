import { expect, test, type Page } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const evidence = process.env.EVIDENCE_DIR ?? 'docs/evidence/runtime';
const saved = (page: Page) => page.evaluate(() => {
  const raw = localStorage.getItem('thegame.save.v1.current');
  return raw ? JSON.parse(raw).state : null;
});

async function start(page: Page) {
  await mkdir(evidence, { recursive: true });
  await page.goto('./');
  await page.waitForLoadState('networkidle');
  await page.waitForFunction(() => (window as Window & { __THEGAME_READY__?: boolean }).__THEGAME_READY__);
  await expect(page.locator('.graphics-warning')).toHaveCount(0);
  await page.screenshot({ path: `${evidence}/mvp-menu.png` });
  await page.getByTestId('new-game').click();
  await page.getByTestId('skip-intro').click();
  await page.getByTestId('enter-urns').click();
  await page.getByTestId('skip-tutorial').click();
  await expect(page.locator('body')).toHaveAttribute('data-screen', 'table');
  await page.getByTestId('toggle-cards').click();
}

test('complete urn table with decisions, canvas, and no page errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await start(page);
  await expect(page.locator('#scene')).toBeVisible();
  await page.screenshot({ path: `${evidence}/mvp-table.png` });
  for (let action = 0; action < 40; action++) {
    const state = await saved(page);
    if (state.phase === 'complete') break;
    if (state.phase === 'choose' || state.phase === 'guided') {
      if(await page.getByTestId('urn-0').isHidden()) await page.getByTestId('toggle-cards').click();
      const [a, b] = state.urns;
      const choice = a[state.event] * (b.red + b.blue) >= b[state.event] * (a.red + a.blue) ? 0 : 1;
      await page.getByTestId(`urn-${choice}`).click();
      await page.getByTestId('confirm-choice').click();
      await expect(page.getByTestId('result-feedback')).toBeVisible();
    } else {
      await page.getByTestId('next-step').click();
    }
  }
  await expect(page.getByTestId('completion')).toBeVisible();
  const state = await saved(page);
  expect(state.merit).toBe(8);
  expect(state.history).toHaveLength(8);
  await page.screenshot({ path: `${evidence}/mvp-complete.png` });
  expect(errors).toEqual([]);
});

test('reload preserves revealed result and RNG checkpoint', async ({ page }) => {
  await start(page);
  await page.getByTestId('urn-0').click();
  await page.getByTestId('confirm-choice').click();
  await expect(page.getByTestId('result-feedback')).toBeVisible();
  const before = await saved(page);
  await page.reload();
  await page.waitForLoadState('networkidle');
  await page.getByTestId('continue-game').click();
  await expect(page.getByTestId('result-feedback')).toBeVisible();
  expect(await saved(page)).toEqual(before);
});

test('settings allow reduced motion and text scaling', async ({ page }) => {
  await start(page);
  await page.getByTestId('settings-button').click();
  await page.getByTestId('reduced-motion').check();
  await page.getByTestId('text-scale').selectOption('2');
  await page.getByRole('tab',{name:'Sonido',exact:true}).click();await page.getByTestId('volume').focus();
  await page.keyboard.press('Home');
  await page.getByTestId('close-dialog').click();
  await expect(page.locator('dialog')).toHaveCount(0);
  const state = await saved(page);
  expect(state.settings.reducedMotion).toBe(true);
  expect(state.settings.textScale).toBe(2);
  expect(state.settings.volume).toBe(0);
  await page.getByTestId('urn-0').focus();
  await page.keyboard.press('Enter');
  await page.getByTestId('confirm-choice').focus();
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('result-feedback')).toBeVisible();
  await page.screenshot({ path: `${evidence}/mvp-text-200-percent.png`, fullPage: true });
});

test('weak decisions reach a finite guided completion', async ({ page }) => {
  await start(page);
  for (let action = 0; action < 60; action++) {
    const state = await saved(page);
    if (state.phase === 'complete') break;
    if (state.phase === 'choose' || state.phase === 'guided') {
      if(await page.getByTestId('urn-0').isHidden()) await page.getByTestId('toggle-cards').click();
      const [a, b] = state.urns;
      const aBest = a[state.event] * (b.red + b.blue) >= b[state.event] * (a.red + a.blue);
      const choice = state.assisted ? (aBest ? 0 : 1) : (aBest ? 1 : 0);
      await page.getByTestId(`urn-${choice}`).focus();
      await page.keyboard.press('Enter');
      await page.getByTestId('confirm-choice').focus();
      await page.keyboard.press('Enter');
    } else {
      await page.getByTestId('next-step').focus();
      await page.keyboard.press('Enter');
    }
  }
  await expect(page.getByTestId('completion')).toBeVisible();
  const state = await saved(page);
  expect(state.assisted).toBe(true);
  expect(state.history).toHaveLength(12);
  expect(state.merit).toBeLessThan(6);
  await page.screenshot({ path: `${evidence}/mvp-assisted-complete.png` });
});

test('remapped shortcuts work and conflicting bindings are rejected', async ({ page }) => {
  await start(page);
  const before = await saved(page);
  await page.getByText('Ayuda y opciones',{exact:true}).click();await page.getByTestId('help-button').click();
  await page.getByTestId('help-button').click();
  expect(await saved(page)).toEqual({ ...before, helpHistory: ['urns-0-0'] });
  await page.getByTestId('settings-button').click();
  await page.getByRole('tab',{name:'Controles',exact:true}).click();await page.getByTestId('bind-urn-u').selectOption('KeyD');
  await expect(page.getByTestId('binding-warning')).not.toBeEmpty();
  await page.getByRole('tab',{name:'Controles',exact:true}).click();await page.getByTestId('bind-urn-u').selectOption('KeyJ');
  await page.getByRole('tab',{name:'Controles',exact:true}).click();await page.getByTestId('bind-confirm').selectOption('KeyL');
  await page.getByTestId('close-dialog').click();
  await expect(page.locator('dialog')).toHaveCount(0);
  await page.keyboard.press('j');
  await expect(page.getByTestId('urn-0')).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('l');
  await expect(page.getByTestId('result-feedback')).toBeVisible();
  expect((await saved(page)).history).toHaveLength(1);
});

test('invalid save keeps a usable menu', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('thegame.save.v1.current', '{broken'));
  await page.goto('./');
  await page.waitForLoadState('networkidle');
  await expect(page.getByTestId('new-game')).toBeVisible();
  await expect(page.getByTestId('continue-game')).toHaveCount(0);
});

test('unavailable WebGL preserves playable controls and a retry action', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
      value: function(this: HTMLCanvasElement, type: string, ...args: unknown[]) {
        if (['webgl', 'webgl2', 'experimental-webgl'].includes(type)) return null;
        return Reflect.apply(original, this, [type, ...args]);
      },
    });
  });
  await page.goto('./');
  await page.waitForLoadState('networkidle');
  await expect(page.getByTestId('retry-graphics')).toBeVisible();
  await page.getByTestId('new-game').click();
  await page.getByTestId('skip-intro').click();
  await page.getByTestId('enter-urns').click();
  await page.getByTestId('skip-tutorial').click();
  await page.getByTestId('toggle-cards').click();
  await page.getByTestId('urn-0').click();
  await page.getByTestId('confirm-choice').click();
  await expect(page.getByTestId('result-feedback')).toBeVisible();
  expect((await saved(page)).history).toHaveLength(1);
});

test('replacement dialogs survive close events and deletion can be cancelled', async ({ page }) => {
  await start(page);
  await page.getByTestId('settings-button').click();
  await page.getByTestId('reduced-motion').check();
  await page.getByTestId('restore-settings').click();
  await expect(page.getByTestId('reduced-motion')).not.toBeChecked();
  await page.getByTestId('delete-save').click();
  await expect(page.getByTestId('confirm-delete')).toBeVisible();
  await page.getByTestId('close-dialog').click();
  await expect(page.locator('dialog')).toHaveCount(0);
  expect(await saved(page)).not.toBeNull();
  await expect(page.getByTestId('urn-0')).toBeVisible();
});

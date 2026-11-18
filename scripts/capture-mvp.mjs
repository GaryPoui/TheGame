import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:4173/';
const destination = process.env.EVIDENCE_DIR ?? 'docs/evidence/runtime';
await mkdir(destination, { recursive: true });
const browser = await chromium.launch({ headless: true, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [], failedRequests = [], externalRequests = [];
page.on('pageerror', error => errors.push(error.message));
page.on('requestfailed', request => failedRequests.push({ url: request.url(), failure: request.failure() }));
page.on('request', request => { if (new URL(request.url()).origin !== new URL(baseURL).origin) externalRequests.push(request.url()); });
try {
  await page.goto(baseURL);
  await page.waitForLoadState('networkidle');
  await page.waitForFunction(() => window.__THEGAME_READY__);
  await page.screenshot({ path: `${destination}/mvp-menu.png` });
  const graphics = await page.locator('#scene').evaluate(canvas => {
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
    const extension = gl?.getExtension('WEBGL_debug_renderer_info');
    return { width: canvas.width, height: canvas.height, context: gl?.constructor.name ?? null,
      renderer: extension ? gl.getParameter(extension.UNMASKED_RENDERER_WEBGL) : null,
      warning: document.querySelector('.graphics-warning')?.textContent ?? null };
  });
  await page.getByTestId('new-game').click();
  await page.getByTestId('skip-intro').click();
  await page.getByTestId('enter-urns').click();
  await page.screenshot({ path: `${destination}/tutorial.png` });
  await page.getByTestId('skip-tutorial').click(); await page.getByTestId('toggle-cards').click();
  await page.screenshot({ path: `${destination}/mvp-table.png` });
  await page.getByTestId('settings-button').click();
  await page.getByTestId('reduced-motion').check();
  await page.getByTestId('close-dialog').click();
  await page.locator('dialog').waitFor({ state: 'detached' });
  await page.getByTestId('urn-0').focus();
  await page.keyboard.press('Enter');
  await page.getByTestId('confirm-choice').focus();
  await page.keyboard.press('Enter');
  await page.screenshot({ path: `${destination}/revealed.png` });
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.getByTestId('settings-button').click();
  await page.getByTestId('text-scale').selectOption('2');
  await page.getByTestId('close-dialog').click();
  await page.locator('dialog').waitFor({ state: 'detached' });
  await page.getByTestId('next-step').focus();
  await page.screenshot({ path: `${destination}/text-200-percent-720p.png`, fullPage: true });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.getByTestId('settings-button').click();
  await page.getByTestId('text-scale').selectOption('1');
  await page.getByTestId('close-dialog').click();
  await page.locator('dialog').waitFor({ state: 'detached' });
  for (let action = 0; action < 40; action++) {
    const state = await page.evaluate(() => JSON.parse(localStorage.getItem('thegame.save.v1.current')).state);
    if (state.phase === 'complete') break;
    if (state.phase === 'choose' || state.phase === 'guided') {
      const [a, b] = state.urns;
      const index = a[state.event] * (b.red + b.blue) >= b[state.event] * (a.red + a.blue) ? 0 : 1;
      await page.getByTestId(`urn-${index}`).click();
      await page.getByTestId('confirm-choice').click();
    } else await page.getByTestId('next-step').click();
  }
  await page.getByTestId('completion').waitFor();
  await page.screenshot({ path: `${destination}/mvp-complete.png` });
  const result = { date: '2026-10-23', baseURL, browser: browser.version(), graphics, errors, failedRequests, externalRequests,
    viewport: [1440, 900], scaledViewport: [1280, 720], rendererMode: 'headless software SwiftShader',
    hardware: { cpu: 'AMD Ryzen 7 3700X', gpu: 'Radeon RX 570', ramGiB: 15.9, os: 'Windows 10 Home 10.0.19045' } };
  await writeFile(`${destination}/capture.json`, JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify(result, null, 2));
} finally { await browser.close(); }

import type { Page } from '@playwright/test';

export async function completeIntro(page: Page): Promise<void> {
  for (let line = 0; line < 3; line++) {
    await page.getByTestId('intro-next').click();
  }
}
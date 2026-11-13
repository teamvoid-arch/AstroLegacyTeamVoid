import type { Page } from '@playwright/test';

/** Quiet, motion-free settings so tests are fast and scrolling is instant. */
export async function quietSettings(page: Page) {
  await page.addInitScript(() => {
    try {
      if (!sessionStorage.getItem('al.test')) {
        localStorage.clear();
        localStorage.setItem('al.settings', JSON.stringify({ music: false, voice: false, sfx: false, captions: true, reducedMotion: true }));
        sessionStorage.setItem('al.test', '1');
      }
    } catch { /* storage blocked: the app still works */ }
  });
}

/** Collect uncaught page errors so a test can assert there were none. */
export function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  return errors;
}

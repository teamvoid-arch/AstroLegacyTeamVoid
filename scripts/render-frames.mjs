// Saves the Veo 3 start frames (docs/veo3-prompts.md, "[F]" shots) as video-frames/<video>/<shot>.png, 1920×1080.
// Needs the dev server running (npm run dev). Uses the installed Chrome through Playwright.
//
//   npm run frames                           every frame, from http://localhost:5173
//   npm run frames -- --base http://localhost:5175 --only surveyor3/2,lro/3
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const args = process.argv.slice(2);
const opt = (n) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : null; };
const base = opt('base') || 'http://localhost:5173';
const only = opt('only') ? opt('only').split(',') : null;

const browser = await chromium.launch({ channel: process.env.PW_CHANNEL || 'chrome' });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1.5 });
await page.goto(`${base}/#/frames`);
await page.waitForFunction(() => Array.isArray(window.__frameIds), null, { timeout: 60000 });
const ids = (await page.evaluate(() => window.__frameIds)).filter((id) => !only || only.includes(id));

for (const id of ids) {
  await page.goto(`${base}/#/frames?f=${encodeURIComponent(id)}`);
  try {
    await page.waitForFunction((x) => window.__frameReady === x, id, { timeout: 60000 });
  } catch { console.log(`${id}: timed out waiting for models, saved anyway`); }
  const [video, shot] = id.split('/');
  mkdirSync(`video-frames/${video}`, { recursive: true });
  await page.locator('canvas').first().screenshot({ path: `video-frames/${video}/${shot}.png` });
  console.log(`${id} ✓`);
}
await browser.close();
console.log(`${ids.length} frame(s) saved in video-frames/.`);

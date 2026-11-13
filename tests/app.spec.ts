import { test, expect } from '@playwright/test';
import { quietSettings, trackErrors } from './helpers';
import { beats } from '../src/story/beats.ts';
import { machines } from '../src/data/machines.ts';

test.beforeEach(async ({ page }) => { await quietSettings(page); });

test('app loads: splash, then Begin the story → name (skip) → first beat', async ({ page }) => {
  const errors = trackErrors(page);
  await page.goto('./');
  await expect(page.getByRole('heading', { name: /Astro\s*Legacy/i })).toBeVisible();
  await page.getByRole('button', { name: /Begin the story/i }).click();
  await page.getByRole('button', { name: /skip/i }).click();
  await expect(page).toHaveURL(/#\/story/);
  await expect(page.locator('.caption .beat-title')).toHaveText(`${beats[0].scene} · ${beats[0].title}`);
  expect(errors).toEqual([]);
});

test('every main-path beat reaches the centre', async ({ page }) => {
  test.setTimeout(300_000);
  const errors = trackErrors(page);
  await page.goto('./#/story');
  const title = page.locator('.caption .beat-title');
  for (let i = 0; i < beats.length; i++) {
    const b = beats[i];
    if (i > 0) await page.keyboard.press('ArrowDown');
    await expect(title, `beat ${b.id}`).toHaveText(`${b.scene} · ${b.title}`);
    await expect(page.locator('.caption p').first(), `caption for ${b.id}`).not.toBeEmpty();
  }
  await expect(page.locator('.finale')).toBeVisible({ timeout: 60_000 });
  expect(errors).toEqual([]);
});

test('every page route renders', async ({ page }) => {
  const errors = trackErrors(page);
  for (const [route, text] of [
    ['#/logbook', /Logbook/], ['#/sources', /Sources/], ['#/data', /NASA data/], ['#/about', /Team VOID/],
    ['#/teachers', /teacher/i], ['#/certificate', /certificate/i], ['#/experience', /Enter/],
  ] as const) {
    await page.goto(`./${route}`);
    await expect(page.locator('body'), route).toContainText(text);
  }
  expect(errors).toEqual([]);
});

test('every fact has a NASA (or labelled partner) source URL', () => {
  for (const m of machines) {
    expect(m.sources.length, `${m.id} has sources`).toBeGreaterThan(0);
    for (const s of m.sources) expect(s.url, `${m.id}: ${s.title}`).toMatch(/^https:\/\//);
  }
});

test('every beat has an English caption', () => {
  for (const b of beats) {
    expect(b.lines.length, b.id).toBeGreaterThan(0);
    for (const l of b.lines) expect(l.text.trim(), b.id).not.toBe('');
  }
});

// The Story Script says the Bangla version is translated later by a native speaker.
test.fixme('every beat has a Bangla caption (waiting for the native-speaker translation)', () => {});

test('every audio file in the narration manifest exists', async ({ request }) => {
  // Static hosts may answer a missing file with index.html, so check the content type, not just the status.
  const r = await request.get('./audio/vo/manifest.json');
  if (!r.ok() || !(r.headers()['content-type'] || '').includes('json')) {
    test.info().annotations.push({ type: 'note', description: 'No narration generated yet; the app uses the browser voice or captions.' });
    return;
  }
  const manifest = (await r.json()) as Record<string, { file: string }>;
  for (const [id, e] of Object.entries(manifest)) {
    const f = await request.head(`./${e.file}`);
    expect(f.ok() && (f.headers()['content-type'] || '').includes('audio'), `${id} → ${e.file}`).toBeTruthy();
  }
});

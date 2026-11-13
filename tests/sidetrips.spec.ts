import { test, expect } from '@playwright/test';
import { quietSettings, trackErrors } from './helpers';
import { beats } from '../src/story/beats.ts';
import { hubById, tripById } from '../src/story/sidetrips.ts';

test.beforeEach(async ({ page }) => { await quietSettings(page); });

for (const b of beats.filter((x) => x.hub)) {
  const hub = hubById[b.hub!];
  test(`hub ${hub.id}: every side trip opens and returns`, async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto(`./#/story?beat=${b.id}`);
    await expect(page.locator('.caption .beat-title')).toHaveText(`${b.scene} · ${b.title}`);
    for (const id of hub.trips) {
      const trip = tripById[id];
      await page.locator('.hub-card', { hasText: trip.title }).click();
      const modal = page.getByRole('dialog', { name: `Side trip: ${trip.title}` });
      await expect(modal).toBeVisible();
      await expect(modal.getByRole('heading', { name: trip.title })).toBeVisible();
      await modal.getByRole('button', { name: /Fly back/ }).click();
      await expect(modal).toBeHidden();
      await expect(page.locator('.caption .beat-title')).toHaveText(`${b.scene} · ${b.title}`);
    }
    expect(errors).toEqual([]);
  });
}

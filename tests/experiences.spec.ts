import { test, expect } from '@playwright/test';
import { quietSettings, trackErrors } from './helpers';
import { EXPERIENCES } from '../src/experience/experiences.ts';

test.beforeEach(async ({ page }) => { await quietSettings(page); });

for (const exp of EXPERIENCES) {
  test(`experience ${exp.id} can be finished`, async ({ page }) => {
    // Narration runs at reading speed (voice off), so a room takes a minute or two.
    test.setTimeout(240_000);
    const errors = trackErrors(page);
    await page.goto(`./#/experience/${exp.id}`);
    for (const s of exp.steps) {
      const next = page.getByRole('button', { name: `${s.label} (press this one next)`, exact: true });
      await expect(next, `step ${s.control}`).toBeVisible({ timeout: 90_000 });
      if (s.type === 'arrows') {
        for (let i = 0; i < 3; i++) await page.getByRole('button', { name: /^Plan move/ }).first().click();
      }
      await next.click();
    }
    await expect(page.locator('.win-card')).toBeVisible({ timeout: 90_000 });
    await expect(page.locator('.win-card')).toContainText(exp.fact);
    expect(errors).toEqual([]);
  });
}

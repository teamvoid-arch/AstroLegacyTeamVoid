import { defineConfig, devices } from '@playwright/test';

// Browser tests from Build Spec §12 "Quality checks before every deploy".
// They run against the production build (vite preview), like the deployed site.
const PORT = 4173;

export default defineConfig({
  testDir: 'tests',
  timeout: 120_000,
  expect: { timeout: 15_000 },
  fullyParallel: true,
  workers: 3,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: `http://localhost:${PORT}/`,
    viewport: { width: 1280, height: 720 },
    // WebGL in headless Chromium (software renderer).
    launchOptions: { args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] },
  },
  // Uses the installed Google Chrome (channel 'chrome'). Set PW_CHANNEL=msedge for Edge,
  // or PW_CHANNEL= (empty) for Playwright's own Chromium (`npx playwright install chromium`).
  projects: [{
    name: 'chrome',
    use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 720 }, channel: process.env.PW_CHANNEL ?? 'chrome' },
  }],
  webServer: {
    command: `npm run build && npx vite preview --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}/`,
    reuseExistingServer: true,
    timeout: 180_000,
  },
});

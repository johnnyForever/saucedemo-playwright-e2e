import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: ['**/*.ts', '**/*.spec.ts'],
  fullyParallel: true,
  
  //retries: process.env.CI ? 2 : 0,
  reporter: [
    ['html', { open: 'never' }],
    ['json', { outputFile: 'results.json' }],
    ['list', { printSteps: true }],
  ],

  use: {
    baseURL: 'https://www.saucedemo.com/',
    headless: false,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 5_000,
    navigationTimeout: 10_000,
    video: 'on-first-retry',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'edge',
      use: { ...devices['Desktop Edge'] },
    },
  ],
//   webServer: {
//   command: 'npm run start',
//   url: 'http://localhost:3000',
//   reuseExistingServer: !process.env.CI,
// },
});

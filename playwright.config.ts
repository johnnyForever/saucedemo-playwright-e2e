import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  timeout: 70 * 1000,
  globalTimeout: 10 * 60 * 1000,
  testDir: './tests',
  testMatch: ['**/e2e/*.ts'],
  fullyParallel: true,
  reporter: [
    ['html', { open: 'always' }],
    ['json', { outputFile: 'results.json' }],
    //['allure-playwright'],
    //[SQLiteReporter, { dbPath: './test-results/test-results.db' }],
    ['list', { printSteps: true }],
  ],

  use: {
    baseURL: 'https://www.saucedemo.com/',
    testIdAttribute: 'data-test',
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 5_000,
    navigationTimeout: 10_000,
    video: 'on-first-retry',
    trace: 'on',
    screenshot: 'only-on-failure',
  },

  projects: [
    // Desktop browsers
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
    // {
    //   name: 'firefox',
    //   use: { browserName: 'firefox' },
    // },
    // {
    //   name: 'webkit',
    //   use: { browserName: 'webkit' },
    // },

    // // Mobile emulator
    // {
    //   name: 'mobile chrome',
    //   use: {
    //     ...devices['Pixel 5'],
    //     browserName: 'chromium',
    //   },
    // },
  ],
  //   webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

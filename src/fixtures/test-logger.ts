import { test as base } from '@playwright/test';
import { getTestLogger } from '@/db/test-logger.ts';

type TestLogger = ReturnType<typeof getTestLogger>;

interface TestFixtures {
  logger: TestLogger;
  autoLogger: void;
}

export const test = base.extend<TestFixtures>({
  logger: async ({}, use) => {
    await use(getTestLogger());
  },

  autoLogger: [
    async ({}, use, testInfo) => {
      const logger = getTestLogger();
      const startTime = Date.now();

      await use();

      // Log test result after completion
      const duration = Date.now() - startTime;
      const status = testInfo.status === 'passed' ? 'passed' : testInfo.status === 'skipped' ? 'skipped' : 'failed';
      const errorMessage = testInfo.error?.message;

      if (process.env.DEBUG_LOGGER === 'true') {
        console.log('[TEST LOGGER] Logging test:', testInfo.title, 'Status:', status, 'Duration:', duration);
      }
      logger.logTest(testInfo.title, status, duration, errorMessage);
    },
    { auto: true },
  ],
});

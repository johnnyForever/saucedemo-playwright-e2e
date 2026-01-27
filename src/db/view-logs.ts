#!/usr/bin/env node
/**
 * View Test Logs
 *
 * Usage:
 *   npx tsx src/db/view-logs.ts [command]
 *
 * Commands:
 *   recent     - Show recent test executions (default)
 *   failed     - Show failed tests
 *   stats      - Show test statistics
 */
import 'dotenv/config';
import { getTestLogger } from '@/db/test-logger.js';
import { TestLog } from '@/types/index.js';

const logger = getTestLogger();
const command = process.argv[2] || 'recent';

console.log('\nTest Logs & Cleanup Status\n');
console.log('='.repeat(80));

switch (command) {
  case 'recent': {
    console.log('\nRecent Test Executions:\n');
    const logs = logger.getRecentLogs(20) as unknown as TestLog[];
    if (logs.length > 0) {
      const formattedLogs = logs.map((log: TestLog) => ({
        test_name: log.test_name,
        status: log.status,
        duration_ms: log.duration_ms,
        error: log.error_message ? log.error_message.substring(0, 100) + '...' : null,
        run_date: log.run_date,
      }));
      console.table(formattedLogs);
    } else {
      console.log('No test logs found.');
    }
    break;
  }

  case 'failed': {
    console.log('\nFailed Tests:\n');
    const failed = logger.getFailedTests(20) as unknown as TestLog[];
    if (failed.length > 0) {
      const formattedFailed = failed.map((test: TestLog) => ({
        test_name: test.test_name,
        error: test.error_message ? test.error_message.substring(0, 150) + '...' : null,
        run_date: test.run_date,
      }));
      console.table(formattedFailed);
    } else {
      console.log('No failed tests! ✅');
    }
    break;
  }

  case 'stats': {
    console.log('\n📊 Test Statistics:\n');
    const stats = logger.getTestStats();
    if (stats) {
      console.table([stats]);
    } else {
      console.log('No test data available.');
    }
    break;
  }

  default:
    console.log(`
Unknown command: ${command}
Available commands:
  recent     - Show recent test executions
  failed     - Show failed tests
  stats      - Show test statistics
Examples:
  npx tsx src/db/view-logs.ts recent
  npx tsx src/db/view-logs.ts failed
  npx tsx src/db/view-logs.ts stats`
);
}

console.log('\n' + '='.repeat(80) + '\n');

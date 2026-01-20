#!/usr/bin/env node
/**
 * View Test Logs and Cleanup Status
 *
 * Usage:
 *   npx tsx src/db/view-logs.ts [command]
 *
 * Commands:
 *   recent     - Show recent test executions (default)
 *   failed     - Show failed tests
 *   stats      - Show test statistics
 *   cleanup    - Show pending cleanup items
 */

import { getTestLogger } from './test-logger.js';

const logger = getTestLogger();
const command = process.argv[2] || 'recent';

console.log('\n📋 Test Logs & Cleanup Status\n');
console.log('='.repeat(80));

switch (command) {
  case 'recent': {
    console.log('\n🕐 Recent Test Executions:\n');
    const logs = logger.getRecentLogs(20);
    if (logs.length > 0) {
      console.table(logs);
    } else {
      console.log('No test logs found.');
    }
    break;
  }

  case 'failed': {
    console.log('\n❌ Failed Tests:\n');
    const failed = logger.getFailedTests(20);
    if (failed.length > 0) {
      console.table(failed);
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

  case 'cleanup': {
    console.log('\n🧹 Pending Cleanup Items:\n');
    const pending = logger.getPendingCleanupItems();
    if (pending.length > 0) {
      console.table(pending);
      console.log(`\n⚠️  ${pending.length} item(s) need cleanup`);
    } else {
      console.log('No pending cleanup items! ✅');
    }
    break;
  }

  default:
    console.log(`
❌ Unknown command: ${command}

Available commands:
  recent     - Show recent test executions
  failed     - Show failed tests
  stats      - Show test statistics
  cleanup    - Show pending cleanup items

Examples:
  npx tsx src/db/view-logs.ts recent
  npx tsx src/db/view-logs.ts failed
  npx tsx src/db/view-logs.ts cleanup
    `);
}

console.log('\n' + '='.repeat(80) + '\n');

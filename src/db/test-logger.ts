import SqliteDB from '@/db/sqlite.ts';
import type Database from 'better-sqlite3';
import { UserQueries } from '@/db/queries.ts';
import { TestLogRow, FailedTestRow, TestStatsRow } from '@/types/test-log.ts';

export class TestLogger {
  private db: Database.Database;
  private q: UserQueries;

  constructor() {
    this.db = SqliteDB.getInstance();
    this.q = new UserQueries(this.db);
  }

  // Logs a test result to the database
  logTest(testName: string, status: 'passed' | 'failed' | 'skipped', durationMs?: number, errorMessage?: string) {
    this.q.insertLog.run(testName, status, durationMs || null, errorMessage || null);
  }

  // Retrieves the most recent test logs from the database
  getRecentLogs(limit: number = 10): TestLogRow[] {
    return this.q.recentLogs.all(limit) as TestLogRow[];
  }

  // Retrieves failed test logs from the database
  getFailedTests(limit: number = 10): FailedTestRow[] {
    return this.q.failedTests.all(limit) as FailedTestRow[];
  }

  // Calculates and retrieves overall test statistics
  getTestStats(): TestStatsRow {
    return this.q.testStats.get() as TestStatsRow;
  }
}

let loggerInstance: TestLogger | null = null;

export function getTestLogger(): TestLogger {
  if (!loggerInstance) {
    loggerInstance = new TestLogger();
  }
  return loggerInstance;
}

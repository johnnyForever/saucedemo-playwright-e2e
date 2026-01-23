import SqliteDB from '@/db/sqlite.ts';
import type Database from 'better-sqlite3';
import { TestLogRow, FailedTestRow, TestStatsRow } from '@/types/test-log.ts';

export class TestLogger {
  private db: Database.Database;
  private insertLog: Database.Statement;

  // Initializes the TestLogger with database connection and prepared statements
  constructor() {
    this.db = SqliteDB.getInstance();

    this.insertLog = this.db.prepare(`
      INSERT INTO test_log (test_name, status, duration_ms, error_message)
      VALUES (?, ?, ?, ?)
    `);
  }

  // Logs a test result to the database
  logTest(testName: string, status: 'passed' | 'failed' | 'skipped', durationMs?: number, errorMessage?: string) {
    this.insertLog.run(testName, status, durationMs || null, errorMessage || null);
  }

  // Retrieves the most recent test logs from the database
  getRecentLogs(limit: number = 10): TestLogRow[] {
    return this.db
      .prepare(
        `
        SELECT 
          test_name,
          status,
          duration_ms,
          error_message,
          datetime(run_date) as run_date
        FROM test_log 
        ORDER BY run_date DESC 
        LIMIT ?
      `
      )
      .all(limit) as TestLogRow[];
  }

  // Retrieves failed test logs from the database
  getFailedTests(limit: number = 10): FailedTestRow[] {
    return this.db
      .prepare(
        `
        SELECT 
          test_name,
          error_message,
          datetime(run_date) as run_date
        FROM test_log 
        WHERE status = 'failed'
        ORDER BY run_date DESC 
        LIMIT ?
      `
      )
      .all(limit) as FailedTestRow[];
  }

  // Calculates and retrieves overall test statistics
  getTestStats(): TestStatsRow {
    return this.db
      .prepare(
        `
        SELECT 
          COUNT(*) as total_tests,
          SUM(CASE WHEN status = 'passed' THEN 1 ELSE 0 END) as passed,
          SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed,
          SUM(CASE WHEN status = 'skipped' THEN 1 ELSE 0 END) as skipped,
          ROUND(AVG(duration_ms), 2) as avg_duration_ms,
          MIN(datetime(run_date)) as first_run,
          MAX(datetime(run_date)) as last_run
        FROM test_log
      `
      )
      .get() as TestStatsRow;
  }
}

let loggerInstance: TestLogger | null = null;

// Returns the singleton instance of TestLogger
export function getTestLogger(): TestLogger {
  if (!loggerInstance) {
    loggerInstance = new TestLogger();
  }
  return loggerInstance;
}

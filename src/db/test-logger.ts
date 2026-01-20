import SqliteDB from './sqlite.ts';
import type Database from 'better-sqlite3';

export class TestLogger {
  private db: Database.Database;
  private insertLog: Database.Statement;
  private insertCleanup: Database.Statement;
  private markCleaned: Database.Statement;
  private getPendingCleanup: Database.Statement;

  constructor() {
    this.db = SqliteDB.getInstance();

    this.insertLog = this.db.prepare(`
      INSERT INTO test_log (test_name, status, duration_ms, error_message)
      VALUES (?, ?, ?, ?)
    `);

    this.insertCleanup = this.db.prepare(`
      INSERT INTO test_cleanup (resource_type, resource_id, test_name)
      VALUES (?, ?, ?)
    `);

    this.markCleaned = this.db.prepare(`
      UPDATE test_cleanup 
      SET cleaned_up = 1 
      WHERE resource_type = ? AND resource_id = ?
    `);

    this.getPendingCleanup = this.db.prepare(`
      SELECT * FROM test_cleanup 
      WHERE cleaned_up = 0
      ORDER BY created_at DESC
    `);
  }

  // Log test execution
  logTest(testName: string, status: 'passed' | 'failed' | 'skipped', durationMs?: number, errorMessage?: string) {
    this.insertLog.run(testName, status, durationMs || null, errorMessage || null);
  }

  // Track resource for cleanup
  trackResource(resourceType: string, resourceId: string, testName?: string) {
    this.insertCleanup.run(resourceType, resourceId, testName || null);
  }

  // Mark resource as cleaned up
  markResourceCleaned(resourceType: string, resourceId: string) {
    this.markCleaned.run(resourceType, resourceId);
  }

  // Get all pending cleanup items
  getPendingCleanupItems() {
    return this.getPendingCleanup.all();
  }

  // Get recent test logs
  getRecentLogs(limit: number = 10) {
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
      .all(limit);
  }

  // Get failed tests
  getFailedTests(limit: number = 10) {
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
      .all(limit);
  }

  // Get test statistics
  getTestStats() {
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
      .get();
  }
}

let loggerInstance: TestLogger | null = null;

export function getTestLogger(): TestLogger {
  if (!loggerInstance) {
    loggerInstance = new TestLogger();
  }
  return loggerInstance;
}

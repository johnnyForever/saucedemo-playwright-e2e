import Database from 'better-sqlite3';
import * as types from '@/types/index.ts';

export class UserQueries {
  private db: Database.Database;
  private selectAllUsers: Database.Statement;
  private selectUserByName: Database.Statement;
  private selectActiveUsers: Database.Statement;
  public insertLog: Database.Statement;
  public recentLogs: Database.Statement;
  public failedTests: Database.Statement;
  public testStats: Database.Statement;
  constructor(db: Database.Database) {
    this.db = db;

    this.selectAllUsers = this.db.prepare(`
      SELECT username, password, description, status FROM user_credentials
    `);

    this.selectUserByName = this.db.prepare(`
      SELECT username, password, description, status FROM user_credentials WHERE username = ?
    `);

    this.selectActiveUsers = this.db.prepare(`
      SELECT username, password, description, status FROM user_credentials WHERE status = 'active' AND username NOT IN ('performance_glitch_user');
    `);

    this.insertLog = this.db.prepare(`
      INSERT INTO test_log (test_name, status, duration_ms, error_message)
      VALUES (?, ?, ?, ?)
    `);

    this.recentLogs = this.db.prepare(
      `SELECT 
          test_name,
          status,
          duration_ms,
          error_message,
          datetime(run_date) as run_date
        FROM test_log 
        ORDER BY run_date DESC 
        LIMIT ?`
    );

    this.failedTests = this.db.prepare(
      `SELECT 
          test_name,
          error_message,
          datetime(run_date) as run_date
        FROM test_log 
        WHERE status = 'failed'
        ORDER BY run_date DESC 
        LIMIT ?`
    );

    this.testStats = this.db.prepare(
      `SELECT 
          COUNT(*) as total_tests,
          SUM(CASE WHEN status = 'passed' THEN 1 ELSE 0 END) as passed,
          SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed,
          SUM(CASE WHEN status = 'skipped' THEN 1 ELSE 0 END) as skipped,
          ROUND(AVG(duration_ms), 2) as avg_duration_ms,
          MIN(datetime(run_date)) as first_run,
          MAX(datetime(run_date)) as last_run
        FROM test_log`
    );
  }

  getAllUsers(): types.SauceDemoUser[] {
    return this.selectAllUsers.all() as types.SauceDemoUser[];
  }

  getUserByUsername(username: string): types.SauceDemoUser {
    return this.selectUserByName.get(username) as types.SauceDemoUser;
  }

  getActiveUsers(): types.SauceDemoUser[] {
    return this.selectActiveUsers.all() as types.SauceDemoUser[];
  }
}

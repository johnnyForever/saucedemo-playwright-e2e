import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'playwright.db');

class SqliteDB {
  private static instance: Database.Database;

  static getInstance(): Database.Database {
    if (!SqliteDB.instance) {
      try {
        SqliteDB.instance = new Database(dbPath, {
          verbose: process.env.DEBUG === 'true' ? console.log : undefined,
        });
      } catch (error) {
        console.error('Failed to initialize database:', error);
        throw new Error('Database initialization failed');
      }

      SqliteDB.instance.exec(`
        CREATE TABLE IF NOT EXISTS user_credentials (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          description TEXT NOT NULL,
          status TEXT NOT NULL,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP);

        CREATE INDEX IF NOT EXISTS idx_users ON user_credentials(username);
        CREATE INDEX IF NOT EXISTS idx_timestamp ON user_credentials(timestamp);

        CREATE TABLE IF NOT EXISTS test_log (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          test_name TEXT NOT NULL,
          status TEXT NOT NULL,
          duration_ms INTEGER,
          error_message TEXT,
          run_date DATETIME DEFAULT CURRENT_TIMESTAMP);

        CREATE INDEX IF NOT EXISTS idx_test_log_date ON test_log(run_date);
        CREATE INDEX IF NOT EXISTS idx_test_log_status ON test_log(status);`);

      const PASSWORD = process.env.PASSWORD;
      if (PASSWORD) {
        const insert = SqliteDB.instance.prepare(`
          INSERT OR IGNORE INTO user_credentials (username, password, description, status) VALUES 
          (?, ?, ?, ?)`);

        type SauceDemoUser = [username: string, password: string, description: string, status: string];

        const usersToInsert: SauceDemoUser[] = [
          ['standard_user', PASSWORD, 'standard', 'active'],
          ['locked_out_user', PASSWORD, 'locked', 'inactive'],
          ['problem_user', PASSWORD, 'problem', 'active'],
          ['performance_glitch_user', PASSWORD, 'glitch', 'active'],
          ['error_user', PASSWORD, 'error', 'active'],
          ['visual_user', PASSWORD, 'visual', 'active'],
          ['non_existing_user', 'password', 'non_existing', 'inactive'],
        ];
        usersToInsert.forEach((user) => insert.run(...user));
      } else {
        throw new Error('Environment variable PASSWORD is not set. No default users were inserted.');
      }
    }
    return SqliteDB.instance;
  }
}

export default SqliteDB;

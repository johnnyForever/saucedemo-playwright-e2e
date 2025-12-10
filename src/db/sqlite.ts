import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'playwright.db');

class SqliteDB {
  private static instance: Database.Database;

  static getInstance(): Database.Database {
    if (!SqliteDB.instance) {
      SqliteDB.instance = new Database(dbPath, {
        //verbose: console.log, // Only uncomment for debug
      });

      SqliteDB.instance.exec(`
        CREATE TABLE IF NOT EXISTS user_credentials (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          description TEXT NOT NULL,
          status TEXT NOT NULL,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP);

        CREATE INDEX IF NOT EXISTS idx_users ON user_credentials(username);
        CREATE INDEX IF NOT EXISTS idx_timestamp ON user_credentials(timestamp);`);

      const insert = SqliteDB.instance.prepare(`
        INSERT OR IGNORE INTO user_credentials (username, password, description, status) VALUES 
        (?, ?, ?, ?)`);

      type SauceDemoUser = [username: string, password: string, description: string, status: string];

      const usersToInsert: SauceDemoUser[] = [
        ['standard_user', process.env.PASSWORD!, 'standard', 'active'],
        ['locked_out_user', process.env.PASSWORD!, 'locked', 'inactive'],
        ['problem_user', process.env.PASSWORD!, 'problem', 'active'],
        ['performance_glitch_user', process.env.PASSWORD!, 'glitch', 'active'],
        ['error_user', process.env.PASSWORD!, 'error', 'active'],
        ['visual_user', process.env.PASSWORD!, 'visual', 'active'],
        ['non_existing_user', 'password', 'non_existing', 'inactive'],
      ];
      usersToInsert.forEach(user => insert.run(...user));
    }
    return SqliteDB.instance;
  }
}

export default SqliteDB;
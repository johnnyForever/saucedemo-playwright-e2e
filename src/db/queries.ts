import Database from 'better-sqlite3';
import { SauceDemoUser } from '@/types/users.ts';

export class UserQueries {
  private db: Database.Database;
  private selectAllUsers: Database.Statement;
  private selectUserByName: Database.Statement;
  private selectActiveUsers: Database.Statement;

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
  };

  getAllUsers(): SauceDemoUser[] {
    return this.selectAllUsers.all() as SauceDemoUser[];
  };

  getUserByUsername(username: string): SauceDemoUser | undefined {
    return this.selectUserByName.get(username) as SauceDemoUser | undefined;
  };

  getActiveUsers(): SauceDemoUser[] {
    return this.selectActiveUsers.all() as SauceDemoUser[];
  };
};
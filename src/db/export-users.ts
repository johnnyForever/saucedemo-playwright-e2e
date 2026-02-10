import SqliteDB from '@/db/sqlite.ts';
import { UserQueries } from '@/db/queries.ts';
import type { SauceDemoUser } from '@/types/index.ts';

function getUserOrThrow(q: UserQueries, username: string): SauceDemoUser {
  const user = q.getUserByUsername(username);
  if (!user) {
    throw new Error(`User '${username}' not found in database. Ensure the database is properly initialized.`);
  }
  return user;
}

export function loadUsers() {
  const db = SqliteDB.getInstance();
  const q = new UserQueries(db);

  const activeUsers = q.getActiveUsers();
  const standardUser = getUserOrThrow(q, 'standard_user');
  const lockedUser = getUserOrThrow(q, 'locked_out_user');
  const nonExistingUser = getUserOrThrow(q, 'non_existing_user');

  return {
    activeUsers,
    standardUser,
    lockedUser,
    nonExistingUser,
  };
}
import SqliteDB from '@/db/sqlite.ts';
import { UserQueries } from '@/db/queries.ts';

export function loadUsers() {
  const db = SqliteDB.getInstance();
  const q = new UserQueries(db);

  const activeUsers = q.getActiveUsers();
  const standardUser = q.getUserByUsername('standard_user')!;
  const lockedUser = q.getUserByUsername('locked_out_user')!;
  const nonExistingUser = q.getUserByUsername('non_existing_user')!;

  return {
    activeUsers,
    standardUser,
    lockedUser,
    nonExistingUser,
  };
}
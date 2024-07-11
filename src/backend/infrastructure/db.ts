import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema'
import * as path from 'node:path';

const sqlite = new Database(path.join(__dirname, './drizzle/sqlite.db'));
sqlite.pragma('journal_mode = WAL');

export const db = drizzle(sqlite, { schema });

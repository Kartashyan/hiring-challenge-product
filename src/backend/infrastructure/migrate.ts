import { db } from './db';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import * as path from 'node:path'

try {
    migrate(db, { migrationsFolder: path.join(__dirname, 'drizzle') });
} catch (error) {
    console.error("---migrate error---", error);
}
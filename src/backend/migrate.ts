import { db } from './db';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import * as path from 'node:path'

migrate(db, { migrationsFolder: path.join(__dirname, 'drizzle') });

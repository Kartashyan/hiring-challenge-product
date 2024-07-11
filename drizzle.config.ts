import type { Config } from 'drizzle-kit';
import path from 'node:path';

export default {
  schema: path.join(__dirname, './src/backend/infrastructure/schema.ts'),
  out: path.join(__dirname, './src/backend/infrastructure/drizzle'),
  driver: 'better-sqlite',
  dbCredentials: {
    url: path.join(__dirname, './src/backend/infrastructure/drizzle/sqlite.db'),
  },
  verbose: true,
} satisfies Config;

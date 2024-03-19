import type { Config } from 'drizzle-kit';

export default {
  schema: './src/backend/schema.ts',
  out: './src/backend/drizzle',
  driver: 'better-sqlite',
} satisfies Config;

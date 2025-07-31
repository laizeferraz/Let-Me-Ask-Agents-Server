import { defineConfig } from 'drizzle-kit';
import { env } from './src/env.ts';

export default defineConfig({
  schema: './src/db/schema/**.ts',
  dialect: 'postgresql',
  out: './src/db/migrations',
  dbCredentials: {
    // biome-ignore lint/style/noNonNullAssertion: the expression is needed for clarity
    url: env.DB_URL!,
  },
  casing: 'snake_case',
});

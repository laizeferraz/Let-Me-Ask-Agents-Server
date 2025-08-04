import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '../env';
import { schema } from './schema/index';

export const sql = postgres(env.DATABASE_URL);

// To test the connection, you can run a simple query like this:
// Uncomment the following lines to test the connection
// const result = await sql`SELECT 'HELLO' as greeting`;
// console.log(result);

export const db = drizzle(sql, {
  schema,
  casing: 'snake_case',
});

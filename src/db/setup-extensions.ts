import { sql } from './connection.ts';

export async function setupDatabaseExtensions() {
  try {
    // Enable the pgvector extension
    await sql`CREATE EXTENSION IF NOT EXISTS vector`;
  } catch (error) {
    throw new Error(`Failed to enable pgvector extension: ${error}`);
  }
}

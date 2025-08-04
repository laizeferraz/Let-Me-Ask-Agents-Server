import { reset, seed } from 'drizzle-seed';
import { db, sql } from './connection.js';
import { schema } from './schema/index.js';

await reset(db, schema);
await seed(db, schema).refine((f) => {
  return {
    rooms: {
      count: 5,
      columns: {
        name: f.companyName(),
        description: f.loremIpsum(),
      },
      with: {
        questions: 5,
      },
    },
  };
});

await sql.end();

// biome-ignore lint/suspicious/noConsole: only for development
console.log('Database has been reset and seeded successfully.');

import { app } from './app.ts';
import { setupDatabaseExtensions } from './db/setup-extensions.ts';
import { env } from './env.ts';

async function startServer() {
  try {
    // Setup database extensions before starting server
    await setupDatabaseExtensions();

    if (env.NODE_ENV !== 'production') {
      await app.listen({ port: env.PORT, host: '0.0.0.0' });
    }
  } catch (error) {
    app.log.error('Failed to start server:', error);
    process.exit(1);
  }
}

if (env.NODE_ENV !== 'production') {
  startServer();
}

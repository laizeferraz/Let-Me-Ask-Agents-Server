import type { VercelRequest, VercelResponse } from '@vercel/node';
import { app } from '../src/app';
import { setupDatabaseExtensions } from '../src/db/setup-extensions';

let isExtensionSetup = false;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Setup database extensions only once
    if (!isExtensionSetup) {
      await setupDatabaseExtensions();
      isExtensionSetup = true;
    }

    await app.ready();
    app.server.emit('request', req, res);
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
}

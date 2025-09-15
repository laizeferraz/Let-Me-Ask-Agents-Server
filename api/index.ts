import type { VercelRequest, VercelResponse } from '@vercel/node';
import { app } from '../src/app';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await app.ready();
    app.server.emit('request', req, res);
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
}

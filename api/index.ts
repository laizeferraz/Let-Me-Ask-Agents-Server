import type { VercelRequest, VercelResponse } from '@vercel/node';
// biome-ignore lint/performance/noNamespaceImport: <explanation>
import * as dotenv from 'dotenv';
import app from '../src/server.js';

dotenv.config();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await app.ready();
  app.server.emit('request', req, res);
}

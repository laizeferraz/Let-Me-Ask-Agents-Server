import app from '../src/server.ts';

export default async (req, res) => {
  await app.ready();
  app.server.emit('request', req, res);
};

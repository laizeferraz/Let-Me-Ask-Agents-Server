import app from '../src/server.ts';

export default async function handler(req: any, res: any) {
  try {
    console.log('Serverless function called:', req.method, req.url);

    await app.ready();
    console.log('App is ready');

    app.server.emit('request', req, res);
  } catch (error) {
    console.error('Serverless function error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
}

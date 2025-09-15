import { app } from './app.ts';
import { env } from './env.ts';

if (env.NODE_ENV !== 'production') {
  app.listen({ port: env.PORT, host: '0.0.0.0' });
}

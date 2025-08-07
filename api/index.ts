import Fastify from 'fastify';

const app = Fastify({
  logger: true,
});

app.get('/', async (request, reply) => {
  return await reply.status(200).send();
});

export default async function handler(req, reply) {
  await app.ready();
  app.server.emit('request', req, reply);
}

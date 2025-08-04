import { fastifyCors } from '@fastify/cors';
import { fastifyMultipart } from '@fastify/multipart';
// To test the database connection, you can uncomment the import below
// import { sql } from './db/connection.js';
import { fastify } from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { env } from './env.js';
import { createQuestionRoute } from './http/routes/create-question.js';
import { createRoomRoute } from './http/routes/create-room.js';
import { getRoomQuestionsRoute } from './http/routes/get-room-questions.js';
import { getRoomsRoute } from './http/routes/get-rooms.js';
import { updateQuestionAnsweredRoute } from './http/routes/update-question-answered.js';
import { uploadAudioRoute } from './http/routes/upload-audio.js';

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, {
  origin: ['http://localhost:5173', 'https://let-me-ask-agents-web.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
});

app.register(fastifyMultipart);

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.get('/health', () => {
  return { status: 'ok' };
});

app.register(getRoomsRoute);
app.register(createRoomRoute);
app.register(getRoomQuestionsRoute);
app.register(createQuestionRoute);
app.register(updateQuestionAnsweredRoute);
app.register(uploadAudioRoute);

if (env.NODE_ENV !== 'production') {
  app.listen({
    port: env.PORT,
    host: '0.0.0.0',
  });
}

// Export the app for Vercel serverless function
export default app;

import { fastifyCors } from '@fastify/cors';
import { fastifyMultipart } from '@fastify/multipart';
import { fastify } from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod';
// To test the database connection, you can uncomment the import below
// import { sql } from './db/connection.ts';
import { env } from './env.ts';
import { createQuestionRoute } from './http/routes/create-question.ts';
import { createRoomRoute } from './http/routes/create-room.ts';
import { getRoomQuestionsRoute } from './http/routes/get-room-questions.ts';
import { getRoomsRoute } from './http/routes/get-rooms.ts';
import { updateQuestionAnsweredRoute } from './http/routes/update-question-answered.ts';
import { uploadAudioRoute } from './http/routes/upload-audio.ts';

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, {
  origin: ['http://localhost:5173', 'https://your-frontend-app.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
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

if (env.NODE_ENV === 'production') {
  // For Vercel deployment
  app.listen({
    port: 0, // Vercel assigns the port
    host: '0.0.0.0',
  });
} else {
  app.listen({
    port: env.PORT,
  });
}

// Export for Vercel
export default app;

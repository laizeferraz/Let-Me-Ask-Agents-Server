import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import { z } from 'zod/v4';
import { db } from '../../db/connection.ts';
import { schema } from '../../db/schema/index.ts';
import { generateEmbeddings, transcribeAudio } from '../../services/gemini.ts';

export const uploadAudioRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/rooms/:roomId/audio',
    {
      schema: {
        params: z.object({
          roomId: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { roomId } = request.params;
      const audio = await request.file();

      if (!audio) {
        throw new Error('Audio is required');
      }

      const audioBuffer = await audio.toBuffer();
      const audioAsbase64 = audioBuffer.toString('base64');

      const transcription = await transcribeAudio(
        audioAsbase64,
        audio.mimetype
      );

      const embeddings = await generateEmbeddings(transcription);

      const result = await db
        .insert(schema.audioChunks)
        .values({
          roomId,
          transcription,
          embeddings,
        })
        .returning();

      const chunk = result[0];

      if (!chunk) {
        throw new Error('Error saving audio chunk.');
      }

      return reply.status(201).send({ chunkId: chunk.id });
    }
  );
};
// This route allows users to create a new question in a specific room.
// It requires the room ID as a URL parameter and the question text in the request body.
// The question must be a non-empty string. If the question is successfully created,
// it returns the ID of the newly created question with a 201 status code.
// If the creation fails, it throws an error indicating the failure to create the question.

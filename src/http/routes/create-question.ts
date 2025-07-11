import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import { z } from 'zod/v4';
import { db } from '../../db/connection.ts';
import { schema } from '../../db/schema/index.ts';

export const createQuestionRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/rooms/:roomId/questions',
    {
      schema: {
        params: z.object({
          roomId: z.string(),
        }),
        body: z.object({
          question: z.string().min(1, 'Question is required'),
        }),
      },
    },
    async (request, reply) => {
      const { roomId } = request.params;
      const { question } = request.body;

      const result = await db
        .insert(schema.questions)
        .values({
          roomId,
          question,
        })
        .returning();

      const insertedQuestion = result[0];

      if (!insertedQuestion) {
        throw new Error('Failed to create question.');
      }
      return reply.status(201).send({ questionId: insertedQuestion.id });
    }
  );
};
// This route allows users to create a new question in a specific room.
// It requires the room ID as a URL parameter and the question text in the request body.
// The question must be a non-empty string. If the question is successfully created,
// it returns the ID of the newly created question with a 201 status code.
// If the creation fails, it throws an error indicating the failure to create the question.

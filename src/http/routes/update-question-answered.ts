import { eq } from 'drizzle-orm';
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import { z } from 'zod/v4';
import { db } from '../../db/connection';
import { schema } from '../../db/schema/index';

export const updateQuestionAnsweredRoute: FastifyPluginCallbackZod = (app) => {
  app.patch(
    '/rooms/:roomId/questions/:questionId/highlight',
    {
      schema: {
        params: z.object({
          roomId: z.string(),
          questionId: z.string(),
        }),
        body: z.object({
          isQuestionAnswered: z.boolean(),
        }),
      },
    },
    async (request, reply) => {
      const { questionId } = request.params;
      const { isQuestionAnswered } = request.body;

      const result = await db
        .update(schema.questions)
        .set({
          isQuestionAnswered,
        })
        .where(eq(schema.questions.id, questionId))
        .returning();

      const updatedQuestion = result[0];

      if (!updatedQuestion) {
        return reply.status(404).send({ error: 'Question not found' });
      }

      return reply.send({
        questionId: updatedQuestion.id,
        isQuestionAnswered: updatedQuestion.isQuestionAnswered,
      });
    }
  );
};

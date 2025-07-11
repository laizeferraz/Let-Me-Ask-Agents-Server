import { desc, eq } from 'drizzle-orm';
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import { z } from 'zod/v4';
import { db } from '../../db/connection.ts';
import { schema } from '../../db/schema/index.ts';

export const getRoomQuestionsRoute: FastifyPluginCallbackZod = (app) => {
  app.get(
    '/rooms/:roomId/questions',
    {
      schema: {
        params: z.object({
          roomId: z.string(),
        }),
      },
    },
    async (request) => {
      const { roomId } = request.params;

      const questions = await db
        .select({
          id: schema.questions.id,
          question: schema.questions.question,
          answer: schema.questions.answer,
          createdAt: schema.questions.createdAt,
        })
        .from(schema.questions)
        .where(eq(schema.questions.roomId, roomId))
        .orderBy(desc(schema.questions.createdAt));

      return questions;
    }
  );
};

// This route retrieves all questions for a specific room identified by `roomId`.
// It uses the `roomId` from the request parameters to filter questions in the database.
// The questions are returned in descending order based on their creation date.
// The response includes the question ID, text, answer, and creation date for each question.
// If no questions are found for the specified room, an empty array is returned.
// The route is defined with a GET method and expects the `roomId` to be provided in the URL parameters.
// The schema validation ensures that `roomId` is a string, which is required for the query to execute correctly.
// If the room does not exist or has no questions, it will return an empty array without throwing an error.
// This allows the client to handle the response gracefully, even when there are no questions available for the specified room.
// The route is registered with Fastify, allowing it to be accessed via the specified endpoint.
// The response format is consistent with the structure defined in the schema, ensuring type safety and validation.
// This route is useful for clients that need to display questions related to a specific room, such as
// in a chat application or a Q&A platform where users can ask and answer questions within designated rooms.
// It provides a straightforward way to fetch and display questions, enhancing the user experience by organizing content
// within rooms and allowing for easy navigation and interaction.
// The route is designed to be efficient, leveraging the database's indexing and query capabilities to quickly retrieve
// the relevant questions for the specified room. This ensures that even with a large number of rooms and questions,
// the performance remains optimal, providing a smooth experience for users accessing the questions.
// The use of `desc` for ordering ensures that the most recent questions appear first, which is typically the desired behavior
// in applications where users are interested in the latest interactions.
// This route is part of a larger application that manages rooms and questions, allowing users to create rooms,
// ask questions, and receive answers in a structured manner. It plays a crucial role in enabling
// real-time interactions and discussions within the application, fostering engagement and collaboration among users.

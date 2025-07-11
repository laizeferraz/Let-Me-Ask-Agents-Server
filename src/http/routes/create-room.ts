import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import { z } from 'zod/v4';
import { db } from '../../db/connection.ts';
import { schema } from '../../db/schema/index.ts';

export const createRoomRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/rooms',
    {
      schema: {
        body: z.object({
          name: z.string().min(1, 'Room name is required'),
          description: z.string().optional(),
        }),
      },
    },
    async (request, reply) => {
      const { name, description } = request.body;

      const result = await db
        .insert(schema.rooms)
        .values({
          name,
          description,
        })
        .returning();

      const insertedRoom = result[0];

      if (!insertedRoom) {
        throw new Error('Failed to create room.');
      }
      return reply.status(201).send({ roomId: insertedRoom.id });
    }
  );
};
// This route allows users to create a new room.
// It requires the room name and an optional description in the request body.
// The room name must be a non-empty string. If the room is successfully created,
// it returns the ID of the newly created room with a 201 status code.
// If the creation fails, it throws an error indicating the failure to create the room.
// The route is defined with a POST method and expects the room details to be provided in the
// request body. The schema validation ensures that the room name is provided and meets the minimum length requirement.
// The response format is consistent with the structure defined in the schema, ensuring type safety and validation.
// This route is useful for clients that need to create new rooms, such as in a chat application
// or a collaborative platform where users can create spaces for discussions or activities.
// It provides a straightforward way to create and manage rooms, enhancing the user experience by allowing users
// to organize content and interactions within designated spaces.
// The route is registered with Fastify, allowing it to be accessed via the specified endpoint.
// The response includes the room ID of the newly created room, which can be used for further interactions,
// such as adding questions or participants to the room.
// The use of `returning()` ensures that the newly created room's details are returned immediately
// after creation, allowing the client to receive confirmation and relevant information without needing to query the database
// again. This improves the efficiency of the operation and provides a seamless user experience.
// The route is part of a larger application that manages rooms and questions, allowing users to create
// rooms, ask questions, and receive answers in a structured manner. It plays a crucial role
// in enabling real-time interactions and discussions within the application, fostering engagement and collaboration among users.
// The route is designed to be efficient, leveraging the database's indexing and query capabilities to quickly
// create new rooms. This ensures that even with a large number of rooms, the performance remains optimal,
// providing a smooth experience for users creating new rooms.
// The route is part of a broader system that may include features like room management, user participation
// tracking, and question management, allowing for a comprehensive and interactive platform.

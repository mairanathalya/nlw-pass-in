import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/check-in.ts
import { z } from "zod";
async function checkin(app) {
  app.withTypeProvider().get("/attendees/:attendeeId/check-in", {
    schema: {
      summary: "Check-in an attendee",
      tags: ["check-ins"],
      params: z.object({
        attendeeId: z.coerce.number().int()
      }),
      response: {
        201: z.null()
      }
    }
  }, async (request, reply) => {
    const { attendeeId } = request.params;
    const attendeesCheckIn = await prisma.checkIn.findUnique({
      where: {
        attendeeId
      }
    });
    if (attendeesCheckIn !== null) {
      throw new Error("Attendee already checked in!");
    }
    await prisma.checkIn.create({
      data: {
        attendeeId
      }
    });
    return reply.status(201).send();
  });
}

export {
  checkin
};

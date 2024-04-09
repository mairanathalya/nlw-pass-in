import {
  BadRequest
} from "./chunk-5B4TKFIG.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/register-for-event.ts
import { z } from "zod";
async function registerForEvent(app) {
  app.withTypeProvider().post("/events/:eventId/attendees", {
    schema: {
      summary: "Register an attendee",
      tags: ["attendees"],
      body: z.object({
        name: z.string().min(4),
        email: z.string().email()
      }),
      params: z.object({
        eventId: z.string().uuid()
      }),
      response: {
        201: z.object({
          attendeesId: z.number()
        })
      }
    }
  }, async (request, reply) => {
    const { eventId } = request.params;
    const { name, email } = request.body;
    const attendeeFromEmail = await prisma.attendee.findUnique({
      where: {
        eventId_email: {
          email,
          eventId
        }
      }
    });
    if (attendeeFromEmail != null) {
      throw new BadRequest("This e-mail is already registered for this event.");
    }
    const [event, amountOfAttendeesForEvent] = await Promise.all([
      prisma.event.findUnique({
        //busca o dado do evento
        where: {
          id: eventId
        }
      }),
      prisma.attendee.count({
        //tem o dado do evento
        where: {
          eventId
        }
      })
    ]);
    if (event?.maximumAttendees && amountOfAttendeesForEvent >= event.maximumAttendees) {
      throw new BadRequest("The maximun number of attendees for this event has been reached.");
    }
    const attendee = await prisma.attendee.create({
      data: {
        name,
        email,
        eventId
      }
    });
    return reply.status(201).send({ attendeesId: attendee.id });
  });
}

export {
  registerForEvent
};

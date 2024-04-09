import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { BadRequest } from "./_error/bad-request";

//record structure
export async function registerForEvent( app: FastifyInstance){
    app
        .withTypeProvider<ZodTypeProvider>()
        .post('/events/:eventId/attendees', {
            schema: {
                summary:'Register an attendee',
                tags: ['attendees'],
                body: z.object({
                   name: z.string().min(4),
                   email: z.string().email(),                  
                }),
                params: z.object({
                    eventId: z.string().uuid(),
                }),
                response: {
                    201: z.object({
                        attendeesId: z.number(),
                    })
                }
            }

        }, async (request, reply) => { 
            //route structure
            const { eventId } = request.params
            const { name, email} = request.body

            const attendeeFromEmail = await prisma.attendee.findUnique({
                where: {
                    eventId_email : {
                        email,
                        eventId,
                    }
                }
            })

            if (attendeeFromEmail != null) {
                throw new BadRequest ('This e-mail is already registered for this event.')
            }

            const [event , amountOfAttendeesForEvent] = await Promise.all([
                prisma.event.findUnique({
                    //search event data
                    where: {
                        id: eventId,
                    }
                }),
                //has the data
                prisma.attendee.count({
                    where: {
                        eventId,
                    }
                })
            ])

            if (event?.maximumAttendees && amountOfAttendeesForEvent >= event.maximumAttendees){
                throw new BadRequest ('The maximun number of attendees for this event has been reached.')
            }

            const attendee = await prisma.attendee.create({
                data:{
                    name,
                    email,
                    eventId,
                }
            })
            return reply.status(201).send({attendeesId: attendee.id})
        })
}
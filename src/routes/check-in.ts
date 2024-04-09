import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function checkin ( app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .get('/attendees/:attendeeId/check-in', {
            schema: {
                summary:'Check-in an attendee',
                tags: ['check-ins'],
                params: z.object({
                   attendeeId: z.coerce.number().int(), 
                }),
                response: {
                    201: z.null(),
                }
            }
        } , async (request, reply) => {

            const { attendeeId } = request.params
            //if an id that checked in is found in DB 
            const attendeesCheckIn = await prisma.checkIn.findUnique({
                where:{
                    attendeeId,
                }
            })
            //return this message
            if (attendeesCheckIn !== null){
                throw new Error ('Attendee already checked in!')
            }
            //if not, create a record in the check-in table by filling in the attendeeId
            await prisma.checkIn.create({
                data:{
                    attendeeId,
                }
            })
            return reply.status(201).send()
    })
}
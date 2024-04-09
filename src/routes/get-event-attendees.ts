import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { number, z } from "zod";
import { prisma } from "../lib/prisma";

export async function getEventAttendees( app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider> ()
    .get('/events/:eventId/attendees', {
        schema: {
            summary:'Get event attendees',
                tags: ['attendees'],
            params: z.object({
                eventId: z.string().uuid(),
            }),
            querystring: z.object({//paging the data
                query: z.string().nullish(),//filter to searche for participants
                pageIndex: z.string().nullish().default('0').transform(Number),
            }),
            response: {
                200: z.object({
                    attendees: z.array(
                        z.object({
                            id: z.number(),
                            name: z.string(),
                            email: z.string().email(),
                            createAt: z.date(),
                            checkedInAt: z.date().nullable(),
                        })
                    ),
                    total: z.number(),
                }),
            },
        }
    } , async (request, reply) => {
        
        const { eventId } = request.params
        const { pageIndex , query } = request.query
          

        const [attendees, total] = await Promise.all([
            prisma.attendee.findMany({
                select: {
                    id: true,
                    name:true,
                    email:true,
                    createdAt: true,
                    checkIn: {
                        select:{
                            createdAt: true,
                        }
                    }               
                },
                where:  query ?{//query for search 
                    eventId, //if there was a search, it will have the event id and the name containing the query
                    name: {
                        contains: query,
                    }
                } : {
                    eventId, //if you don't have the search, just return the event id
                },
                take: 10, //paging scheme 
                skip: pageIndex * 10, //showing a list of 10 participants for every 10 participants
                orderBy: {
                    createdAt: 'desc',
                }
            }),
            prisma.attendee.count({
                where : query ? {
                    eventId,
                    name: {
                        contains: query,
                    }
                  } : {
                    eventId,
                },
            })
        ]) 

        return reply.send({ 
            attendees: attendees.map(attendee => {
                return{ 
                    id: attendee.id,
                    name: attendee.name,
                    email: attendee.email,
                    createAt: attendee.createdAt,
                    checkedInAt: attendee.checkIn?.createdAt ?? null,
                }
            }),
            total,
        })
    })       
}

import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/get-event-attendees.ts
import { z } from "zod";
async function getEventAttendees(app) {
  app.withTypeProvider().get("/events/:eventId/attendees", {
    schema: {
      summary: "Get event attendees",
      tags: ["events"],
      params: z.object({
        eventId: z.string().uuid()
      }),
      querystring: z.object({
        //está fazendo paginação com os dados
        query: z.string().nullish(),
        //filtro para buscar participantes
        pageIndex: z.string().nullish().default("0").transform(Number)
      }),
      response: {
        200: z.object({
          attendees: z.array(
            z.object({
              id: z.number(),
              name: z.string(),
              email: z.string().email(),
              createAt: z.date(),
              checkedInAt: z.date().nullable()
            })
          )
        })
      }
    }
  }, async (request, reply) => {
    const { eventId } = request.params;
    const { pageIndex, query } = request.query;
    const attendees = await prisma.attendee.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        checkIn: {
          select: {
            createdAt: true
          }
        }
      },
      where: query ? {
        //query para caso tenha uma busca 
        eventId,
        //caso tenha a busca, vai buscar pelo event id tanto quanto o nome contendo a query
        name: {
          contains: query
        }
      } : {
        eventId
        //caso não tenha a busca, vai ser só pelo event id
      },
      take: 10,
      //esquema de paginação 
      skip: pageIndex * 10,
      //mostrar na lista 10 a cada 10 participantes
      orderBy: {
        createdAt: "desc"
      }
    });
    return reply.send({
      attendees: attendees.map((attendee) => {
        return {
          //para deixar o visual da requisição com uma visibilidade melhor
          id: attendee.id,
          name: attendee.name,
          email: attendee.email,
          createAt: attendee.createdAt,
          checkedInAt: attendee.checkIn?.createdAt ?? null
        };
      })
    });
  });
}

export {
  getEventAttendees
};

import { FastifyInstance } from "fastify";
import { BadRequest } from "./routes/_error/bad-request";
import { ZodError } from "zod";

type FastifyErrorHandler = FastifyInstance ['errorHandler']

export const errorHandler : FastifyErrorHandler = (error, request, reply ) => {
    //if there is a validation error
    if ( error instanceof ZodError) {  
        return reply.status(400).send({
            message: `Error during validation`,
            errors: error.flatten().fieldErrors,
        })
    }
    //if the error was caused by the bad request class
     if (error instanceof BadRequest){
        return reply.status(400).send({message: error.message })

     }
    return reply.status(500).send({message: 'Internal server error!'})
}
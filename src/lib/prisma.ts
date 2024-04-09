import { PrismaClient } from '@prisma/client'


//DB connection
export const prisma = new PrismaClient({
    log: ['query'],
})
import { PrismaClient } from "./generated/prisma/client";

export default new PrismaClient({ datasourceUrl: process.env.DATABASE_URL });
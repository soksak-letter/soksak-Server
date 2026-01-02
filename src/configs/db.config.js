import { PrismaClient } from "@prisma/client";
import { createClient } from "redis";

export const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  },
  password: process.env.REDIS_PASSWORD
});

redisClient.on('error', err => console.log('Redis Client Error', err));
await redisClient.connect();

export const redis = redisClient; 
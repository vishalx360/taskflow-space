import { Prisma, PrismaClient } from "@prisma/client";
import { createPrismaRedisCache } from "prisma-redis-middleware";
import superjson from "superjson";

import { env } from "@/env.mjs";
import { redisClient } from "@/lib/redisClient";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });



const cacheMiddleware: Prisma.Middleware = createPrismaRedisCache({
  models: [],
  storage: { type: "redis", options: { client: redisClient, invalidation: { referencesTTL: 300 }, } },
  cacheTime: 500,
  transformer: {
    serialize: (result) => superjson.serialize(result),
    deserialize: (serialized) => superjson.deserialize(serialized),
  },
  onHit: (key) => {
    console.log("hit", key);
  },
  onMiss: (key) => {
    console.log("miss", key);
  },
  onError: (key) => {
    console.log("error", key);
  },
});

prisma.$use(cacheMiddleware);

if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

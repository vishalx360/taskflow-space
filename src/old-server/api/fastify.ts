// import ws from '@fastify/websocket';
import type { FastifyCookieOptions } from "@fastify/cookie";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import FastifyRateLimit from "@fastify/rate-limit";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import dotenv from "dotenv";
import fastify from "fastify";
import superjson from "superjson";

import { env } from "../../env.mjs";
import { createTRPCContext } from "./fastify_trpc.js";
import { appRouter } from "./root";

dotenv.config();

export interface ServerOptions {
  dev?: boolean;
  port?: number;
  prefix?: string;
}

export function createServer(opts: ServerOptions) {
  const dev = opts.dev ?? true;
  const port = opts.port ?? 3000;
  const prefix = opts.prefix ?? "/trpc";
  const server = fastify({ maxParamLength: 5000, logger: dev });

  void server.register(FastifyRateLimit, {
    max: 150,
    timeWindow: "1 minute",
    errorResponseBuilder: function (request, context) {
      return [
        {
          error: superjson.serialize({
            message: "Too Many Requests",
            code: 32009,
            data: {
              code: "TOO_MANY_REQUESTS",
              httpStatus: 429,
              stack: "...",
              path: request.url,
            },
          }),
        },
      ];
    },
  });

  // void server.register(ws);

  void server.register(cookie, {
    secret: env.NEXTAUTH_SECRET, // for cookies signature
    parseOptions:
      env.NODE_ENV === "development"
        ? {
          // signed: true,
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          secure: false,
          domain: "localhost",
        }
        : {
          signed: true,
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          secure: true,
          domain: `.${env.DOMAIN_NAME}`,
        }, // options for parsing cookies
  } as FastifyCookieOptions);

  void server.register(cors, {
    origin:
      env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : new RegExp(`(\https://\.${env.DOMAIN_NAME}|${env.DOMAIN_NAME})$`),
    credentials: true,
  });

  void server.register(fastifyTRPCPlugin, {
    prefix,
    // useWSS: true,
    trpcOptions: { router: appRouter, createContext: createTRPCContext },
  });

  server.get("/", (req) => {
    return { message: "Server Running..." };
  });
  server.get("/health-check", async (req, reply) => {
    console.log("Health Check ");
    await reply.status(200).send({ message: "Server Running..." });
  });

  const stop = async () => {
    await server.close();
  };
  const start = async () => {
    try {
      await server.listen({ port });
      console.log(`Server running on http://localhost:${port}`);
    } catch (err) {
      server.log.error(err);
      process.exit(1);
    }
  };

  return { server, start, stop };
}

const serverConfig: ServerOptions = {
  dev: true,
  port: env.PORT ? parseInt(env.PORT) : 3001,
  prefix: "/trpc",
};

const server = createServer(serverConfig);
void server.start();

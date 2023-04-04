import { type inferAsyncReturnType } from '@trpc/server';
import { type CreateFastifyContextOptions, fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import dotenv from "dotenv";
import fastify from 'fastify';
// import ws from '@fastify/websocket';
import { z } from 'zod';

dotenv.config();

import { prisma } from "../db";

import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { SendEmail } from '../../utils/SendEmail';

const t = initTRPC.context<Context>().create(
    // {transformer: superjson}

);

export const router = t.router;
export const publicProcedure = t.procedure;

/** Reusable middleware that enforces users are logged in before running the procedure. */
const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
    // TODO: check if user is authenticated
    return next()
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);


export function createContext({ req, res }: CreateFastifyContextOptions) {
    // TODO: provide session value
    const session = { user: { name: "abcd" } }
    return { req, res, session, prisma, sendEmail: SendEmail };
}

export type Context = inferAsyncReturnType<typeof createContext>;




const appRouter = t.router({
    create: publicProcedure
        .input(z.object({
            title: z.string(),
            description: z.string(),
        }))
        .mutation(({ input, ctx }) => {
            return ctx.prisma.posts.create({
                data: {
                    title: input.title,
                    description: input.description
                }
            })
        }),
    read: publicProcedure.input(z.object({
        id: z.string(),
    })).query(({ ctx, input }) => {
        return ctx.prisma.posts.findUnique({ where: { id: input.id } })
    }),
    update: publicProcedure.input(z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
    })).mutation(({ ctx, input }) => {
        return ctx.prisma.posts.update({
            where: { id: input.id },
            data: { title: input.title, description: input.description }
        })
    }),
    delete: publicProcedure.input(z.object({
        id: z.string(),
    })).mutation(({ ctx, input }) => { return ctx.prisma.posts.delete({ where: { id: input.id } }) }),

    list: publicProcedure.query(({ ctx }) => { return ctx.prisma.posts.findMany() }),
    reset: publicProcedure.mutation(({ ctx }) => { return ctx.prisma.posts.deleteMany() })
});


export interface ServerOptions {
    dev?: boolean;
    port?: number;
    prefix?: string;
}

export function createServer(opts: ServerOptions) {
    const dev = opts.dev ?? true;
    const port = opts.port ?? 3000;
    const prefix = opts.prefix ?? '/trpc';
    const server = fastify({ maxParamLength: 5000, logger: dev });

    // void server.register(ws);
    void server.register(fastifyTRPCPlugin, {
        prefix,
        // useWSS: true,
        trpcOptions: { router: appRouter, createContext },
    });

    server.get('/', () => {
        return { message: 'Server Running...' };
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


// process.env.PORT TODO
const serverConfig: ServerOptions = {
    dev: false,
    port: 2022,
    prefix: '/trpc',
};


const server = createServer(serverConfig);
void server.start();

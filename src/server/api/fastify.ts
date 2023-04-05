import { type inferAsyncReturnType } from '@trpc/server';
import { fastifyTRPCPlugin, type CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';
import dotenv from "dotenv";
import fastify from 'fastify';
// import ws from '@fastify/websocket';
import { z } from 'zod';
dotenv.config();
import { prisma } from "../db";
import type { FastifyCookieOptions } from '@fastify/cookie';
import cookie from '@fastify/cookie';
import { initTRPC } from '@trpc/server';
import { SendEmail } from '../../utils/SendEmail';
import { env } from '../../env.mjs';
import jwt from "jsonwebtoken"
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

    void server.register(cookie, {
        secret: env.NEXTAUTH_SECRET, // for cookies signature
        parseOptions: {
            signed: true,
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
            secure: true,
            domain: `.${env.DOMAIN_NAME}`
        }     // options for parsing cookies
    } as FastifyCookieOptions)

    void server.register(fastifyTRPCPlugin, {
        prefix,
        // useWSS: true,
        trpcOptions: { router: appRouter, createContext },

    });

    server.get('/', () => {
        return { message: 'Server Running...' };
    });
    server.get('/cookie', (req, reply) => {
        const nextAuthCokieRaw = req.cookies["__Secure-next-auth.session-token"]
        // `reply.unsignCookie()` is also available
        const cookie = nextAuthCokieRaw ? jwt.verify(nextAuthCokieRaw, env.NEXTAUTH_SECRET) : "Not Signed In";
        return reply
            .setCookie('foo', 'bar', {
                path: '/',
                signed: true
            })
            .send({ cookie })
    })

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
    dev: false,
    port: parseInt(env.PORT || "2022"),
    prefix: '/trpc',
};


const server = createServer(serverConfig);
void server.start();

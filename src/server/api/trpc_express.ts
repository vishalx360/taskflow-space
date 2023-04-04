import { initTRPC, type inferAsyncReturnType } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import express from "express";
import { z } from 'zod';
import dotenv from 'dotenv';
dotenv.config();
import { prisma } from "~/server/db";
import { SendEmail } from '~/utils/SendEmail';
// created for each request
// init dotenv wiht import syntax

const createContext = ({
    req,
    res,
}: trpcExpress.CreateExpressContextOptions) => {
    // TODO-NEXT: add custom encode and decode in next-auth to decode token and get user session
    return {
        req,
        res,
        prisma,
        sendEmail: SendEmail
    };
};
type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create();
export const publicProcedure = t.procedure;

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
    })).mutation(({ ctx, input }) => {
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

// export type definition of API
export type AppRouter = typeof appRouter;

const app = express();

const PORT = process.env.PORT || 4000;

app.use(
    '/trpc',
    trpcExpress.createExpressMiddleware({
        router: appRouter,
        createContext,
    }),
);

app.listen(PORT, () => { console.log(`TRPC on express server started on port https://localhost:${PORT}`) });
import { type CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';
// import ws from '@fastify/websocket';
import { type Session } from "next-auth";
import { env } from '../../env.mjs';
import { verifyJWT } from "../../utils/jwt";
import { SendEmail } from '../../utils/SendEmail';
import { prisma } from "../db";

import dotenv from "dotenv";
dotenv.config();

type CreateContextOptions = {
    session: Session | null;
    req: FastifyRequestType;
    res: FastifyReplyType;
};

const createInnerTRPCContext = (opts: CreateContextOptions) => {
    return {
        req: opts.req,
        res: opts.res,
        session: opts.session,
        prisma,
        sendEmail: SendEmail
    };
};


export async function createTRPCContext({ req, res }: CreateFastifyContextOptions) {
    const session = await getAuthSession({ req, res })
    return createInnerTRPCContext({
        req, res,
        session,
    });
}


import { initTRPC, TRPCError } from '@trpc/server';
import { FastifyReplyType, FastifyRequestType } from 'fastify/types/type-provider.js';
import superjson from "superjson";

const t = initTRPC.context<typeof createTRPCContext>().create(
    {
        transformer: superjson,
        errorFormatter({ shape }) {
            return shape;
        },
    }
);

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

/** Reusable middleware that enforces users are logged in before running the procedure. */
const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
    if (!ctx.session || !ctx.session.user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next({
        ctx: {
            // infers the `session` as non-nullable
            session: { ...ctx.session, user: ctx.session.user },
        },
    });
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);



export async function getAuthSession({ req, res }: CreateFastifyContextOptions): Promise<Session | null> {
    const token = req.cookies["__Secure-next-auth.session-token"]
    if (token) {
        try {
            const decoded = await verifyJWT(token, env.NEXTAUTH_SECRET);
            return {
                user: {
                    id: decoded.id,
                    name: decoded.name,
                    email: decoded.email,
                    image: decoded.image,
                },
                expires: decoded.exp
            }

        } catch (err) {
            console.log(err)
            return null;
        }

    }
    return null;
}




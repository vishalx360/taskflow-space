import Credentials from "@auth/core/providers/credentials";
import GoogleProvider from '@auth/core/providers/google';
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { verify } from "argon2";
import { type FastifyRegisterOptions } from "fastify";
import { type AuthConfig } from "fastify-next-auth";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";
import SeedPersonalWorkspace from '~/utils/SeedPersonalWorkspace';

import { SigninSchema } from '~/utils/ValidationSchema';


export const fastifyAuthOptions: FastifyRegisterOptions<AuthConfig> = {
    cookies: {
        sessionToken: {
            name: `__Secure-next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: true,
                domain: `.${env.DOMAIN_NAME}`
            }
        },
    },
    secret: env.NEXTAUTH_SECRET,
    callbacks: {
        session: ({ session, token }) => {
            if (token) {
                session.user = {
                    ...session.user,
                    ...token,
                };
            }
            return session;
        },

        jwt: async ({ token, user, isNewUser }) => {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                // seed personal workspace with default board with list and taks
                if (isNewUser) {
                    // check if account doesnt exist with same email
                    const emailExist = await prisma.user.count({
                        where: { email: user.email },
                    });
                    if (emailExist === 0) {
                        await SeedPersonalWorkspace(user.id);
                    }
                }
            }
            return token;
        },
    },
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
    },

    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "name@company.com",
                },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                const creds = await SigninSchema.parseAsync(credentials);
                console.log(creds);

                const user = await prisma.user.findFirst({
                    where: { email: creds.email },
                });

                if (!user || !user.password) {
                    throw new Error("User not found");
                }

                const isValidPassword = await verify(user.password, creds.password);

                if (!isValidPassword) {
                    throw new Error("Invalid credentials");
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                };
            },
        }),
        GoogleProvider({
            allowDangerousEmailAccountLinking: true,
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                },
            },
        }),
    ],
    jwt: {
        maxAge: 30 * 24 * 30 * 60, // 15 days
    },
    pages: {
        signIn: "/signin",
        newUser: "/signup",
    },
}
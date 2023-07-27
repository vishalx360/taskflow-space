import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { verifyAuthenticationResponse } from "@simplewebauthn/server";
import { type AuthenticationResponseJSON } from "@simplewebauthn/typescript-types";
import { TRPCError } from "@trpc/server";
import { verify } from "argon2";
import { type GetServerSidePropsContext } from "next";
import {
  type DefaultSession,
  getServerSession,
  type NextAuthOptions,
} from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import { env } from "@/env.mjs";
import { redisClient } from "@/lib/redisClient";
import { prisma } from "@/server/db";
import { signJTW, verifyJWT } from "@/utils/jwt";
import NewUserSideEffects from "@/utils/NewUserSideEffects";
import {
  PasskeySigninSchema,
  SigninSchema,
  SigninTokenSchema,
} from "@/utils/ValidationSchema";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  events: {
    async signIn({ user, isNewUser }) {
      // seed personal workspace with default board with list and taks
      if (isNewUser) {
        await NewUserSideEffects(user.id, user.email);
      }
    },
  },
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

    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
  },
  secret: env.NEXTAUTH_SECRET,
  jwt: {
    async encode({ secret, token }) {
      return await signJTW(token, secret);
    },
    async decode({ secret, token }) {
      return await verifyJWT(token, secret);
    },
    maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
  },

  session: { strategy: "jwt" },
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
        const user = await prisma.user.findFirst({
          where: { email: creds.email },
        });
        if (!user) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid credentials",
          });
        }
        if (!user.password) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Password not set, please use other login method",
          });
        }
        const isValidPassword = await verify(user.password, creds.password);
        if (!isValidPassword) {
          throw new Error("Invalid credentials");
        }
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
    Credentials({
      name: "passkey",
      id: "passkey",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "",
        },
        passkey: {
          label: "Passkey",
          type: "text",
          placeholder: "Passkey",
        },
      },
      authorize: async (credentials, req) => {
        await PasskeySigninSchema.parseAsync(req.body);

        const user = await prisma.user.findUnique({
          where: { email: req?.body?.email },
        });
        if (!user) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "No user found",
          });
        }
        const passkey: AuthenticationResponseJSON = JSON.parse(
          req?.body?.passkey
        );
        const expectedChallenge = await redisClient.get(
          `passkey-auth-challange:${req.body.email}`
        );

        if (!expectedChallenge) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Error:A authenticating passkey. Please try again.",
          });
        }
        const registeredPasskey = await prisma.passkey.findFirst({
          where: {
            user: {
              email: req.body.email,
            },
            credentialID: passkey.id,
          },
        });

        if (!registeredPasskey) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Error:B authenticating passkey.",
          });
        }

        let verification;
        try {
          verification = await verifyAuthenticationResponse({
            response: passkey,
            expectedChallenge,
            expectedOrigin: env.VERCEL_URL ?? env.NEXTAUTH_URL,
            expectedRPID: env.DOMAIN_NAME,
            authenticator: {
              counter: registeredPasskey.counter,
              credentialID: Uint8Array.from(
                Buffer.from(registeredPasskey.credentialID, "base64url")
              ),
              credentialPublicKey: Uint8Array.from(
                Buffer.from(registeredPasskey.credentialPublicKey, "base64url")
              ),
            },
          });
        } catch (error) {
          const _error = error as Error;
          console.error(_error);
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: _error.message,
          });
        }
        const { verified } = verification;
        if (verified) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          };
        } else {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid credentials",
          });
        }
      },
    }),
    Credentials({
      name: "signin-token",
      credentials: {
        token: {
          label: "Signin Token",
          type: "text",
          placeholder: "signin token",
        },
      },
      authorize: async (credentials) => {
        const creds = await SigninTokenSchema.parseAsync(credentials);
        const SigninToken = await redisClient.get(creds.token);
        if (!SigninToken) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid credentials",
          });
        }
        const user = await prisma.user.findUnique({
          where: { id: SigninToken },
        });
        if (!user) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid credentials",
          });
        }
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
    // oauth providers
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
    GithubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  // change name of cookie
  pages: {
    signIn: "/signin",
    newUser: "/signup",
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};

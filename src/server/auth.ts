import { env } from "@/env.mjs";
import { prisma } from "@/server/db";
import NewUserSideEffects from "@/utils/NewUserSideEffects";
import { SigninSchema } from "@/utils/ValidationSchema";
import { signJTW, verifyJWT } from "@/utils/jwt";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { verify } from "argon2";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions
} from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";

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
}
// DECODE -> JWT -> SESSION -> ENCODE
/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
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
          await NewUserSideEffects(user.id, user.email);
        }
      }
      return token;
    },
  },
  secret: env.NEXTAUTH_SECRET,
  jwt: {
    async encode({ secret, token }) {
      return await signJTW(token, secret)
    },
    async decode({ secret, token }) {
      return await verifyJWT(token, secret)
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
          image: user.image,
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
    GithubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    })
  ],
  cookies: env.NODE_ENV === 'development' ? {} : {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true,
        domain: `.${env.DOMAIN_NAME}`
      }
    },
  },
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

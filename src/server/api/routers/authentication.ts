import { TRPCError } from "@trpc/server";
import { hash } from "argon2";
import { z } from "zod";
import NewUserSideEffects from "../../../utils/NewUserSideEffects";
import { SignUpSchema } from "../../../utils/ValidationSchema";
import { createTRPCRouter, publicProcedure } from "../fastify_trpc";

export const AuthenticationRouter = createTRPCRouter({
  signup: publicProcedure
    .input(SignUpSchema)
    .mutation(async ({ ctx, input }) => {
      const { name, email, password } = input;
      const exists = await ctx.prisma.user.findFirst({
        where: { email },
      });
      if (exists) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already exists.",
        });
      }

      const hashedPassword = await hash(password);

      const result = await ctx.prisma.user.create({
        data: { name, email, password: hashedPassword },
      });

      await NewUserSideEffects(result.id, email);

      return {
        status: 201,
        message: "Account created successfully",
        result: result.email,
      };
    }),

  forgotPassword: publicProcedure
    .input(z.object({
      email: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      const { name, email, password } = input;
      const user = await ctx.prisma.user.findFirst({
        where: { email },
      });
      if (!user) {
        // not actually sending any email.
        return {
          status: 200,
          message: "Verification OTP sent on email."
        }
      }

      return {
        status: 200,
        message: "Verification OTP sent on email.",
      };
    }),
});

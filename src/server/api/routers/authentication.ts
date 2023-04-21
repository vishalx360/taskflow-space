import { TRPCError } from "@trpc/server";
import { hash, verify } from "argon2";
import { z } from "zod";
import NewUserSideEffects from "../../../utils/NewUserSideEffects";
import { SignUpSchema, UpdatePasswordSchema } from "../../../utils/ValidationSchema";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../fastify_trpc";

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
  updatePassword: protectedProcedure
    .input(UpdatePasswordSchema)
    .mutation(async ({ ctx, input }) => {
      const { currentPassword, newPassword } = input;
      const user = await ctx.prisma.user.findFirst({
        where: { id: ctx.session.user?.id },
        select: { password: true },
      });
      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not found.",

        });
      }
      if (!user.password) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No password found.",
        });
      }
      const isValidPassword = await verify(user.password, currentPassword);

      if (!isValidPassword) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid credentials",
        });
      }

      const hashedPassword = await hash(newPassword);

      return await ctx.prisma.user.update({
        where: { id: ctx.session.user?.id },
        data: { password: hashedPassword },
      });

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

import { TRPCError } from "@trpc/server";
import { hash, verify } from "argon2";
import { z } from "zod";
import NewUserSideEffects from "../../../utils/NewUserSideEffects";
import { SignUpSchema, UpdatePasswordSchema, newPasswordSchema } from "../../../utils/ValidationSchema";
import { BASIC_EMAIL } from "../../../utils/email-templates/EmailTemplates";
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
  sendResetPasswordLink: publicProcedure
    .input(z.object({
      email: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      const { email } = input;
      const user = await ctx.prisma.user.findFirst({
        where: { email },
      });
      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "No account found.",
        });
      }
      // delete existing reset token
      await ctx.prisma.resetPasswordToken.deleteMany({
        where: { email },
      });
      // create new reset token save token to db
      const newToken = await ctx.prisma.resetPasswordToken.create({
        data: {
          email: email,
          expires: new Date(Date.now() + 1000 * 60 * 60 * 1),
        },
      })
      const mailOptions = await BASIC_EMAIL({
        recevierEmail: input.email,
        subject: "Reset Password",
        body: ` ${user?.name ? user.name : "You"} have requested to reset your password. If you did not make this request, please ignore this email. If you did make this request, please click the link below to reset your password. 
        <br/>
        https://taskflow.space/newPassword/${newToken?.id}
        <br/>
        This link will expire in 1 hour.
        <br/>
        Regards
        <br/>
`,
      });
      return await ctx.sendEmail(mailOptions);
    }),

  checkResetPasswordLink: publicProcedure
    .input(z.object({
      token: z.string()
    }))
    .query(async ({ ctx, input }) => {
      // verify token
      const token = await ctx.prisma.resetPasswordToken.findUnique({
        where: { id: input.token },
      })
      if (!token) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid Reset Link.",
        });
      }
      if (token.expires < new Date()) {
        // delete token
        await ctx.prisma.resetPasswordToken.delete({
          where: { id: input.token },
        });

        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Reset Link has expired.",
        });
      }
      return token;
    }),

  newPassword: publicProcedure
    .input(newPasswordSchema)
    .mutation(async ({ ctx, input }) => {
      // verify token
      const token = await ctx.prisma.resetPasswordToken.findUnique({
        where: { id: input.token },
      })
      if (!token) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid Reset Link.",
        });
      }
      if (token.expires < new Date()) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Reset Link has expired.",
        });
      }
      // update user password
      const hashedPassword = await hash(input.newPassword);
      await ctx.prisma.user.update({
        where: { email: token.email },
        data: { password: hashedPassword },
      });

      // delete token
      await ctx.prisma.resetPasswordToken.delete({
        where: { id: input.token },
      });

      // send confirmation email
      const mailOptions = await BASIC_EMAIL({
        recevierEmail: token.email,
        subject: "Your Password has been reset",
        body: ` Your password has been reset. If you did not make this request, please contact us immediately. 
        <br/>
        Regards
        <br/>
        `,
      });

      return ctx.sendEmail(mailOptions);
    }),
  // oauth ---------------
  fetchConnectedAccounts: protectedProcedure
    .query(async ({ ctx, input }) => {
      return ctx.prisma.account.findMany({
        where: {
          userId: ctx.session.user?.id
        },
        select: {
          provider: true,
        }
      });
    }),
  disconnectOauthProvider: protectedProcedure
    .input(z.object({ provider: z.enum(["GOOGLE"]) }))
    .mutation(async ({ ctx, input }) => {
      //  check 
      // verify token
      const token = await ctx.prisma.resetPasswordToken.findUnique({
        where: { id: input.token },
      })
      if (!token) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid Reset Link.",
        });
      }
      if (token.expires < new Date()) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Reset Link has expired.",
        });
      }
      // update user password
      const hashedPassword = await hash(input.newPassword);
      await ctx.prisma.user.update({
        where: { email: token.email },
        data: { password: hashedPassword },
      });

      // delete token
      await ctx.prisma.resetPasswordToken.delete({
        where: { id: input.token },
      });

      // send confirmation email
      const mailOptions = await BASIC_EMAIL({
        recevierEmail: token.email,
        subject: "Your Password has been reset",
        body: ` Your password has been reset. If you did not make this request, please contact us immediately. 
        <br/>
        Regards
        <br/>
        `,
      });

      return ctx.sendEmail(mailOptions);
    })
});


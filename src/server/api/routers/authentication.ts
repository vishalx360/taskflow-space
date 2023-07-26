import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyRegistrationResponse,
  type GenerateRegistrationOptionsOpts,
  type VerifiedRegistrationResponse,
  type VerifyRegistrationResponseOpts,
} from "@simplewebauthn/server";
import {
  type PublicKeyCredentialDescriptorFuture,
  type RegistrationResponseJSON,
} from "@simplewebauthn/typescript-types";
import { TRPCError } from "@trpc/server";
import { hash, verify } from "argon2";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

import { env } from "@/env.mjs";
import { BASIC_EMAIL } from "../../../utils/email-templates/EmailTemplates";
import NewUserSideEffects from "../../../utils/NewUserSideEffects";
import {
  newPasswordSchema,
  RenamePasskeySchema,
  SignUpSchema,
  UpdatePasswordSchema,
} from "../../../utils/ValidationSchema";

export const AuthenticationRouter = createTRPCRouter({
  fetchSigninOptions: publicProcedure
    .input(
      z.object({
        email: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { email } = input;
      const user = await ctx.prisma.user.findFirst({
        where: { email },
      });
      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not found.",
        });
      }
      const options = {
        credentials: false,
        passkey: false,
        // google: false,
        // github: false,
      };

      if (user.password) {
        options.credentials = true;
      }
      // fetch passkey
      const passkey = await ctx.prisma.passkey.count({
        where: { userId: user.id },
      });
      if (passkey > 0) {
        options.passkey = true;
      }
      // // fetch accounts
      // const accounts = await ctx.prisma.account.findMany({
      //   where: { userId: user.id },
      // });
      // if (accounts.length > 0) {
      //   accounts.forEach((account) => {
      //     if (account.type === "google") {
      //       options.google = true;
      //     }
      //     if (account.type === "github") {
      //       options.github = true;
      //     }
      //   });
      // }
      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        },
        options,
      };
    }),

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
    .input(
      z.object({
        email: z.string(),
      })
    )
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
      });
      const mailOptions = await BASIC_EMAIL({
        recevierEmail: input.email,
        subject: "Reset Password",
        body: ` ${user?.name ? user.name : "You"
          } have requested to reset your password. If you did not make this request, please ignore this email. If you did make this request, please click the link below to reset your password. 
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
    .input(
      z.object({
        token: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      // verify token
      const token = await ctx.prisma.resetPasswordToken.findUnique({
        where: { id: input.token },
      });
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
      });
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
  fetchConnectedAccounts: protectedProcedure.query(async ({ ctx, input }) => {
    return ctx.prisma.account.findMany({
      where: {
        userId: ctx.session.user?.id,
      },
      select: {
        provider: true,
      },
    });
  }),
  disconnectOauthProvider: protectedProcedure
    .input(z.object({ provider: z.enum(["google", "github"]) }))
    .mutation(async ({ ctx, input }) => {
      const account = await ctx.prisma.account.findFirst({
        where: { userId: ctx.session.user?.id, provider: input.provider },
      });
      if (!account) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No account found.",
        });
      }
      await ctx.prisma.account.delete({
        where: { id: account.id },
      });
      return input.provider;
    }),
  fetchDeleteConsequences: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findFirst({
      where: { id: ctx.session.user?.id },
    });
    if (!user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not found.",
      });
    }
    // delete all workspaces where user is owner
    return ctx.prisma.workspace.findMany({
      where: {
        members: {
          some: {
            role: "OWNER",
            userId: ctx.session.user?.id,
          },
        },
      },
      select: {
        id: true,
        name: true,
        personal: true,
        createdAt: true,
        _count: {
          select: {
            members: true,
            boards: true,
          },
        },
      },
    });
  }),

  deleteAccount: protectedProcedure.mutation(async ({ ctx, input }) => {
    const user = await ctx.prisma.user.findFirst({
      where: { id: ctx.session.user?.id },
    });
    if (!user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not found.",
      });
    }

    const transactions = [
      // delete all workspaces where user is owner
      ctx.prisma.workspace.deleteMany({
        where: {
          members: {
            some: {
              role: "OWNER",
              userId: ctx.session.user?.id,
            },
          },
        },
      }),
      ctx.prisma.user.delete({
        where: {
          id: ctx.session.user?.id,
        },
      }),
    ];

    // promote next owner
    return Promise.all(transactions);
  }),
  // passkey ---------------
  fetchvercel: publicProcedure.query(async ({ ctx }) => {
    return {
      "env-mjs-VERCEL_URL": env.VERCEL_URL,
      VERCEL_URL: process.env.VERCEL_URL,
    }
  }),
  fethMyPasskeys: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.passkey.findMany({
      where: {
        userId: ctx.session.user?.id,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
    });
  }),
  removePasskey: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const passkey = await ctx.prisma.passkey.findFirst({
        where: { id: input.id, userId: ctx.session.user?.id },
      });
      if (!passkey) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No passkey found.",
        });
      }
      await ctx.prisma.passkey.delete({
        where: { id: input.id },
      });
      return passkey.name;
    }),
  renamePasskey: protectedProcedure
    .input(RenamePasskeySchema)
    .mutation(async ({ ctx, input }) => {
      const passkey = await ctx.prisma.passkey.findFirst({
        where: { id: input.id, userId: ctx.session.user?.id },
      });
      if (!passkey) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No passkey found.",
        });
      }
      return ctx.prisma.passkey.update({
        where: { id: input.id },
        data: { name: input.name },
      });
    }),
  passkeyGenAuthOpts: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ ctx, input }) => {
      // check if user exists
      const user = await ctx.prisma.user.findFirst({
        where: { email: input.email },
      });
      if (!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No user found.",
        });
      }
      // fetch list of already registered passkeys
      const passkeys = await ctx.prisma.passkey.findMany({
        where: {
          userId: user.id,
        },
      });
      if (passkeys.length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No registred passkeys found.",
        });
      }
      const options = generateAuthenticationOptions({
        // Require users to use a previously-registered authenticator
        allowCredentials: passkeys.map((passkey) => ({
          id: Uint8Array.from(Buffer.from(passkey.credentialID, "base64url")),
          type: "public-key",
        })),
        rpID: env.DOMAIN_NAME,
        timeout: 60000,
        userVerification: "preferred",
      });
      // Remember this challenge for this user
      await ctx.redis.set(
        `passkey-auth-challange:${input.email}`,
        options.challenge,
        "EX",
        60
      );
      return options;
    }),
  // passkeyVerifyAuth: publicProcedure
  //   .input(z.any())
  //   .mutation(async ({ ctx, input }) => {
  //     const body: AuthenticationResponseJSON = input;
  //     const user = await ctx.prisma.user.findFirst({
  //       where: { email: input.email },
  //     });
  //     if (!user) {
  //       throw new TRPCError({
  //         code: "BAD_REQUEST",
  //         message: "No user found.",
  //       });
  //     }
  //     const expectedChallenge = await ctx.redis.get(`passkey-auth-challange:${input.email}`)

  //     if (!expectedChallenge) {
  //       throw new TRPCError({
  //         code: "UNAUTHORIZED",
  //         message: "Error authenticating passkey. Please try again.",
  //       })
  //     }
  //     // (Pseudocode) Get `options.challenge` that was saved above
  //     // (Pseudocode} Retrieve an authenticator from the DB that
  //     // should match the `id` in the returned credential
  //     const authenticator = await ctx.prisma.passkey.count({
  //       where: {
  //         credentialID: Buffer.from(body.id).toString('base64url'),
  //       },
  //     });

  //     if (!authenticator) {
  //       throw new Error(`Could not find authenticator ${body.id} for user ${user.id}`);
  //     }

  //     let verification;
  //     try {
  //       verification = await verifyAuthenticationResponse({
  //         response: body,
  //         expectedChallenge,
  //         expectedOrigin: "http://localhost:3000",
  //         expectedRPID: "localhost",
  //         authenticator,
  //       });
  //     } catch (error) {
  //       const _error = error as Error;
  //       console.error(_error);
  //       throw new TRPCError({
  //         code: "UNAUTHORIZED",
  //         message: _error.message,
  //       })
  //     }
  //     const { verified } = verification;
  //     if (verified) {
  //       // generate signin token
  //       const SigninToken = await ctx.redis.set(`signin-token:${randomUUID()}`, user.id, "EX", 60);
  //       return SigninToken;
  //     } else {
  //       throw new TRPCError({
  //         code: "UNAUTHORIZED",
  //         message: "Error authenticating passkey. Please try again.",
  //       })
  //     }
  //   }),
  passkeyGenRegOpts: protectedProcedure.query(async ({ ctx, input }) => {
    // fetch list of already registered passkeys
    const passkeys = await ctx.prisma.passkey.findMany({
      where: {
        userId: ctx.session.user?.id,
      },
    });
    const opts: GenerateRegistrationOptionsOpts = {
      rpName: "taskflow",
      rpID: env.DOMAIN_NAME,
      userID: ctx.session.user?.id,
      userName: ctx.session.user?.email,
      userDisplayName: ctx.session.user?.name || ctx.session.user?.email,
      timeout: 60000,
      attestationType: "none",
      /**
       * Passing in a user's list of already-registered authenticator IDs here prevents users from
       * registering the same device multiple times. The authenticator will simply throw an error in
       * the browser if it's asked to perform registration when one of these ID's already resides
       * on it.
       */
      excludeCredentials: passkeys.map(
        (passkey) =>
        ({
          id: Uint8Array.from(Buffer.from(passkey.credentialID, "base64url")),
          type: "public-key",
          transports: passkey.transports,
        } satisfies PublicKeyCredentialDescriptorFuture)
      ),
      authenticatorSelection: {
        residentKey: "discouraged",
      },
      supportedAlgorithmIDs: [-7, -257],
    };

    const options = generateRegistrationOptions(opts);

    /**
     * The server needs to temporarily remember this value for verification, so don't lose it until
     * after you verify an authenticator response.
     */
    await ctx.redis.set(
      `passkey-reg-challange:${ctx.session.user.id}`,
      options.challenge,
      "EX",
      60
    );

    return options;
  }),

  passkeyVerifyReg: protectedProcedure
    .input(z.any())
    .mutation(async ({ ctx, input }) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const body: RegistrationResponseJSON = input;
      const user = ctx.session.user;
      const expectedChallenge = await ctx.redis.get(
        `passkey-reg-challange:${ctx.session.user.id}`
      );

      if (!expectedChallenge) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Error registering passkey. Please try again.",
        });
      }
      let verification: VerifiedRegistrationResponse;
      try {
        const opts: VerifyRegistrationResponseOpts = {
          response: body,
          expectedChallenge,
          expectedOrigin: process.env.VERCEL_URL,
          supportedAlgorithmIDs: [-7, -257],
          expectedRPID: env.DOMAIN_NAME,
          requireUserVerification: true,
        };
        verification = await verifyRegistrationResponse(opts);
      } catch (error) {
        const _error = error as Error;
        console.error(_error);
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: _error.message,
        });
      }
      const { verified, registrationInfo } = verification;
      if (verified && registrationInfo) {
        const { credentialPublicKey, credentialID, counter } = registrationInfo;
        // check for passkey in db
        const existingDevice = await ctx.prisma.passkey.count({
          where: {
            credentialID: Buffer.from(credentialID).toString("base64url"),
          },
        });
        if (!existingDevice) {
          // Add the returned device to the user's list of devices
          await ctx.prisma.passkey.create({
            data: {
              name: `New Passkey (rename me)`,
              credentialPublicKey:
                Buffer.from(credentialPublicKey).toString("base64url"),
              credentialID: Buffer.from(credentialID).toString("base64url"),
              counter,
              transports: body.response.transports,
              user: {
                connect: {
                  id: user.id,
                },
              },
            },
          });
        }
      }
      await ctx.redis.del(`passkey-reg-challange:${ctx.session.user.id}`);
      return { verified };
    }),
});

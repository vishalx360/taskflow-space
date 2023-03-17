
import { TRPCError } from "@trpc/server";
import { hash } from "argon2";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import SeedPersonalWorkspace from "~/utils/SeedPersonalWorkspace";
import { SignUpSchema } from "~/utils/ValidationSchema";

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

            await SeedPersonalWorkspace(result.id);

            return {
                status: 201,
                message: "Account created successfully",
                result: result.email,
            };

        }),
});

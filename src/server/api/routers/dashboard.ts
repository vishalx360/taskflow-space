import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter, protectedProcedure
} from "~/server/api/trpc";
import { CreateNewBoardValidationSchema } from "~/utils/ValidationSchema";

export const DashboardRouter = createTRPCRouter({
  getAllWorkspace: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.workspace.findMany({ where: { userId: ctx.session.user.id } });
  }),

  getAllBoards: protectedProcedure
    .input(z.object({ workspaceId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.board.findMany({ where: { workspaceId: input.workspaceId } });
    }),

  createNewBoard: protectedProcedure.input(CreateNewBoardValidationSchema).mutation(async ({ ctx, input }) => {
    // check if board name is taken
    const nameTaken = await ctx.prisma.board.count({ where: { name: input.name } });
    if (nameTaken) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Board already exist with the choosen name.',
      });
    }
    return ctx.prisma.board.create({ data: { name: input.name, workspaceId: input.workspaceId } });
  }),

});

import { z } from "zod";

import {
  createTRPCRouter, protectedProcedure
} from "~/server/api/trpc";

export const DashboardRouter = createTRPCRouter({
  getAllWorkspace: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.workspace.findMany({ where: { userId: ctx.session.user.id } });
  }),

  getAllBoards: protectedProcedure
    .input(z.object({ workspaceId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.board.findMany({ where: { workspaceId: input.workspaceId } });
    }),
});

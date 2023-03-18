import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const BoardRouter = createTRPCRouter({
  getBoard: protectedProcedure
    .input(z.object({ boardId: z.string() }))
    .query(({ ctx, input }) => {
      console.log(input.boardId);
      return ctx.prisma.board.findUnique({
        where: { id: input.boardId },
        include: { lists: true },
      });
    }),

  getTasks: protectedProcedure
    .input(z.object({ listId: z.string() }))
    .query(({ ctx, input }) => {
      // sort by rank
      return ctx.prisma.task.findMany({
        where: { listId: input.listId },
        orderBy: { rank: "asc" },
      });
    }),
});

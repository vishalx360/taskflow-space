import { LexoRank } from "lexorank";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { CreateTaskSchema } from "~/utils/ValidationSchema";

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

  // mutations
  createTask: protectedProcedure
    .input(CreateTaskSchema)
    .mutation(async ({ ctx, input }) => {
      let rank = LexoRank.min().toString();

      const lastTask = await ctx.prisma.task.findFirst({ where: { listId: input.listId }, orderBy: { rank: "desc" }, select: { rank: true } })
      if (lastTask?.rank) {
        const parsedRank = LexoRank.parse(lastTask?.rank)
        rank = parsedRank.genNext()?.toString();
      }

      return ctx.prisma.task.create({
        data: {
          title: input.title,
          listId: input.listId,
          rank
        },
      });
    })

});

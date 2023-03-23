import { LexoRank } from "lexorank";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { CreateTaskSchema, UpdateTaskSchema } from "~/utils/ValidationSchema";

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

  getTask: protectedProcedure
    .input(z.object({ taskId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.task.findUnique({
        where: { id: input.taskId },
      });
    }),

  // mutations
  createTask: protectedProcedure
    .input(CreateTaskSchema)
    .mutation(async ({ ctx, input }) => {
      // check if list exists
      const list = await ctx.prisma.list.findUnique({
        where: { id: input.listId },
        select: { boardId: true },
      });
      if (!list) { throw new Error("List not found") }
      // check if list belongs to user
      const board = await ctx.prisma.board.findUnique({
        where: { id: list.boardId },
        select: { workspaceId: true, members: true },
      });
      if (!board) { throw new Error("Board not found") }
      const hasPermission = board.members.find((member) => member.id === ctx.session.user.id);

      if (!hasPermission) { throw new Error("Unauthorized") }

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
    }),

  updateTask: protectedProcedure
    .input(UpdateTaskSchema)
    .mutation(async ({ ctx, input }) => {
      const task = await ctx.prisma.task.findUnique({
        where: { id: input.taskId },
        select: { listId: true },
      });
      if (!task) { throw new Error("Task not found") }
      // check if list exists
      const list = await ctx.prisma.list.findUnique({
        where: { id: task.listId },
        select: { boardId: true },
      });
      if (!list) { throw new Error("List not found") }
      // check if list belongs to user
      const board = await ctx.prisma.board.findUnique({
        where: { id: list.boardId },
        select: { workspaceId: true, members: true },
      });
      if (!board) { throw new Error("Board not found") }

      const hasPermission = board.members.find((member) => member.id === ctx.session.user.id);
      if (!hasPermission) { throw new Error("Unauthorized"); }

      return ctx.prisma.task.update({
        where: { id: input.taskId },
        data: {
          title: input.title,
          description: input.description,
        }
      });
    }),

  deleteTask: protectedProcedure
    .input(z.object({ taskId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const task = await ctx.prisma.task.findUnique({
        where: { id: input.taskId },
        select: { listId: true },
      });
      if (!task) { throw new Error("Task not found") }
      // check if list exists
      const list = await ctx.prisma.list.findUnique({
        where: { id: task.listId },
        select: { boardId: true },
      });
      if (!list) { throw new Error("List not found") }
      // check if list belongs to user
      const board = await ctx.prisma.board.findUnique({
        where: { id: list.boardId },
        select: { workspaceId: true, members: true },
      });
      if (!board) { throw new Error("Board not found") }

      const hasPermission = board.members.find((member) => member.id === ctx.session.user.id);
      if (!hasPermission) { throw new Error("Unauthorized"); }

      return ctx.prisma.task.delete({
        where: { id: input.taskId },
      });
    })

});

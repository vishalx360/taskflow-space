import { TRPCError } from "@trpc/server";
import { LexoRank } from "lexorank";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../fastify_trpc";

import {
  CreateTaskSchema, MoveTaskSchema, UpdateTaskSchema
} from "../../../utils/ValidationSchema";


export const TaskRouter = createTRPCRouter({

  // Tasks
  createTask: protectedProcedure
    .input(CreateTaskSchema)
    .mutation(async ({ ctx, input }) => {
      // check if list exists
      const list = await ctx.prisma.list.findUnique({
        where: { id: input.listId },
        select: { boardId: true },
      });
      if (!list) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "List not found",
        });
      }
      // check if list belongs to user
      const board = await ctx.prisma.board.findUnique({
        where: { id: list.boardId },
        select: { workspaceId: true, },
      });
      if (!board) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Board not found",
        });
      }

      const hasPermission = await ctx.prisma.workspaceMember.count({
        where: {
          workspaceId: board.workspaceId,
          userId: ctx.session.user.id,
        },
      });

      if (!hasPermission) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You dont have permission to create a task in this board.",
        });
      }

      let rank = LexoRank.middle().toString();

      const lastTask = await ctx.prisma.task.findFirst({
        where: { listId: input.listId },
        orderBy: { rank: "desc" },
        select: { rank: true },
      });
      if (lastTask?.rank) {
        const parsedRank = LexoRank.parse(lastTask?.rank);
        rank = parsedRank.genNext()?.toString();
      }

      const newTask = await ctx.prisma.task.create({
        data: {
          title: input.title,
          listId: input.listId,
          rank,
        },
      });
      return newTask;
    }),

  getTasks: protectedProcedure
    .input(z.object({ listId: z.string() }))
    .query(async ({ ctx, input }) => {
      // check if list exists
      const list = await ctx.prisma.list.findUnique({
        where: { id: input.listId },
        select: { boardId: true },
      });
      if (!list) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "List not found",
        });
      }
      // check if list belongs to user
      const board = await ctx.prisma.board.findUnique({
        where: { id: list.boardId },
        select: { workspaceId: true, },
      });
      if (!board) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Board not found",
        });
      }

      const hasPermission = await ctx.prisma.workspaceMember.count({
        where: {
          workspaceId: board.workspaceId,
          userId: ctx.session.user.id,
        },
      });

      if (!hasPermission) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You dont have permission to read tasks.",
        });
      }
      // sort by rank
      return ctx.prisma.task.findMany({
        where: { listId: input.listId },
        orderBy: { rank: "asc" },
      });
    }),

  getTask: protectedProcedure
    .input(z.object({ taskId: z.string() }))
    .query(async ({ ctx, input }) => {
      const task = await ctx.prisma.task.findUnique({
        where: { id: input.taskId },
        select: { listId: true },
      });
      if (!task) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Task not found",
        });
      }
      // check if list exists
      const list = await ctx.prisma.list.findUnique({
        where: { id: task.listId },
        select: { boardId: true },
      });
      if (!list) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "List not found",
        });
      }
      // check if list belongs to user
      const board = await ctx.prisma.board.findUnique({
        where: { id: list.boardId },
        select: { workspaceId: true, },
      });
      if (!board) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Board not found",
        });
      }

      const hasPermission = await ctx.prisma.workspaceMember.count({
        where: {
          workspaceId: board.workspaceId,
          userId: ctx.session.user.id,
        },
      });

      if (!hasPermission) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You dont have permission to read this task.",
        });
      }
      return ctx.prisma.task.findUnique({
        where: { id: input.taskId },
      });
    }),

  updateTask: protectedProcedure
    .input(UpdateTaskSchema)
    .mutation(async ({ ctx, input }) => {
      const task = await ctx.prisma.task.findUnique({
        where: { id: input.taskId },
        select: { listId: true },
      });
      if (!task) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Task not found",
        });
      }
      // check if list exists
      const list = await ctx.prisma.list.findUnique({
        where: { id: task.listId },
        select: { boardId: true },
      });
      if (!list) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "List not found",
        });
      }
      // check if list belongs to user
      const board = await ctx.prisma.board.findUnique({
        where: { id: list.boardId },
        select: { workspaceId: true },
      });

      if (!board) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Board not found",
        });
      }

      const hasPermission = await ctx.prisma.workspaceMember.count({
        where: {
          workspaceId: board.workspaceId,
          userId: ctx.session.user.id,
        },
      });

      if (!hasPermission) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You dont have permission to update this task.",
        });
      }

      return ctx.prisma.task.update({
        where: { id: input.taskId },
        data: {
          title: input.title,
          description: input.description,
        },
      });
    }),

  moveTask: protectedProcedure
    .input(MoveTaskSchema)
    .mutation(async ({ ctx, input }) => {
      const task = await ctx.prisma.task.findUnique({
        where: { id: input.taskId },
        select: { listId: true },
      });
      if (!task) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Task not found",
        });
      }
      // check if list exists
      const list = await ctx.prisma.list.findUnique({
        where: { id: task.listId },
        select: { boardId: true },
      });
      if (!list) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "List not found",
        });
      }
      // check if list belongs to user
      const board = await ctx.prisma.board.findUnique({
        where: { id: list.boardId },
        select: { workspaceId: true },
      });

      if (!board) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Board not found",
        });
      }

      const hasPermission = await ctx.prisma.workspaceMember.count({
        where: {
          workspaceId: board.workspaceId,
          userId: ctx.session.user.id,
        },
      });

      if (!hasPermission) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You dont have permission to move this task.",
        });
      }


      let prevTask;
      let nextTask;

      if (input.newPrevTaskId) {
        prevTask = await ctx.prisma.task.findUnique({
          where: { id: input.newPrevTaskId },
          select: { rank: true },
        });
      }
      if (input.newNextTaskId) {
        nextTask = await ctx.prisma.task.findUnique({
          where: { id: input.newNextTaskId },
          select: { rank: true },
        });
      }
      // if putting on empty list
      let rank = LexoRank.middle().toString();
      // if putting in middle
      if (prevTask && nextTask) {
        rank = LexoRank.parse(prevTask?.rank).between(LexoRank.parse(nextTask?.rank)).toString();
      }
      // if putting on bottom and prev exist
      if (prevTask && !nextTask) {
        rank = LexoRank.parse(prevTask?.rank).genNext().toString();
      }
      // if putting on top and next exist
      if (!prevTask && nextTask) {
        rank = LexoRank.parse(nextTask?.rank).genPrev().toString();
      }

      await ctx.prisma.task.update({
        where: { id: input.taskId },
        data: {
          listId: input.newListId,
          rank,
        },
      });
      // send lists to update
      return [task.listId, input.newListId];
    }),

  deleteTask: protectedProcedure
    .input(z.object({ taskId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const task = await ctx.prisma.task.findUnique({
        where: { id: input.taskId },
        select: { listId: true },
      });
      if (!task) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Task not found",
        });
      }
      // check if list exists
      const list = await ctx.prisma.list.findUnique({
        where: { id: task.listId },
        select: { boardId: true },
      });
      if (!list) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "List not found",
        });
      }
      // check if list belongs to user
      const board = await ctx.prisma.board.findUnique({
        where: { id: list.boardId },
        select: { workspaceId: true },
      });

      if (!board) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Board not found",
        });
      }

      const hasPermission = await ctx.prisma.workspaceMember.count({
        where: {
          workspaceId: board.workspaceId,
          userId: ctx.session.user.id,
        },
      });

      if (!hasPermission) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You dont have permission to delete this task.",
        });
      }

      return ctx.prisma.task.delete({
        where: { id: input.taskId },
      });
    }),

});

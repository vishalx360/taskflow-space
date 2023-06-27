import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../fastify_trpc";

import {
  CreateListSchema,
  UpdateListSchema
} from "../../../utils/ValidationSchema";

export const ListRouter = createTRPCRouter({
  createList: protectedProcedure
    .input(CreateListSchema)
    .mutation(async ({ ctx, input }) => {
      // check if list belongs to user
      const board = await ctx.prisma.board.findUnique({
        where: { id: input.boardId },
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
          message: "You dont have permission to create list.",
        });
      }

      const listNameExist = await ctx.prisma.list.count({
        where: { name: input.name, boardId: input.boardId },
      });

      if (listNameExist) {
        throw new Error("List name already exist");
      }

      const newList = await ctx.prisma.list.create({
        data: {
          boardId: input.boardId,
          name: input.name,
        },
      });

      await ctx.pusher.trigger(`board-${input.boardId}`, "board:update", {
        boardId: input.boardId,
        initiatorId: ctx.session.user.id,
      });

      return newList;
    }),

  updateList: protectedProcedure
    .input(UpdateListSchema)
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
          message: "You dont have permission to update list.",
        });
      }
      await ctx.pusher.trigger(`board-${list.boardId}`, "board:update", {
        boardId: list.boardId,
        initiatorId: ctx.session.user.id,
      });

      return ctx.prisma.list.update({
        where: { id: input.listId },
        data: {
          name: input.name,
        },
      });
    }),

  deleteList: protectedProcedure
    .input(z.object({ listId: z.string() }))
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
          message: "You dont have permission to delete list.",
        });
      }
      await ctx.pusher.trigger(`board-${list.boardId}`, "board:update", {
        boardId: list.boardId,
        initiatorId: ctx.session.user.id,
      });
      return ctx.prisma.list.delete({
        where: { id: input.listId },
      });
    }),

  clearList: protectedProcedure
    .input(z.object({ listId: z.string() }))
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
          message: "You dont have permission to clear list.",
        });
      }
      await ctx.pusher.trigger(`board-${list.boardId}`, "list:update", {
        listId: input.listId,
        initiatorId: ctx.session.user.id,
      });

      return ctx.prisma.task.deleteMany({
        where: { listId: input.listId },
      });
    }),
});

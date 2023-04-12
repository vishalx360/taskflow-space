import { TRPCError } from "@trpc/server";
import random from "lodash.random";
import { z } from "zod";
import Backgrounds from "../../../utils/BoardBackgrounds.json";

import {
  CreateNewBoardSchema, UpdateBoardSchema
} from "../../../utils/ValidationSchema";
import { createTRPCRouter, protectedProcedure } from "../fastify_trpc";


const GetRandomBackgroundGradient = () => {
  const background =
    Backgrounds["gradients"][random(0, Backgrounds["gradients"].length - 1)];
  if (background) {
    return `gradient:${background}`;
  } else {
    return;
  }
};


export const BoardRouter = createTRPCRouter({

  getRecentBoards: protectedProcedure
    .query(({ ctx, input }) => {
      return ctx.prisma.board.findMany({
        where: {
          Workspace: {
            members: {
              some: { userId: ctx.session.user.id }
            }
          }
        },
        orderBy: { updatedAt: "desc" },
        take: 4
      });
    }),

  getAllBoards: protectedProcedure
    .input(z.object({ workspaceId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.board.findMany({
        where: { workspaceId: input.workspaceId, Workspace: { members: { some: { userId: ctx.session.user.id } } } },
        orderBy: { updatedAt: "desc" }
      });
    }),
  deleteBoard: protectedProcedure
    .input(z.object({ boardId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const board = await ctx.prisma.board.findUnique({
        where: { id: input.boardId },
        select: { workspaceId: true },
      });
      if (!board) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Board not found.",
        });
      }

      const hasPermission = await ctx.prisma.workspaceMember.count({
        where: {
          workspaceId: board.workspaceId,
          userId: ctx.session.user.id,
          role: { in: ["OWNER", "ADMIN"] },
        },
      });

      if (!hasPermission) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You dont have permission to delete this board.",
        });
      }


      return ctx.prisma.board.delete({
        where: { id: input.boardId },
      });
    }),

  createNewBoard: protectedProcedure
    .input(CreateNewBoardSchema)
    .mutation(async ({ ctx, input }) => {
      // check if board name is taken
      const nameTaken = await ctx.prisma.board.count({
        where: { name: input.name, workspaceId: input.workspaceId },
      });
      if (nameTaken) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Board already exist with same name in the workspace.",
        });
      }

      const hasPermission = await ctx.prisma.workspaceMember.count({
        where: {
          workspaceId: input.workspaceId,
          userId: ctx.session.user.id,
          role: { in: ["OWNER", "ADMIN"] },
        },
      });

      if (!hasPermission) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You dont have permission to create a board in this workspace",
        });
      }

      const newBoard = await ctx.prisma.board.create({
        data: {
          name: input.name,
          workspaceId: input.workspaceId,
          background: input.background || GetRandomBackgroundGradient(),
          description: input.description,
        },
      });
      return newBoard;
    }),


  getBoard: protectedProcedure
    .input(z.object({ boardId: z.string() }))
    .query(async ({ ctx, input }) => {
      // check if board exist and user has permission to view it
      const board = await ctx.prisma.board.findUnique({
        where: { id: input.boardId },
        select: { workspaceId: true },
      });
      if (!board) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Board not found.",
        });
      }

      const hasPermission = await ctx.prisma.workspaceMember.count({
        where: {
          workspaceId: board.workspaceId,
          userId: ctx.session.user.id,
        }
      });

      if (!hasPermission) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You dont have permission to view this board.",
        });
      }

      await ctx.prisma.board.update({
        where: { id: input.boardId },
        data: { updatedAt: new Date() },
      });

      return ctx.prisma.board.findUnique({
        where: { id: input.boardId },
        include: {
          lists: true,
          Workspace: true
        },
      });
    }),

  updateBoard: protectedProcedure
    .input(UpdateBoardSchema)
    .mutation(async ({ ctx, input }) => {
      const board = await ctx.prisma.board.findUnique({
        where: { id: input.boardId },
        select: { workspaceId: true },
      });
      if (!board) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Board not found.",
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
          message: "You dont have permission to update this board.",
        });
      }

      await ctx.prisma.board.update({
        where: { id: input.boardId },
        data: {
          name: input.name,
          background: input.background,
        },
      });
      return {
        name: input.name,
        background: input.background,
      };
    }),
});

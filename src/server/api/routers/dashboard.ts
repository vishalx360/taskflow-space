import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  CreateNewBoardValidationSchema,
  CreateNewWorkspaceValidationSchema,
  DeleteWorkspaceValidationSchema,
  RenameWorkspaceValidationSchema,
} from "~/utils/ValidationSchema";

export const DashboardRouter = createTRPCRouter({
  getAllWorkspace: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.workspace.findMany({
      where: { userId: ctx.session.user.id },
    });
  }),

  getAllBoards: protectedProcedure
    .input(z.object({ workspaceId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.board.findMany({
        where: { workspaceId: input.workspaceId },
      });
    }),

  createNewBoard: protectedProcedure
    .input(CreateNewBoardValidationSchema)
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
      return ctx.prisma.board.create({
        data: { name: input.name, workspaceId: input.workspaceId },
      });
    }),

  createNewWorkspace: protectedProcedure
    .input(CreateNewWorkspaceValidationSchema)
    .mutation(async ({ ctx, input }) => {
      // check if board name is taken
      const nameTaken = await ctx.prisma.workspace.count({
        where: {
          name: input.name,
          userId: ctx.session.user.id,
        },
      });
      if (nameTaken) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Workspace already exist with the choosen name.",
        });
      }
      console.log(ctx.session.user.id);
      return ctx.prisma.workspace.create({
        data: {
          name: input.name,
          userId: ctx.session.user.id,
        },
      });
    }),

  renameWorkspace: protectedProcedure
    .input(RenameWorkspaceValidationSchema)
    .mutation(async ({ ctx, input }) => {
      // check if workspace exist
      const Workspace = await ctx.prisma.workspace.findUnique({
        where: {
          id: input.workspaceId,
        },
      });
      if (!Workspace) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Workspace not found.",
        });
      }
      // check if user is owner of the workspace
      if (Workspace.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You dont have permission to rename this workspace.",
        });
      }
      // check if the user already owns a workspace with new name
      const nameTaken = await ctx.prisma.workspace.count({
        where: {
          name: input.name,
          userId: ctx.session.user.id,
        },
      });
      if (nameTaken) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Workspace already exist with the choosen name.",
        });
      }
      return ctx.prisma.workspace.update({
        where: {
          id: input.workspaceId,
        },
        data: {
          name: input.name,
        },
      });
    }),

  deleteWorkspace: protectedProcedure
    .input(DeleteWorkspaceValidationSchema)
    .mutation(async ({ ctx, input }) => {
      // check if workspace exist
      const Workspace = await ctx.prisma.workspace.findUnique({
        where: {
          id: input.workspaceId,
        },
      });
      if (!Workspace) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Workspace not found.",
        });
      }
      // check if user is owner of the workspace
      if (Workspace.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You dont have permission to delete this workspace.",
        });
      }
      return ctx.prisma.workspace.delete({
        where: {
          id: input.workspaceId,
        },
      });
    }),
});

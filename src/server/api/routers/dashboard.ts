import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  CreateNewBoardSchema,
  CreateNewWorkspaceSchema, RenameWorkspaceSchema,
  WorksapceInviteResponse
} from "~/utils/ValidationSchema";

export const DashboardRouter = createTRPCRouter({
  getAllWorkspace: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.workspace.findMany({
      where: { members: { some: { userId: ctx.session.user.id } } },
      orderBy: { personal: "desc" },
      include: { members: { where: { userId: ctx.session.user.id }, select: { role: true } } },
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
        select: { workspaceId: true }
      })

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

      return ctx.prisma.board.create({
        data: {
          name: input.name,
          workspaceId: input.workspaceId,
        },
      });
    }),

  createNewWorkspace: protectedProcedure
    .input(CreateNewWorkspaceSchema)
    .mutation(async ({ ctx, input }) => {
      // check if board name is taken
      const nameTaken = await ctx.prisma.workspace.count({
        where: {
          name: input.name,
          members: { some: { userId: ctx.session.user.id } },
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
          members: { create: { role: "OWNER", userId: ctx.session.user.id } }
        },
      });
    }),

  renameWorkspace: protectedProcedure
    .input(RenameWorkspaceSchema)
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
          message: "You dont have permission to rename this workspace.",
        });
      }
      // check if the user already owns a workspace with new name
      const nameTaken = await ctx.prisma.workspace.count({
        where: {
          name: input.name,
          members: { some: { userId: ctx.session.user.id } },
        },
      });
      if (nameTaken) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Workspace already exist with the choosen name.",
        });
      }

      return ctx.prisma.workspace.update({
        where: { id: input.workspaceId },
        data: { name: input.name },
      });
    }),

  deleteWorkspace: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string(),
      })
    )
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
      const hasPermission = await ctx.prisma.workspaceMember.count({
        where: {
          workspaceId: input.workspaceId,
          userId: ctx.session.user.id,
          role: { in: ["OWNER"] },
        },
      });

      if (!hasPermission) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You dont have permission to rename this workspace.",
        });
      }

      return ctx.prisma.workspace.delete({
        where: { id: input.workspaceId }
      });
    }),

  // accept invite or decline invite to join workspace
  inviteResponse: protectedProcedure
    .input(WorksapceInviteResponse)
    .mutation(async ({ ctx, input }) => {
      // check if the user is already a member of the workspace
      const invitation = await ctx.prisma.workspaceMemberInvitation.findUnique({
        where: {
          id: input.workspaceInvitaionId,
        },
      });
      if (!invitation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invitation not found.",
        });
      }
      if (invitation.recepientId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not the recepient of this invite.",
        });
      }

      const isAlreadyMember = await ctx.prisma.workspaceMember.count({
        where: {
          workspaceId: invitation.workspaceId,
          userId: invitation.recepientId,
        },
      });

      const transactions = [];
      const createWorkspaceMember = ctx.prisma.workspaceMember.create({
        data: {
          workspaceId: invitation.workspaceId,
          role: invitation.role,
          userId: invitation.recepientId,
        },
      });
      input.accept && transactions.push(createWorkspaceMember);

      const deleteWorkspaceInvitation = ctx.prisma.workspaceMemberInvitation.delete({
        where: { id: input.workspaceInvitaionId }
      })
      transactions.push(deleteWorkspaceInvitation);

      if (isAlreadyMember) {
        await deleteWorkspaceInvitation;
        throw new TRPCError({
          code: "CONFLICT",
          message: "You are already a member of the workspace.",
        });
      }
      await ctx.prisma.$transaction(transactions);
      return input.accept;
    }),

});

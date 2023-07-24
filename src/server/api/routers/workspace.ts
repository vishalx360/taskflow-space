import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

import { ALLOWED_ROLES_TO_INVITE } from "../../../utils/AllowedRolesToInvite";
import { BASIC_EMAIL } from "../../../utils/email-templates/EmailTemplates";
import {
  CreateNewWorkspaceSchema,
  CreateWorkspaceInvitation,
  RenameWorkspaceSchema,
  TransferWorkspaceOwnershipSchema,
  WorksapceInviteResponse,
} from "../../../utils/ValidationSchema";

export const WorkspaceRouter = createTRPCRouter({
  getAllWorkspace: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.workspace.findMany({
      where: { members: { some: { userId: ctx.session.user.id } } },
      orderBy: { createdAt: "asc" },
      include: {
        members: {
          where: { userId: ctx.session.user.id },
          select: { role: true },
        },
      },
    });
  }),

  getWorkspaceMembers: protectedProcedure
    .input(z.object({ workspaceId: z.string() }))
    .query(async ({ ctx, input }) => {
      const hasPermission = await ctx.prisma.workspaceMember.findFirst({
        where: {
          workspaceId: input.workspaceId,
          userId: ctx.session.user.id,
        },
      });

      if (!hasPermission || !hasPermission.role) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You dont have permission to view workspace members.",
        });
      }
      return ctx.prisma.workspaceMember.findMany({
        where: {
          workspaceId: input.workspaceId,
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              image: true,
            },
          },
        },
        orderBy: {
          role: "asc",
        },
      });
    }),

  inviteMember: protectedProcedure
    .input(CreateWorkspaceInvitation)
    .mutation(async ({ ctx, input }) => {
      const hasPermission = await ctx.prisma.workspaceMember.findFirst({
        where: {
          workspaceId: input.workspaceId,
          userId: ctx.session.user.id,
          role: { in: ["OWNER", "ADMIN"] },
        },
      });

      if (!hasPermission || !hasPermission.role) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You dont have permission to invite member.",
        });
      }

      // TODO: if user not found, send email to invite
      // make inviraion/invitecode page where it will fetch the invitation,
      // if user is loggedin and is the recepient of invite, show the invite modal component
      // if not loggedin redirect to signin page with nextURL=invite_url

      const ALLOWED_ROLES = ALLOWED_ROLES_TO_INVITE[hasPermission.role];

      if (!ALLOWED_ROLES.includes(input.role as never)) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "You dont have permission to invite member with selected role.",
        });
      }

      const isMember = await ctx.prisma.workspaceMember.count({
        where: {
          workspaceId: input.workspaceId,
          user: { email: input.email },
        },
      });

      if (isMember) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already a member.",
        });
      }
      const isAlreadyInvited = await ctx.prisma.workspaceMemberInvitation.count(
        {
          where: {
            workspaceId: input.workspaceId,
            recepientEmail: input.email,
          },
        }
      );
      if (isAlreadyInvited) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already invited.",
        });
      }

      const recepientUser = await ctx.prisma.user.findUnique({
        where: { email: input.email },
      });

      const invitation = await ctx.prisma.workspaceMemberInvitation.create({
        data: {
          workspaceId: input.workspaceId,
          role: input.role,
          recepientId: recepientUser?.id,
          recepientEmail: input.email,
          senderId: ctx.session.user.id,
        },
      });

      const mailOptions = await BASIC_EMAIL({
        recevierEmail: input.email,
        subject: "You have been invited to join a workspace on Taskflow",
        body: ` ${
          recepientUser?.name ? recepientUser.name : ""
        } You have been invited to join a workspace on Taskflow. Please click on the link below to join the workspace.
        <br/>
        Sign in and visit:
        <br/>
        https://taskflow.space/invitation/${invitation?.id}
        <br/>
        Regards
        <br/>
        `,
      });
      // send pusher event to board channel
      if (recepientUser?.id) {
        await ctx.pusher.trigger(
          `user-${recepientUser?.id}`,
          "invitation:update",
          {}
        );
      }

      return ctx.sendEmail(mailOptions);
    }),
  cancelInvite: protectedProcedure
    .input(z.object({ workspaceInvitaionId: z.string() }))
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
      if (invitation.senderId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not the sender of this invite.",
        });
      }
      await ctx.prisma.workspaceMemberInvitation.delete({
        where: { id: input.workspaceInvitaionId },
      });
      if (invitation.recepientId) {
        await ctx.pusher.trigger(
          `user-${invitation.recepientId}`,
          "invitation:update",
          {}
        );
      }
      return;
    }),

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

      const deleteWorkspaceInvitation =
        ctx.prisma.workspaceMemberInvitation.delete({
          where: { id: input.workspaceInvitaionId },
        });
      transactions.push(deleteWorkspaceInvitation);

      if (isAlreadyMember) {
        await deleteWorkspaceInvitation;
        throw new TRPCError({
          code: "CONFLICT",
          message: "You are already a member of the workspace.",
        });
      }
      await ctx.prisma.$transaction(transactions);

      await ctx.pusher.trigger(
        `user-${invitation.senderId}`,
        "invitation:response",
        {}
      );

      return input.accept;
    }),

  getAllPendingInvitations: protectedProcedure
    .input(z.object({ workspaceId: z.string() }))
    .query(async ({ ctx, input }) => {
      const hasPermission = await ctx.prisma.workspaceMember.findFirst({
        where: {
          workspaceId: input.workspaceId,
          userId: ctx.session.user.id,
          role: { in: ["OWNER", "ADMIN"] },
        },
      });

      if (!hasPermission || !hasPermission.role) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You dont have permission to view pending invitations.",
        });
      }

      return ctx.prisma.workspaceMemberInvitation.findMany({
        where: {
          workspaceId: input.workspaceId,
        },
        include: {
          sender: {
            select: {
              name: true,
              email: true,
              image: true,
            },
          },
          recepient: {
            select: {
              name: true,
              email: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),

  getAllMyReceviedInvites: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.workspaceMemberInvitation.findMany({
      where: {
        recepientId: ctx.session.user.id,
      },
      include: {
        Workspace: { select: { name: true } },
        sender: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
        recepient: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),
  getAllMySentInvites: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.workspaceMemberInvitation.findMany({
      where: {
        senderId: ctx.session.user.id,
      },
      include: {
        Workspace: { select: { name: true } },
        sender: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
        recepient: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
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
          members: { create: { role: "OWNER", userId: ctx.session.user.id } },
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
  transferWorkspaceOwnership: protectedProcedure
    .input(TransferWorkspaceOwnershipSchema)
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
      const hasPermission = await ctx.prisma.workspaceMember.findFirst({
        where: {
          workspaceId: input.workspaceId,
          userId: ctx.session.user.id,
          role: "OWNER",
        },
      });

      if (!hasPermission) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "You dont have permission to transfer ownership of this workspace.",
        });
      }
      // check if the user already in the workspace , then update his role
      const user = await ctx.prisma.user.findUnique({
        where: { email: input.email },
      });
      // TODO: if user not found, send email to invite
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found with the email.",
        });
      }

      const isAlreadyMember = await ctx.prisma.workspaceMember.findFirst({
        where: {
          workspaceId: input.workspaceId,
          userId: user.id,
        },
      });
      const transactions = [];

      const createWorkspaceMember = ctx.prisma.workspaceMember.create({
        data: {
          workspaceId: input.workspaceId,
          role: "OWNER",
          userId: user.id,
        },
      });
      const updateNewOwnerRole = ctx.prisma.workspaceMember.update({
        where: { id: isAlreadyMember?.id },
        data: { role: "OWNER" },
      });

      transactions.push(
        isAlreadyMember ? updateNewOwnerRole : createWorkspaceMember
      );

      const updateOldOwnerRole = ctx.prisma.workspaceMember.update({
        where: { id: hasPermission?.id },
        data: { role: "ADMIN" },
      });
      transactions.push(updateOldOwnerRole);

      await ctx.prisma.$transaction(transactions);
    }),

  leaveWorkspace: protectedProcedure
    .input(z.object({ workspaceId: z.string() }))
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
      const hasPermission = await ctx.prisma.workspaceMember.findFirst({
        where: {
          workspaceId: input.workspaceId,
          userId: ctx.session.user.id,
          role: { in: ["ADMIN", "MEMBER"] },
        },
      });

      if (!hasPermission) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You dont have permission to leave this workspace.",
        });
      }
      return ctx.prisma.workspaceMember.delete({
        where: {
          id: hasPermission.id,
        },
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
          role: "OWNER",
        },
      });

      if (!hasPermission) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You dont have permission to rename this workspace.",
        });
      }

      return ctx.prisma.workspace.delete({
        where: { id: input.workspaceId },
      });
    }),
});

import { TRPCError } from "@trpc/server";
import { LexoRank } from "lexorank";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { ALLOWED_ROLES_TO_INVITE } from "~/utils/AllowedRolesToInvite";
import { BASIC_EMAIL } from "~/utils/email-templates/EmailTemplates";
import {
  CreateListSchema,
  CreateTaskSchema, CreateWorkspaceInvitation, MoveTaskSchema,
  UpdateBoardSchema,
  UpdateListSchema, UpdateTaskSchema
} from "~/utils/ValidationSchema";

export const BoardRouter = createTRPCRouter({
  getWorkspaceMembers: protectedProcedure
    .input(z.object({ workspaceId: z.string() }))
    .query(async ({ ctx, input }) => {
      const hasPermission = await ctx.prisma.workspaceMember.findFirst({
        where: {
          workspaceId: input.workspaceId,
          userId: ctx.session.user.id,
        }
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
              image: true
            }
          }
        },
        orderBy: {
          role: "asc"
        }
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
        }
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

      const ALLOWED_ROLES = ALLOWED_ROLES_TO_INVITE[hasPermission.role]

      if (!ALLOWED_ROLES.includes(input.role as never)) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You dont have permission to invite member with selected role.",
        });
      }

      const isMember = await ctx.prisma.workspaceMember.count({
        where: {
          workspaceId: input.workspaceId,
          user: { email: input.email }
        },
      });

      if (isMember) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already a member.",
        });
      }
      const isAlreadyInvited = await ctx.prisma.workspaceMemberInvitation.count({
        where: {
          workspaceId: input.workspaceId,
          recepientEmail: input.email,
        },
      });
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
        body: ` ${recepientUser?.name ? recepientUser.name : ""} You have been invited to join a workspace on Taskflow. Please click on the link below to join the workspace.
        <br/>
        Sign in and visit:
        <br/>
        https://taskflow.space/invitation/${invitation?.id}
        <br/>
        Regards
        <br/>
        `,
      });
      return ctx.sendEmail(mailOptions);

    }),

  getAllPendingInvitations: protectedProcedure
    .input(z.object({ workspaceId: z.string() }))
    .query(async ({ ctx, input }) => {

      const hasPermission = await ctx.prisma.workspaceMember.findFirst({
        where: {
          workspaceId: input.workspaceId,
          userId: ctx.session.user.id,
          role: { in: ["OWNER", "ADMIN"] },
        }
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
              image: true
            }
          },
          recepient: {
            select: {
              name: true,
              email: true,
              image: true
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        }
      });
    }),

  getAllMyInvites: protectedProcedure
    .query(async ({ ctx }) => {
      return ctx.prisma.workspaceMemberInvitation.findMany({
        where: {
          recepientId: ctx.session.user.id,
        },
        include: {
          Workspace: { select: { name: true, } },
          sender: {
            select: {
              name: true,
              email: true,
              image: true
            }
          },
          recepient: {
            select: {
              name: true,
              email: true,
              image: true
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        }
      });
    }),

  getBoard: protectedProcedure
    .input(z.object({ boardId: z.string() }))
    .query(async ({ ctx, input }) => {
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

      return ctx.prisma.task.create({
        data: {
          title: input.title,
          listId: input.listId,
          rank,
        },
      });
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

  // List
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

      return ctx.prisma.list.create({
        data: {
          boardId: input.boardId,
          name: input.name,
        },
      });
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

      return ctx.prisma.task.deleteMany({
        where: { listId: input.listId },
      });

    }),
});

import { TRPCError } from "@trpc/server";
import { LexoRank } from "lexorank";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import {
  CreateTaskSchema, MoveTaskSchema, UpdateTaskMemberSchema, UpdateTaskSchema
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
        select: { workspaceId: true, id: true },
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
      // send pusher event to board channel 
      await ctx.pusher.trigger(`board-${board.id}`, "task:created", {
        task: newTask,
        listId: input.listId,
        initiatorId: ctx.session.user.id,
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
        include: {
          members: {
            include: {
              user: {
                select: {
                  email: true,
                  name: true,
                  image: true
                }
              }
            }
          }
        }
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
        select: { workspaceId: true, id: true },
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


      const updatedTask = await ctx.prisma.task.update({
        where: { id: input.taskId },
        data: {
          title: input.title,
          description: input.description,
        },
      });
      console.log(updatedTask)
      // send pusher event to board channel 
      await ctx.pusher.trigger(`board-${board.id}`, "task:updated", {
        task: updatedTask,
        listId: task.listId,
        initiatorId: ctx.session.user.id,
      });
      return updatedTask;
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

      await ctx.prisma.task.update({
        where: { id: input.taskId },
        data: {
          listId: input.newListId,
          rank: input.newRank,
        },
      });
      // send lists to update
      // send pusher event to board channel 
      await ctx.pusher.trigger(`board-${list.boardId}`, "task:moved", {
        lists: [task.listId, input.newListId],
        initiatorId: ctx.session.user.id,
      });

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
      await ctx.prisma.task.delete({
        where: { id: input.taskId },
      });
      // send pusher event to board channel 
      await ctx.pusher.trigger(`board-${list.boardId}`, "task:deleted", {
        task: { id: input.taskId },
        listId: task.listId,
        initiatorId: ctx.session.user.id,
      });
      return;
    }),

  // Task member
  updateTaskMember: protectedProcedure
    .input(UpdateTaskMemberSchema)
    .mutation(async ({ ctx, input }) => {
      console.log(input)
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
      if (!input.isMember) {
        const taskMember = await ctx.prisma.taskMember.findFirst({
          where: {
            taskId: input.taskId,
            userId: input.userId
          }
        })
        if (!taskMember) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "User is not a member this task.",
          });
        }
        await ctx.prisma.taskMember.delete({
          where: { id: taskMember.id }
        });

      } else {
        await ctx.prisma.taskMember.create({
          data: {
            taskId: input.taskId,
            userId: input.userId,
          },
        });
      }
      // send pusher event to board channel 
      return ctx.pusher.trigger(`board-${list.boardId}`, "task-member:updated", {
        task: { id: input.taskId },
        initiatorId: ctx.session.user.id,
      });
    }),
});

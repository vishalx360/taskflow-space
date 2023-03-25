import { LexoRank } from "lexorank";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  CreateListSchema,
  CreateTaskSchema,
  MoveTaskSchema,
  UpdateBoardSchema,
  UpdateListSchema,
  UpdateTaskSchema,
} from "~/utils/ValidationSchema";

export const BoardRouter = createTRPCRouter({
  getBoard: protectedProcedure
    .input(z.object({ boardId: z.string() }))
    .query(({ ctx, input }) => {
      console.log(input.boardId);
      return ctx.prisma.board.findUnique({
        where: { id: input.boardId },
        include: {
          lists: true,
          members: {
            select: { name: true, email: true, image: true },
          },
        },
      });
    }),

  updateBoard: protectedProcedure
    .input(UpdateBoardSchema)
    .mutation(async ({ ctx, input }) => {
      const board = await ctx.prisma.board.findUnique({
        where: { id: input.boardId },
        select: { members: true },
      });
      if (!board) {
        throw new Error("Board not found");
      }

      const hasPermission = board.members.find(
        (member) => member.id === ctx.session.user.id
      );
      if (!hasPermission) {
        throw new Error("Unauthorized");
      }

      return ctx.prisma.board.update({
        where: { id: input.boardId },
        data: {
          name: input.name,
        },
      });
    }),

  deleteBoard: protectedProcedure
    .input(z.object({ boardId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // check if list belongs to user
      const board = await ctx.prisma.board.findUnique({
        where: { id: input.boardId },
        select: { members: true },
      });
      if (!board) {
        throw new Error("Board not found");
      }

      const hasPermission = board.members.find(
        (member) => member.id === ctx.session.user.id
      );
      if (!hasPermission) {
        throw new Error("Unauthorized");
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
        throw new Error("List not found");
      }
      // check if list belongs to user
      const board = await ctx.prisma.board.findUnique({
        where: { id: list.boardId },
        select: { workspaceId: true, members: true },
      });
      if (!board) {
        throw new Error("Board not found");
      }
      const hasPermission = board.members.find(
        (member) => member.id === ctx.session.user.id
      );

      if (!hasPermission) {
        throw new Error("Unauthorized");
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

  updateTask: protectedProcedure
    .input(UpdateTaskSchema)
    .mutation(async ({ ctx, input }) => {
      const task = await ctx.prisma.task.findUnique({
        where: { id: input.taskId },
        select: { listId: true },
      });
      if (!task) {
        throw new Error("Task not found");
      }
      // check if list exists
      const list = await ctx.prisma.list.findUnique({
        where: { id: task.listId },
        select: { boardId: true },
      });
      if (!list) {
        throw new Error("List not found");
      }
      // check if list belongs to user
      const board = await ctx.prisma.board.findUnique({
        where: { id: list.boardId },
        select: { workspaceId: true, members: true },
      });
      if (!board) {
        throw new Error("Board not found");
      }

      const hasPermission = board.members.find(
        (member) => member.id === ctx.session.user.id
      );
      if (!hasPermission) {
        throw new Error("Unauthorized");
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
        throw new Error("Task not found");
      }
      // check if list exists
      const list = await ctx.prisma.list.findUnique({
        where: { id: task.listId },
        select: { boardId: true },
      });
      if (!list) {
        throw new Error("List not found");
      }
      // check if list belongs to user
      const board = await ctx.prisma.board.findUnique({
        where: { id: list.boardId },
        select: { workspaceId: true, members: true },
      });
      if (!board) {
        throw new Error("Board not found");
      }

      const hasPermission = board.members.find(
        (member) => member.id === ctx.session.user.id
      );
      if (!hasPermission) {
        throw new Error("Unauthorized");
      }

      // if putting on empty list
      let rank = LexoRank.middle().toString();

      let updatePrevTaskBucket;
      let updateNextTaskBucket;
      // get previous task and next task
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
      console.log("--------INPUT-START--------");
      console.log({
        ...input,
        prevTaskRank: prevTask?.rank,
        nextTaskRank: nextTask?.rank,
      });
      console.log("--------INPUT-END--------");

      // TODO: check for rebalancing
      // if new rank if euqal to nextTask rank, then rebalance to next bucket
      // if putting in middle, both next and prev exist
      if (prevTask && nextTask) {
        console.log(
          "--------putting in middle, both next and prev exist : ",
          prevTask?.rank,
          nextTask?.rank
        );
        rank = LexoRank.parse(prevTask?.rank)
          .between(LexoRank.parse(nextTask?.rank))
          .toString();
        console.log(
          "xxxxxxxxxxxxx:   ",
          rank,
          LexoRank.parse(nextTask?.rank).toString()
        );

        if (rank === LexoRank.parse(nextTask?.rank).toString()) {
          // generate new rank for prevtask currenttask nexttask in new bucket
          console.log(
            "xxxxxxxxxxxxx:   ",
            LexoRank.parse(nextTask?.rank).inNextBucket()
          );
        }
      }
      // if putting on bottom and prev exist
      if (prevTask && !nextTask) {
        console.log("--------putting on top and next exist : ", prevTask?.rank);
        rank = LexoRank.parse(prevTask?.rank).genNext().toString();
      }
      // if putting on top and next exist
      if (!prevTask && nextTask) {
        console.log("--------putting on top and next exist : ", nextTask?.rank);
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
        throw new Error("Task not found");
      }
      // check if list exists
      const list = await ctx.prisma.list.findUnique({
        where: { id: task.listId },
        select: { boardId: true },
      });
      if (!list) {
        throw new Error("List not found");
      }
      // check if list belongs to user
      const board = await ctx.prisma.board.findUnique({
        where: { id: list.boardId },
        select: { workspaceId: true, members: true },
      });
      if (!board) {
        throw new Error("Board not found");
      }

      const hasPermission = board.members.find(
        (member) => member.id === ctx.session.user.id
      );
      if (!hasPermission) {
        throw new Error("Unauthorized");
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
        select: { workspaceId: true, members: true },
      });
      if (!board) {
        throw new Error("Board not found");
      }

      const hasPermission = board.members.find(
        (member) => member.id === ctx.session.user.id
      );
      if (!hasPermission) {
        throw new Error("Unauthorized");
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
        throw new Error("List not found");
      }
      // check if list belongs to user
      const board = await ctx.prisma.board.findUnique({
        where: { id: list.boardId },
        select: { workspaceId: true, members: true },
      });
      if (!board) {
        throw new Error("Board not found");
      }

      const hasPermission = board.members.find(
        (member) => member.id === ctx.session.user.id
      );
      if (!hasPermission) {
        throw new Error("Unauthorized");
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
        throw new Error("List not found");
      }
      // check if list belongs to user
      const board = await ctx.prisma.board.findUnique({
        where: { id: list.boardId },
        select: { workspaceId: true, members: true },
      });
      if (!board) {
        throw new Error("Board not found");
      }

      const hasPermission = board.members.find(
        (member) => member.id === ctx.session.user.id
      );
      if (!hasPermission) {
        throw new Error("Unauthorized");
      }

      return ctx.prisma.list.delete({
        where: { id: input.listId },
      });
    }),
});

import { createTRPCRouter } from "./fastify_trpc";
import { AuthenticationRouter } from "./routers/authentication";
import { BoardRouter } from "./routers/board";
import { ListRouter } from "./routers/list";
import { TaskRouter } from "./routers/task";
import { WorkspaceRouter } from "./routers/workspace";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  workspace: WorkspaceRouter,
  board: BoardRouter,
  list: ListRouter,
  task: TaskRouter,
  authentication: AuthenticationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

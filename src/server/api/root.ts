import { createTRPCRouter } from "./fastify_trpc";
import { AuthenticationRouter } from "./routers/authentication";
import { BoardRouter } from "./routers/board";
import { DashboardRouter } from "./routers/dashboard";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  dashboard: DashboardRouter,
  board: BoardRouter,
  authentication: AuthenticationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

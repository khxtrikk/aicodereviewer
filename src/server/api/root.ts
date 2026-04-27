import { createCallerFactory, createTRPCRouter, publicProcedure } from "./trpc";
import { repositoryRouter } from "./routers/repository";
import { pullRequestRouter } from "./routers/pull-request";
import { reviewRouter } from "./routers/review";

export const appRouter = createTRPCRouter({
    health: publicProcedure.query(() => {
        return { status: 'ok', timestamp: Date.now() };
    }),
    repository: repositoryRouter,
    pullRequest: pullRequestRouter,
    review: reviewRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
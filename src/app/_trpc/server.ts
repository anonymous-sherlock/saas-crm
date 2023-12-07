import { appRouter } from "@/server/index";
import { httpBatchLink } from "@trpc/client";
export const server = appRouter.createCaller({
    req: {} as Request
});



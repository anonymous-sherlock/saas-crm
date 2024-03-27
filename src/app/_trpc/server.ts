import { appRouter } from "@/server/index";
export const server = appRouter.createCaller({
    req: {} as Request
});



import { appRouter } from "@/server/index";
import { httpBatchLink } from "@trpc/client";
const url = process.env.NODE_ENV === "production" ? "your-production-url/api/trpc" : "http://localhost:3000/api/trpc";
export const serverClient = appRouter.createCaller({
  links: [
    httpBatchLink({
      url,
    }),
  ],
});

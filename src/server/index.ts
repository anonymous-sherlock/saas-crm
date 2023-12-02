import { getAuthSession } from "@/lib/authOption";
import { TRPCError, inferRouterOutputs } from "@trpc/server";
import { campaignRouter } from "./routers/campaign";
import { leadRouter } from "./routers/lead";
import { productRouter } from "./routers/product";
import { userRouter } from "./routers/user";
import { publicProcedure, router } from "./trpc";

export const appRouter = router({
  authCallback: publicProcedure.query(async () => {
    const session = await getAuthSession();
    if (!session) throw new TRPCError({ code: "UNAUTHORIZED" });
    const { user } = session;
    if (!user.id || !user.email) throw new TRPCError({ code: "UNAUTHORIZED" });

    return { success: true };
  }),

  user: userRouter,
  campaign: campaignRouter,
  product: productRouter,
  lead: leadRouter,
});

export type AppRouter = typeof appRouter;
export type RouterOutputs = inferRouterOutputs<AppRouter>;

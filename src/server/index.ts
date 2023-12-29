import { getAuthSession } from "@/lib/authOption";
import { TRPCError, inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { campaignRouter } from "./routers/campaign.router";
import { leadRouter } from "./routers/lead.router";
import { productRouter } from "./routers/product.router";
import { userRouter } from "./routers/user.router";
import { publicProcedure, router } from "./trpc";
import { inferReactQueryProcedureOptions } from "@trpc/react-query";
import { analyticsRouter } from "./routers/analytics.router";
import { adminRouter } from "./routers/admin.router";
import { authRouter } from "./routers/auth.router";

export const appRouter = router({
  authCallback: publicProcedure.query(async ({ }) => {
    const session = await getAuthSession();
    if (!session) throw new TRPCError({ code: "UNAUTHORIZED" });
    const { user } = session;
    if (!user.id || !user.email) throw new TRPCError({ code: "UNAUTHORIZED" });

    return { success: true };
  }),
  auth: authRouter,
  user: userRouter,
  campaign: campaignRouter,
  product: productRouter,
  lead: leadRouter,
  analytics: analyticsRouter,
  admin: adminRouter
});

export type AppRouter = typeof appRouter;
export type ReactQueryOptions = inferReactQueryProcedureOptions<AppRouter>;
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;

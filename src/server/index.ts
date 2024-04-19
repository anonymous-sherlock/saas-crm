import { inferReactQueryProcedureOptions } from "@trpc/react-query";
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { analyticsRouter } from "./routers/analytics.router";
import { authRouter } from "./routers/auth.router";
import { campaignRouter } from "./routers/campaign.router";
import { leadRouter } from "./routers/lead.router";
import { mediaRouter } from "./routers/media.router";
import { notificationRouter } from "./routers/notification.router";
import { searchRouter } from "./routers/search.router";
import { userRouter } from "./routers/user.router";
import { router } from "./trpc";
import { walletRouter } from "./routers/wallet.router";

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  campaign: campaignRouter,
  lead: leadRouter,
  analytics: analyticsRouter,
  notification: notificationRouter,
  media: mediaRouter,
  search: searchRouter,
  wallet: walletRouter,
});

export type AppRouter = typeof appRouter;
export type ReactQueryOptions = inferReactQueryProcedureOptions<AppRouter>;
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;

import { inferReactQueryProcedureOptions } from "@trpc/react-query";
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { adminRouter } from "./routers/admin.router";
import { analyticsRouter } from "./routers/analytics.router";
import { authRouter } from "./routers/auth.router";
import { campaignRouter } from "./routers/campaign.router";
import { leadRouter } from "./routers/lead.router";
import { productRouter } from "./routers/product.router";
import { userRouter } from "./routers/user.router";
import { router } from "./trpc";
import { notificationRouter } from "./routers/notification.router";
import { mediaRouter } from "./routers/media.router";
import { searchRouter } from "./routers/search.router";

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  campaign: campaignRouter,
  product: productRouter,
  lead: leadRouter,
  analytics: analyticsRouter,
  admin: adminRouter,
  notification: notificationRouter,
  media: mediaRouter,
  search: searchRouter,
});

export type AppRouter = typeof appRouter;
export type ReactQueryOptions = inferReactQueryProcedureOptions<AppRouter>;
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;

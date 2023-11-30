import { TRPCError, inferRouterOutputs } from "@trpc/server";
import { privateProcedure, publicProcedure, router } from "./trpc";
import { userRouter } from "./routers/user";
import { campaignRouter } from "./routers/campaign";
import { productRouter } from "./routers/product";
import { leadRouter } from "./routers/lead";
import { db } from "@/db";
import { getAuthSession } from "@/lib/authOption";



export const appRouter = router({
  authCallback: publicProcedure.query(async () => {
    const session = await getAuthSession()
    if (!session) throw new TRPCError({ code: 'UNAUTHORIZED' })

    const user = session?.user
    if (!user.id || !user.email)
      throw new TRPCError({ code: 'UNAUTHORIZED' })


    return { success: true }
  }),

  user: userRouter,
  campaign: campaignRouter,
  product: productRouter,
  lead: leadRouter,

});

export type AppRouter = typeof appRouter;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
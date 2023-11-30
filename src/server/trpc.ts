import { getAuthSession } from "@/lib/authOption";
import { TRPCError, initTRPC } from "@trpc/server";

const t = initTRPC.create({});
const middleware = t.middleware;

const isAuth = middleware(async (opts) => {
  const session = await getAuthSession();
  if (!session) throw new TRPCError({ code: "UNAUTHORIZED" });
  const { user } = session;

  if (!user || !user.id) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return opts.next({
    ctx: {
      userId: user.id,
      user,
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuth);

import { getAuthSession } from "@/lib/authOption";
import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

import { ZodError } from "zod";

export const createTRPCContext = async (opts: FetchCreateContextFnOptions) => {
  const req = opts.req;
  return { req };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});
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
      actor: user.actor,
      isImpersonating: user.isImpersonating
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuth);

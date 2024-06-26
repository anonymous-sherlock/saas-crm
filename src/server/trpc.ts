import { TRPCError, initTRPC } from "@trpc/server";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import superjson from "superjson";

import { getCurrentUser } from "@/lib/auth";
import { allowedAdminRoles } from "@/lib/auth.permission";
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
  const user = await getCurrentUser();
  if (!user || !user.id) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return opts.next({
    ctx: {
      userId: user.id,
      user,
      actor: user.actor,
      isImpersonating: user.isImpersonating,
    },
  });
});
const isAdminAuth = middleware(async (opts) => {
  const user = await getCurrentUser();
  if (!user || !user.id) throw new TRPCError({ code: "UNAUTHORIZED" });
  const isAdmin = allowedAdminRoles.some((role) => role === user?.role);
  if (!isAdmin) throw new TRPCError({ code: "UNAUTHORIZED", message: "You Don't have permission to view this route" });

  return opts.next({
    ctx: {
      userId: user.id,
      user,
      actor: user.actor,
      isImpersonating: user.isImpersonating,
    },
  });
});
export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuth);
export const adminProcedure = t.procedure.use(isAdminAuth);

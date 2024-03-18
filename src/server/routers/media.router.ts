import { db } from "@/db";
import { privateProcedure, router } from "@/server/trpc";
import { z } from "zod";

export const mediaRouter = router({
  getMedia: privateProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 50;
      const { cursor } = input;

      const { user } = ctx;
      const actor = ctx.actor;
      const companyId = actor ? actor.company.id : user.company.id;
      const userId = actor ? actor.userId : user.id;

      const mediafiles = await db.media.findMany({
        where: {
          OR: [{ companyId: companyId }, { userId: userId }],
        },
        orderBy: { createdAt: "desc" },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (mediafiles && mediafiles?.length > limit) {
        const nextItem = mediafiles.pop();
        nextCursor = nextItem!.id;
      }
      return {
        mediafiles,
        nextCursor,
      };
    }),
});

export type MediaRouterType = typeof mediaRouter;

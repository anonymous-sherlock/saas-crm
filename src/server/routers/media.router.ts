import { db } from "@/db";
import { adminProcedure, privateProcedure, router } from "@/server/trpc";
import { Prisma } from "@prisma/client";
import { z } from "zod";

export const mediaRouter = router({
  getUserMedia: privateProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
        userId: z.string().optional().nullable(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 50;
      const { cursor, userId: inputUserId } = input;
      const { user } = ctx;
      const actor = ctx.actor;
      const companyId = actor ? actor.company.id : user.company.id;
      const userId = actor ? actor.userId : user.id;
      const where: Prisma.MediaWhereInput = {
        AND: [inputUserId && inputUserId ? { userId: inputUserId } : { OR: [{ companyId: companyId }, { userId: userId }] }],
      };
      const mediafiles = await db.media.findMany({
        where: where,
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
  getAllMedia: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 50;
      const { cursor } = input;
      const where: Prisma.MediaWhereInput = {};
      const mediafiles = await db.media.findMany({
        where: where,
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

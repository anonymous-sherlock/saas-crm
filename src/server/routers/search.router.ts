import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";
import { db } from "@/db";
import { privateProcedure, router } from "@/server/trpc";
import { z } from "zod";

export const searchRouter = router({
  getProducts: privateProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { userId, actor, isImpersonating } = ctx;
      const { cursor } = input;
      const limit = input.limit ?? INFINITE_QUERY_LIMIT;

      const products = await db.product.findMany({
        take: limit + 1,
        where: {
          ownerId: isImpersonating ? actor.userId : userId,
        },
        orderBy: {
          createdAt: "desc",
        },
        cursor: cursor ? { productId: cursor } : undefined,
        select: {
          productId: true,
          name: true,
          images: true,
          category: true,
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (products.length > limit) {
        const nextItem = products.pop();
        nextCursor = nextItem?.productId;
      }

      return {
        products,
        nextCursor,
      };
    }),
});

export type SearchRouter = typeof searchRouter;

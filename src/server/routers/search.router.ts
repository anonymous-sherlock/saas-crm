import { db } from "@/db";
import { privateProcedure, router } from "@/server/trpc";
import { z } from "zod";

const productSearchInput = z.object({
  q: z.string().nullish(),
  limit: z.number().min(1).max(100).nullish(),
  cursor: z.string().nullish(),
});
export const searchRouter = router({
  getProducts: privateProcedure.input(productSearchInput).query(async ({ ctx, input }) => {
    const limit = input.limit ?? 50;
    const { cursor, q } = input;
    const { user, actor } = ctx;
    const userId = actor ? actor.userId : user.id;
    const searchString = q
      ?.split(" ")
      .filter((word) => word.length > 0)
      .join(" & ");

    const products = await db.product.findMany({
      where: { ownerId: userId, OR: [{ name: { search: searchString } }, { name: { contains: searchString } }, { id: { contains: searchString } }] },
      orderBy: { createdAt: "desc" },
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      select: {
        id: true,
        name: true,
        description: true,
        images: {
          include: { media: true },
        },
        category: true,
      },
    });
    let nextCursor: typeof cursor | undefined = undefined;
    if (products && products?.length > limit) {
      const nextItem = products.pop();
      nextCursor = nextItem!.id;
    }
    return {
      products,
      nextCursor,
    };
  }),
});

export type SearchRouter = typeof searchRouter;

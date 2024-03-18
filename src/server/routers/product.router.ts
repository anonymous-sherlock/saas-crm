import { db } from "@/db";
import { parsePrice } from "@/lib/helpers";
import { productFormSchema } from "@/schema/product.schema";
import { privateProcedure, router } from "@/server/trpc";
import { fileMetaDetailsSchema } from "@/types/fileUpload";
import { TRPCError } from "@trpc/server";
import { endOfDay, startOfDay } from "date-fns";
import { z } from "zod";

const getAllSearchQuery = z.object({
  date: z
    .object({
      from: z.date().optional(),
      to: z.date().optional(),
    })
    .optional()
    .nullable(),
});
export const productRouter = router({
  get: privateProcedure.input(z.object({ productId: z.string() })).query(async ({ ctx, input }) => {
    const { userId, isImpersonating, actor } = ctx;
    const product = await db.product.findFirst({
      where: {
        id: input.productId,
        ownerId: isImpersonating ? actor.userId : userId,
      },
      include: {
        images: {
          include: {
            media: true,
          },
        },
        media: true,
      },
    });

    if (!product) throw new TRPCError({ code: "NOT_FOUND", message: "product not found" });
    return product;
  }),
  getAll: privateProcedure.input(getAllSearchQuery).query(async ({ ctx, input }) => {
    const { user, actor } = ctx;
    const userId = actor ? actor.userId : user.id;
    const { date } = input;
    const today = new Date();
    const startDay = date?.from ? startOfDay(date.from) : undefined;
    const endDay = date?.to ? endOfDay(date.to) : (startDay ? endOfDay(startDay) : undefined);

    console.log(startDay, " to ", endDay);
    const products = await db.product.findMany({
      where: {
        ownerId: userId,
        createdAt: {
          gte: startDay,
          lte: endDay,
        },
      },
      include: {
        images: {
          include: {
            media: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!products) throw new TRPCError({ code: "NOT_FOUND", message: "Products not found" });

    return products;
  }),

  deleteProduct: privateProcedure
    .input(
      z.object({
        productIds: z
          .string({
            required_error: "product Id is required to delete a product",
          })
          .array(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, isImpersonating, actor } = ctx;
      const { productIds } = input;
      const products = await db.product.findMany({
        where: {
          ownerId: isImpersonating ? actor.userId : userId,
          id: {
            in: productIds,
          },
        },
      });
      if (!products)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });

      const deletedProduct = await db.product.deleteMany({
        where: {
          ownerId: isImpersonating ? actor.userId : userId,
          id: {
            in: productIds,
          },
        },
      });
      const deletedCount = deletedProduct.count;
      return {
        success: "true",
        deletedProduct,
        deletedCount,
      };
    }),
  update: privateProcedure
    .input(
      z.object({
        product: productFormSchema,
        files: z.array(fileMetaDetailsSchema),
        productId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { productName, productCategory, productPrice, productQuantity, productDescription, productImages, mediaUrls } = input.product;
      const { files, productId } = input;
      const { userId, isImpersonating, actor } = ctx;
      const price = parsePrice(productPrice);
      const updatedProduct = await db.product.update({
        where: {
          id: productId,
          ownerId: isImpersonating ? actor.userId : userId,
        },
        data: {
          name: productName,
          price: price,
          quantity: Number(productQuantity),
          description: productDescription,
          ownerId: isImpersonating ? actor.userId : userId,
          category: productCategory,
          media: {
            deleteMany: {
              productMediaId: productId,
            },
            createMany: {
              skipDuplicates: true,
              // Use createMany to add new media
              data: (mediaUrls || [])
                .filter((url) => url.value !== undefined && url.value.trim() !== "")
                .map((url) => ({
                  url: url.value!,
                })),
            },
          },
        },
      });
    }),
});

export type ProductRouter = typeof productRouter;

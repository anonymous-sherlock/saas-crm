import { db } from "@/db";
import { parsePrice } from "@/lib/helpers";
import { productFormSchema } from "@/schema/productSchema";
import { privateProcedure, router } from "@/server/trpc";
import { fileMetaDetailsSchema } from "@/types/fileUpload";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const productRouter = router({
  get: privateProcedure.input(z.object({ productId: z.string() })).query(async ({ ctx, input }) => {
    const { userId, isImpersonating, actor } = ctx
    const product = await db.product.findFirst({
      where: {
        productId: input.productId,
        ownerId: isImpersonating ? actor.userId : userId,
      },
      include: {
        images: true,
        media: true,
      },
    });

    if (!product) throw new TRPCError({ code: "NOT_FOUND", message: "product not found" });
    console.log(product);
    return product;
  }),
  getAll: privateProcedure.query(async ({ ctx }) => {
    const { userId, isImpersonating, actor } = ctx;
    const products = await db.product.findMany({
      where: {
        ownerId: isImpersonating ? actor.userId : userId,
      },
      include: {
        images: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    if (!products) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Products not found",
      });
    }

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
          productId: {
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
          productId: {
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
  add: privateProcedure
    .input(
      z.object({
        product: productFormSchema,
        files: z.array(fileMetaDetailsSchema),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { productName, productCategory, productPrice, productQuantity, productDescription, productImages, mediaUrls } = input.product;
      const { files } = input;
      const { userId, isImpersonating, actor } = ctx;
      const price = parsePrice(productPrice);

      const newProduct = await db.product.create({
        data: {
          name: productName,
          price: price,
          quantity: Number(productQuantity),
          description: productDescription,
          ownerId: isImpersonating ? actor.userId : userId,
          category: productCategory,
          images: {
            createMany: {
              data: files.map((file) => ({
                name: file.fileName,
                originalFileName: file.originalFileName,
                size: file.fileSize,
                type: file.fileType,
                url: file.fileUrl,
                uploadPath: file.uplaodPath,
              })),
            },
          },
          media: {
            createMany: {
              data: (mediaUrls || [])
                .filter((url) => url.value !== undefined && url.value.trim() !== "")
                .map((url) => ({
                  url: url.value!,
                })),
            },
          },
        },
      });
      if (!newProduct) {
        throw new TRPCError({ code: "TIMEOUT", message: "Cannot Add New Product" });
      }

      return {
        success: true,
        message: `${newProduct.name} created successfully`,
        product: newProduct,
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
          productId: productId,
          ownerId: isImpersonating ? actor.userId : userId,
        },
        data: {
          name: productName,
          price: price,
          quantity: Number(productQuantity),
          description: productDescription,
          ownerId: isImpersonating? actor.userId : userId,
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

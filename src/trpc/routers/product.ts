import { db } from "@/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { privateProcedure, router } from "@/trpc/trpc";
import { productFormSchema } from "@/schema/productSchema";
import { parsePrice } from "@/lib/helpers";
import { fileMetaDetailsSchema } from "@/types/fileUpload";


export const productRouter = router({
  getAll: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;
    const products = await db.product.findMany({
      where: {
        ownerId: userId,
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
      })
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
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const { productIds } = input;
      const products = await db.product.findMany({
        where: {
          ownerId: userId,
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
          ownerId: userId,
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

  add: privateProcedure.input(z.object({
    product: productFormSchema,
    files: z.array(fileMetaDetailsSchema),
  })).mutation(async ({ input, ctx }) => {
    const { productName, productCategory, productPrice, productQuantity, productDescription, productImages, mediaUrls } = input.product
    const { files } = input
    const { userId } = ctx
    const price = parsePrice(productPrice);

    const newProduct = await db.product.create({
      data: {
        name: productName,
        price: price,
        quantity: Number(productQuantity),
        description: productDescription,
        ownerId: userId,
        category: productCategory,
        images: {
          createMany: {
            data: files.map((file) => ({
              name: file.fileName,
              originalFileName: file.originalFileName,
              size: file.fileSize,
              type: file.fileType,
              url: file.fileUrl,
              uploadPath: file.uplaodPath
            }))
          }
        },
        media: {
          createMany: {
            data: (mediaUrls || [])
              .filter(url => url.value !== undefined && url.value.trim() !== '')
              .map((url) => ({
                url: url.value!,
              })),
          },
        },

      }
    })
    if (!newProduct) {
      throw new TRPCError({ code: "TIMEOUT", message: "Cannot Add New Product" })
    }

    return {
      success: true,
      message: `${newProduct.name} created successfully`,
      product: newProduct,
    }
  })
});

export type ProductRouter = typeof productRouter;

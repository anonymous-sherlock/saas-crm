"use server";

import { db } from "@/db";
import { ProductFormSchemaType, productDeleteScheme, productFormSchema } from "@/schema/product.schema";
import { revalidatePath } from "next/cache";
import { pages } from "routes";
import { z } from "zod";
import { getActorUser, getCurrentUser } from "../auth";
import { getProductById } from "../data/products.data";
import { catchError } from "../utils";

interface upsertProductProps {
  data: Partial<ProductFormSchemaType>;
  productId?: string;
  type: "update" | "create";
}

export async function upsertProduct({ data, type, productId }: upsertProductProps) {
  const user = await getCurrentUser();
  if (!user) return { error: "Unauthorized: Please log in to your account" };
  const actor = await getActorUser(user);
  const userId = actor ? actor.userId : user.id;
  try {
    if (type === "create") {
      const createProductData = productFormSchema.safeParse(data);
      if (!createProductData.success) return { error: "Invalid data passed. Please check the provided information." };
      const { productName, productPrice, productQuantity, productDescription, mediaUrls, productCategory, productImages } = createProductData.data;
      const newProduct = await db.product.create({
        data: {
          name: productName,
          price: parseInt(productPrice) ?? undefined,
          quantity: Number(productQuantity),
          description: productDescription,
          ownerId: userId,
          category: productCategory,
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
      await upsertProductImages(newProduct.id, productImages);
      if (!newProduct) {
        return { code: "TIMEOUT", error: "Cannot Add New Product" };
      }
      revalidatePath("/products");
      return { success: `${newProduct.name} created successfully` };
    }
    if (type === "update") {
      if (!productId) return { error: "Product id not provide" };
      const existingProduct = await db.product.findFirst({ where: { id: productId } });
      if (!existingProduct) return { error: "No Product found" };
      const updateProductParsedData = productFormSchema.partial().safeParse(data);
      if (!updateProductParsedData.success) return { error: "Invalid data passed. Please check the provided information." };
      const { productName, productPrice, productQuantity, productDescription, mediaUrls, productCategory, productImages } = updateProductParsedData.data;

      const updatedProduct = await db.product.update({
        where: {
          id: productId,
          ownerId: userId,
        },
        data: {
          name: productName,
          price: parseInt(productPrice ?? "") ?? undefined,
          quantity: Number(productQuantity),
          description: productDescription,
          ownerId: userId,
          category: productCategory,
          media: {
            deleteMany: {
              productMediaId: productId,
            },
            createMany: {
              skipDuplicates: true,
              data: (mediaUrls || [])
                .filter((url) => url.value !== undefined && url.value.trim() !== "")
                .map((url) => ({
                  url: url.value!,
                })),
            },
          },
        },
      });
      await upsertProductImages(existingProduct.id, productImages);
      return { success: `${updatedProduct.name}'s details have been successfully updated.`, product: updatedProduct };
    }
  } catch (error) {
    console.log(error);
    return { error: "Uh oh! Something went wrong." };
  }
}

async function upsertProductImages(productId: string, productImages?: ProductFormSchemaType["productImages"]) {
  if (!productImages || !productImages.length) return;

  const existingMediaIds = await db.media.findMany({
    where: { id: { in: productImages.map((mediaItem) => mediaItem.id) } },
    select: { id: true },
  });

  const validMediaIds = existingMediaIds.map((mediaItem) => mediaItem.id);
  const validProductImages = productImages.filter((mediaItem) => validMediaIds.includes(mediaItem.id));

  await db.productImage.upsert({
    where: { productId },
    update: {
      media: {
        set: validProductImages.map((mediaItem) => ({ id: mediaItem.id })),
      },
    },
    create: {
      productId,
      media: {
        connect: validProductImages.map((mediaItem) => ({ id: mediaItem.id })),
      },
    },
  });
}

export async function deleteProduct(rawInput: z.infer<typeof productDeleteScheme>) {
  try {
    const parserData = productDeleteScheme.safeParse(rawInput);
    if (!parserData.success) {
      return { error: parserData.error.message ?? "Bad Request" };
    }
    const user = await getCurrentUser();
    if (!user) {
      return { error: "you are not authorized" };
    }
    const { isImpersonating, actor } = user;

    const product = await getProductById({ id: parserData.data.id, userId: isImpersonating ? actor.userId : user.id });
    if (!product) {
      return { error: "Product not found" };
    }

    const deletedProduct = await db.product.delete({
      where: { id: product.id },
    });
    revalidatePath(pages.product);
    return { success: `${deletedProduct.name} deleted successfully` };
  } catch (error) {
    catchError(error);
  }
}

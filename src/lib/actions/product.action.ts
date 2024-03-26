"use server";

import { db } from "@/db";
import { ProductFormSchemaType, productFormSchema } from "@/schema/product.schema";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getActorUser, getAuthUser, getCurrentUser } from "../auth";
import { allowedAdminRoles } from "../auth.permission";
import { getUserByUserId } from "../data/user.data";

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
interface CreateProductProps {
  data: Partial<ProductFormSchemaType>;
  userId: string;
}
export async function createProduct({ data, userId }: CreateProductProps) {
  const createProductData = productFormSchema.safeParse(data);
  if (!createProductData.success) return { error: "Invalid data passed. Please check the provided information." };
  const user = await getUserByUserId(userId);
  if (!user) return { error: "User not found" };
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
interface UpdateProductProps {
  data: Partial<ProductFormSchemaType>;
  userId: string;
  productId: string;
}
export async function updateProduct({ data, userId, productId }: UpdateProductProps) {
  const existingProduct = await db.product.findFirst({ where: { id: productId } });
  if (!existingProduct) return { error: "No Product found" };
  const updateProductParsedData = productFormSchema.partial().safeParse(data);
  if (!updateProductParsedData.success) return { error: "Invalid data passed. Please check the provided information." };
  const { productName, productPrice, productQuantity, productDescription, mediaUrls, productCategory, productImages } = updateProductParsedData.data;
  const updatedProduct = await db.product.update({
    where: { id: existingProduct.id },
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

interface upsertProductProps {
  data: Partial<ProductFormSchemaType>;
  productId?: string;
  type: "update" | "create";
  userId?: string;
}
export async function upsertProduct({ data, type, productId, userId: userIdProp }: upsertProductProps) {
  const user = await getCurrentUser();
  if (!user) return { error: "Unauthorized: Please log in to your account" };
  const actor = await getActorUser(user);
  const userId = userIdProp ?? (actor ? actor.userId : user.id);
  try {
    if (type === "create") {
      const res = await createProduct({ data: data, userId: userId });
      return res.success ? { success: res.success } : { error: res.error };
    }
    if (type === "update") {
      if (!productId) return { error: "Product id not provide" };
      const res = await updateProduct({ data: data, productId, userId });
      return res.success ? { success: res.success } : { error: res.error };
    }
  } catch (error) {
    console.log(error);
    return { error: "Uh oh! Something went wrong." };
  }
}

const productDeleteSchema = z.object({
  productIds: z.string({ required_error: "product Id is required to delete a product" }).array(),
  userId: z.string(),
});

export async function deleteProducts(rawInput: z.infer<typeof productDeleteSchema>) {
  const parserData = productDeleteSchema.safeParse(rawInput);
  if (!parserData.success) return { error: parserData.error.message ?? "Bad Request" };

  const currentUser = await getCurrentUser()
  if (!currentUser) return { error: "Unauthorized: Please log in to your account" };
  const { authUserId } = await getAuthUser();

  const user = await getUserByUserId(parserData.data.userId);
  if (!user) return { error: "User not found" };
  const isAdmin = allowedAdminRoles.some((role) => role === currentUser.role);
  const isUserAuthorized = authUserId === user.id || isAdmin;

  if (!isUserAuthorized) return { error: "Unauthorized: You don't have permission to delete products for other users" };

  const products = await db.product.findMany({ where: { ownerId: user.id, id: { in: rawInput.productIds } } });
  if (!products) return { error: "Product not found" };
  const deletedProduct = await db.product.deleteMany({ where: { ownerId: user.id, id: { in: rawInput.productIds } } });
  return { success: `Successfully deleted ${deletedProduct.count} product${deletedProduct.count > 1 ? "s" : ""}` };
}

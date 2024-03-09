"use server"

import { productDeleteScheme, productFormSchema } from "@/schema/productSchema"
import { fileMetaDetailsSchema } from "@/types/fileUpload"
import { z } from "zod"
import { getCurrentUser } from "../auth"
import { db } from "@/db"
import { revalidatePath } from "next/cache"
import { pages } from "routes"
import { server } from "@/app/_trpc/server"
import { catchError } from "../utils"
import { getProductById } from "../data/products.data"


const extendedProductSchema = productFormSchema.extend({
  productImages: z.array(fileMetaDetailsSchema).nullable(),
})


export async function addProduct(rawInput: z.infer<typeof extendedProductSchema>) {
  try {
    const parserData = extendedProductSchema.safeParse(rawInput)
    if (!parserData.success) { return { error: parserData.error.message ?? "Bad Request", } }
    const { productName, productPrice, productQuantity, productDescription, mediaUrls, productCategory, productImages } = parserData.data

    const user = await getCurrentUser()
    if (!user) { return { error: "you are not authorized", } }
    const { isImpersonating, actor } = user

    const newProduct = await db.product.create({
      data: {
        name: productName,
        price: parseInt(productPrice) ?? undefined,
        quantity: Number(productQuantity),
        description: productDescription,
        ownerId: isImpersonating ? actor.userId : user.id,
        category: productCategory,
        images: {
          createMany: {
            data: (productImages || []).map((file) => ({
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
    if (!newProduct) { return { code: "TIMEOUT", error: "Cannot Add New Product" } }
    revalidatePath(pages.product)
    return { success: `${newProduct.name} created successfully`, }
  } catch (error) {
    console.log(error)
    return { error: "Something Went Wrong", }
  }
}

export async function deleteProduct(rawInput: z.infer<typeof productDeleteScheme>) {
  try {
    const parserData = productDeleteScheme.safeParse(rawInput)
    if (!parserData.success) { return { error: parserData.error.message ?? "Bad Request", } }
    const user = await getCurrentUser()
    if (!user) { return { error: "you are not authorized", } }
    const { isImpersonating, actor } = user

    const product = await getProductById({ id: parserData.data.productId, userId: isImpersonating ? actor.userId : user.id, })
    if (!product) { return { error: "Product not found" } }

    const deletedProduct = await db.product.delete({
      where: { productId: product.productId }
    })
    revalidatePath(pages.product)
    return { success: `${deletedProduct.name} deleted successfully`, }
  } catch (error) {
    catchError(error)
  }

}
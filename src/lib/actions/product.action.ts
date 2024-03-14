"use server"

import { db } from "@/db"
import { productDeleteScheme, productFormSchema } from "@/schema/productSchema"
import { fileMetaDetailsSchema } from "@/types/fileUpload"
import { revalidatePath } from "next/cache"
import { pages } from "routes"
import { z } from "zod"
import { getCurrentUser } from "../auth"
import { getProductById } from "../data/products.data"
import { catchError } from "../utils"


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
    revalidatePath("/products")
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

    const product = await getProductById({ id: parserData.data.id, userId: isImpersonating ? actor.userId : user.id, })
    if (!product) { return { error: "Product not found" } }

    const deletedProduct = await db.product.delete({
      where: { id: product.id }
    })
    revalidatePath(pages.product)
    return { success: `${deletedProduct.name} deleted successfully`, }
  } catch (error) {
    catchError(error)
  }

}
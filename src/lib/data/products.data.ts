import { db } from "@/db";


type getProductByIdType = {
    id: string,
    userId?: string
}
export async function getProductById({ id, userId }: getProductByIdType) {
    const product = await db.product.findFirst({ where: { productId: id, ownerId: userId, } })
    return product
}
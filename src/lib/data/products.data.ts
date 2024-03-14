import { db } from "@/db";


type getProductByIdType = {
    id: string,
    userId?: string
}
export async function getProductById({ id, userId }: getProductByIdType) {
    const product = await db.product.findFirst({ where: { id: id, ownerId: userId, } })
    return product
}
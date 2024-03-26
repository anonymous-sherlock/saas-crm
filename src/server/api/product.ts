import { db } from "@/db";

type ProductApiArgs = {};
type ProductGetAllArgs = {
  userId?: string;
  date?: { from: Date | undefined; to: Date | undefined };
};
type GetSingleProductArgs = {
  userId: string;
  productId: string;
};

export class ProductApi {
  constructor(private readonly opts?: ProductApiArgs) {}
  async getAllProducts({ date, userId }: ProductGetAllArgs) {
    try {
      const products = await db.product.findMany({
        where: {
          ownerId: userId,
          createdAt: {
            gte: date?.from,
            lte: date?.to,
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

      return products;
    } catch (error) {
      console.error("Error occurred during getAllProducts:", error);
      return [];
    }
  }
  async getSingleProduct({ userId, productId }: GetSingleProductArgs) {
    try {
      const product = await db.product.findFirst({
        where: { ownerId: userId, id: productId },
        include: {
          images: {
            include: {
              media: true,
            },
          },
          media: true,
        },
        orderBy: { createdAt: "desc" },
      });
      return product;
    } catch (error) {
      console.error("Error occurred during getSingleProduct:", error);
      return null;
    }
  }
}

export const product = new ProductApi();

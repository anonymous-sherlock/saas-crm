import { db } from "@/db";
import { endOfDay, startOfDay } from "date-fns";
import { Session } from "next-auth";

type ProductApiArgs = {};
type ProductGetAllArgs = {
  userId?: string;
  date?: { from: Date | undefined; to: Date | undefined };
};
export class ProductApi {
  private user: Session["user"] | undefined = undefined;
  constructor(private readonly opts?: ProductApiArgs) {}
  async getAll({ date, userId }: ProductGetAllArgs) {
    try {
      const today = new Date();
      const startDay = date?.from ? startOfDay(date.from) : undefined;
      const endDay = date?.to ? endOfDay(date.to) : startDay ? endOfDay(startDay) : undefined;
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

      return products;
    } catch (error) {
      return [];
    }
  }
}

export const product = new ProductApi();

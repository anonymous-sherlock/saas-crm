import { db } from "@/db";

type PaymentTrackingArgs = {
  userId?: string;
};
type PaymentGetAllArgs = {
  userId?: string;
  date?: { from: Date | undefined; to: Date | undefined };
  limit?: number;
};

export class PaymentTracking {
  constructor(private readonly opts?: PaymentTrackingArgs) {}

  async count(userId?: string) {
    try {
      const paymentsCount = await db.payment.count({ where: { userId: userId } });
      return paymentsCount;
    } catch (error) {
      console.log(error);
    }
  }
  async getAll({ userId, date, limit }: PaymentGetAllArgs) {
    try {
      const payments = await db.payment.findMany({
        where: {
          userId: userId,
          createdAt: {
            gte: date?.from,
            lte: date?.to,
          },
        },
        orderBy: { createdAt: "desc" },
        take: limit ? limit : undefined,
      });
      return payments;
    } catch (error) {
      return [];
    }
  }
}

export const payment = new PaymentTracking();

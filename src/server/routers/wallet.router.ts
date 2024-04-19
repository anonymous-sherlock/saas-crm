import { z } from "zod";
import { privateProcedure, router } from "../trpc";
import { getUserByUserId } from "@/lib/data/user.data";
import { db } from "@/db";

const getDetailsOutput = z.object({
  wallet: z.object({ balance: z.number().nullish() }),
  totalBalance: z.object({ amount: z.number().nullish() }),
  totalSpent: z.object({ amount: z.number().nullish() }),
});
const getDetailsInput = z.object({ userId: z.string().optional() }).optional();
export const walletRouter = router({
  getDetails: privateProcedure
    .input(getDetailsInput)
    .output(getDetailsOutput)
    .query(async ({ ctx, input }) => {
      let userId = input?.userId || ctx.userId;
      const user = await getUserByUserId(userId);
      const walletBalance = await db.wallet.findUnique({
        where: {
          userId: userId,
        },
        include: {
          payments: {
            select: {
              amount: true,
              id: true,
              type: true,
            },
          },
        },
      });

      return {
        wallet: { balance: walletBalance?.balance },
        totalBalance: {
          amount:
            (walletBalance?.payments.reduce((acc, payment) => acc + (payment.type === "DEBIT" ? payment.amount : 0), 0) ?? 0) + (walletBalance?.balance ?? 0),
        },
        totalSpent: { amount: walletBalance?.payments.reduce((acc, payment) => acc + (payment.type === "DEBIT" ? payment.amount : 0), 0) ?? 0 },
      };
    }),
});

export type WalletRouter = typeof walletRouter;

"use server";
import { db } from "@/db";
import { walletBalanceSchema } from "@/schema/wallet.schema";
import { z } from "zod";
import { getAuthUser } from "../auth";
import { allowedAdminRoles } from "../auth.permission";

const updateWalletBalanceSchema = walletBalanceSchema.extend({
  userId: z.string(),
});
export async function updateWalletBalance(rawData: z.infer<typeof updateWalletBalanceSchema>) {
  try {
    const parserData = updateWalletBalanceSchema.safeParse(rawData);
    if (!parserData.success) return { error: parserData.error.message ?? "Bad Request" };
    const { authUserId, authUserRole } = await getAuthUser();
    if (!authUserId) return { error: "Unauthorized: Please log in to your account" };
    const isAdmin = allowedAdminRoles.some((role) => role === authUserRole);
    if (!isAdmin) return { error: "Unauthorized: You don't have permission to update users balance" };
    const { userId, type, amount } = parserData.data;
    const user = await db.user.findFirst({ where: { id: userId } });
    if (!user) return { error: "User not found" };

    const result = await db.$transaction(async (tx) => {
      const updatedWallet = await tx.wallet.upsert({
        where: { userId: user.id },
        create: {
          balance: type === "DEBIT" ? 0 - parseFloat(amount) : parseFloat(amount),
          userId: user.id,
        },
        update: {
          balance: type === "DEBIT" ? { decrement: parseFloat(amount) } : { increment: parseFloat(amount) },
        },
      });
      if (!updatedWallet) {
        throw new Error(`Cannot update user wallet balance.`);
      }
      if (updatedWallet.balance < 0) {
        throw new Error(`Wallet doesn't have enough money to debit the amount.`);
      }

      const createdPayment = await tx.payment.create({
        data: {
          userId: user.id,
          walletId: updatedWallet.id,
          amount: parseFloat(amount),
          type,
          status: "COMPLETED",
        },
      });

      return { updatedWallet, createdPayment };
    });

    return { success: `Amount ${type.toLowerCase() + "ed"} successfully.` };
  } catch (error) {
    console.error("Error occurred during updateWalletBalance:", error);
    if (error instanceof Error) return { error: error.message };
    return { error: "Uh oh! Something went wrong." };
  }
}

import { Payment, Payment_Status, Payment_Type } from "@prisma/client";
import { z } from "zod";

export type PaymentsColumnDef = Pick<Payment, "id" | "txid" | "amount" | "type" | "status" | "createdAt" | "updatedAt" | "userId">;

export const paymentRowSchema = z.object({
  id: z.string(),
  txid: z.string(),
  type: z.nativeEnum(Payment_Type),
  status: z.nativeEnum(Payment_Status),
  createdAt: z.date(),
  amount: z.number(),
});

export type PaymentListSchemaType = z.infer<typeof paymentRowSchema>;

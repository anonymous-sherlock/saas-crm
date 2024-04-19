import { Payment_Type } from "@prisma/client";
import { z } from "zod";

export const walletBalanceSchema = z.object({
  amount: z.string().refine(
    (value) => {
      if (typeof value === "number") {
        return value >= 500;
      } else {
        const parsedNumber = Number(value);
        return !isNaN(parsedNumber) && parsedNumber >= 500;
      }
    },
    { message: "Mininum amount value is 500" },
  ),
  type: z.nativeEnum(Payment_Type, {
    required_error: "Payment type is required",
    invalid_type_error: "Payment type is required",
    description: "Payment type is required",
  }),
});

export type WalletBalanceSchemaType = z.infer<typeof walletBalanceSchema>;

import { z } from "zod";

export const productRowSchema = z.object({
    productId: z.string(),
    name: z.string(),
    description: z.string().optional().nullish(),
    price: z.number(),
    quantity: z.number(),
    ownerId: z.string(),
    category: z.string().nullable(),
});

export type ProductRow = z.infer<typeof productRowSchema>;
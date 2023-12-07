import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
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
import { z } from "zod";

export const searchParamsSchema = z.object({
  q: z.string().optional(),
  date: z.string().optional(),
});

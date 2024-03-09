import { z } from "zod";

export const mediaFormSchema = z.object({
    key: z.string().min(1, { message: 'Media File is required' }),
    name: z.string(),
    originalFileName: z.string().optional(),
    url: z.string().url(),
    size: z.string().optional(),
    type: z.string().optional()
})


export type MediaFormType = z.infer<typeof mediaFormSchema>;
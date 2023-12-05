import { z } from "zod";

export const apiLeadAddError = z.object({
  success: z.literal(false),
  error: z.enum(["validation", "unauthorized", "error","Not Found"]),
  message: z.union([z.string(), z.object({})]),
});

export type ApiLeadUploadError = z.infer<typeof apiLeadAddError>;

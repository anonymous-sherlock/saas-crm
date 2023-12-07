import { z } from "zod";

export const apiLeadAddError = z.object({
  success: z.literal(false),
  error: z.enum(["validation", "unauthorized", "error", "Not Found"]),
  message: z.union([z.string(), z.object({})]),
});


export class AuthorizationError extends Error {
  public details: ApiLeadUploadError;

  constructor(message?: string, details?: ApiLeadUploadError) {
    super(message); // Pass the message to the Error constructor
    this.name = 'AuthorizationError'; // Set the name of the error
    this.details = details || { success: false, error: "unauthorized", message: "" };

    // This line is needed to restore the correct prototype chain. 
    // (see note below)
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export type ApiLeadUploadError = z.infer<typeof apiLeadAddError>;

import { z } from "zod";


export const fileUploadErrorSchema = z.object({
  success: z.literal(false),
  status: z.union([
    z.literal("validation error"),
    z.literal("multer error"),
    z.literal("unauthorized error"),
    z.literal("error")
  ]),
  message: z.string()
})
const fileStatusSchema = z.union([z.literal("error"), z.literal("processing"), z.literal("done")]).nullable()

export const fileMetaDetailsSchema = z.object({
  originalFileName: z.string(),
  fileName: z.string(),
  uplaodPath: z.string().nullable(),
  fileSize: z.number(),
  fileType: z.string(),
  fileUrl: z.string(),
  markedForDeletion: z.boolean(),
  uploadFailed: z.boolean(),
  createdAt: z.number(),
  status: fileStatusSchema
})


export const filesUploadResponseSchema = z.object({
  userMeta: z.any().nullable(),
  files: z.array(fileMetaDetailsSchema)
})

export type FileMetaDetails = z.infer<typeof fileMetaDetailsSchema>
export type FileUploadError = z.infer<typeof fileUploadErrorSchema>
export type FilesUploadResponse = z.infer<typeof filesUploadResponseSchema>
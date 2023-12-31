import { getFileExtension } from "@/lib/helpers";
import { z } from "zod";

export const singleImageSchema = z.object({
  name: z.string(),
  size: z.number(),
  type: z.string(),
  // You can add more validations as needed, e.g., for file type, size, etc.
});

export const productFormSchema = z.object({
  productId: z.string().optional(),
  productName: z.string().min(1, { message: "Product name is required." }).min(2, { message: "Product name must be at least 2 characters." }),
  productPrice: z
    .string({ required_error: "Product price is required." })
    .min(1, { message: "Product name is required." })
    .refine(
      (value) => {
        // Remove commas (thousands separators) if they exist
        const sanitizedValue = value.replace(/,/g, "");
        // Validate that the sanitized value contains only numeric characters and optional decimal points
        return /^[\d.]+$/.test(sanitizedValue);
      },
      {
        message: "Product price must be in this format only 1,999 or 1999.",
      },
    ),

  productDescription: z.string().optional(),
  productCategory: z.string({ required_error: "Product category is required." }).refine((value) => !!value, {
    message: "Product category is required.",
  }),
  productQuantity: z
    .string()
    .min(1, { message: "Product quantity is required." })
    .refine((value) => value !== "0", {
      message: "Product quantity cannot be empty or 0.",
    })
    .refine((value) => value === "-1" || /^\d+$/.test(value), {
      message: "Product quantity must be a valid number or -1 for unlimited.",
    }),

  productImages: z
    .array(singleImageSchema)
    // .refine((files) => files.length > 0, { message: "Add At least one product image." })
    .refine(
      (files) => {
        // For example, you can check file types, sizes, or other criteria.
        return files.every((file) => {
          const extension = getFileExtension(file.name).toLowerCase();
          return ACCEPTED_IMAGE_EXTENSIONS.includes(extension);
        });
      },
      {
        message: "Please upload valid image files only .jpg, .jpeg, .png and .webp are acceptable.",
      },
    )
    .refine(
      (files) => {
        // Limit the number of files to a maximum of 5
        return files.length <= 10;
      },
      {
        message: "You can upload a maximum of 10 files.",
      },
    ),

  mediaUrls: z.array(
    z.object({
      value: z
        .string()
        .optional()
        .refine(
          (value) => {
            // Check if the value is a valid URL
            return !value || /^(ftp|http|https):\/\/[^ "]+$/.test(value);
          },
          { message: "Please enter a valid URL." },
        ),
    }),
  ),
});

export const ACCEPTED_IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "svg"];

// delete product payload

export const deleteProduct = z.object({
  productId: z.string({
    required_error: "product id is required",
  }),
});

// product searhc payload
export const productSearch = z.object({
  name: z
    .string({
      required_error: "Type a product name to search",
    })
    .min(2, {
      message: "product name must be at least 2 characters to search",
    }),
  selectedId: z.string().optional(),
  limit: z.number().optional(),
  cursor: z.string(),
});
export type ProductFormPayload = z.infer<typeof productFormSchema>;
export type DeleteProductPayload = z.infer<typeof deleteProduct>;
export type ProductSearchPayload = z.infer<typeof productSearch>;

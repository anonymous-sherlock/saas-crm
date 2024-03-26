import { Company, Role, User } from "@prisma/client";
import { z } from "zod";

export type UserListColumnDef = Pick<User, "id" | "name" | "email" | "emailVerified" | "active" | "image" | "role" | "createdAt" | "updatedAt"> & {
  company: Pick<Company, "id" | "name" | "address"> | undefined | null;
};
export const UserListSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.date().optional().nullable(),
  image: z.string().optional().nullable(),
  role: z.nativeEnum(Role),
  active: z.boolean().optional().nullable(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
  company: z
    .object({
      id: z.string().optional(),
      name: z.string().optional(),
      address: z.string().optional(),
    })
    .optional()
    .nullable(),
});

export type UserListColumnType = z.infer<typeof UserListSchema>;

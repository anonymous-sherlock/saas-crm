import { UserRole } from "@prisma/client";
import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const UserListSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.string().nullable(),
  image: z.string().nullable().optional(),
  role: z.nativeEnum(UserRole),
  active: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UserListColumnType = z.infer<typeof UserListSchema>;

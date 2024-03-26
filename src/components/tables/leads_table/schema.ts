import { GetAllUsersLeads } from "@/types/queries";
import { Campaign, Lead, LeadStatus, Media, Product, User } from "@prisma/client";
import { z } from "zod";

export type LeadColumnDef = Pick<Lead, "id" | "name" | "ip" | "phone" | "address" | "country" | "region" | "city" | "zipcode" | "status" | "createdAt" | "updatedAt" | "userId"> & {
  campaign: Pick<Campaign, "id" | "name" | "code">;
};

export const LeadSchema = z.object({
  userId: z.string(),
  id: z.string(),
  ip: z.string().optional().nullable(),
  name: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  country: z.string().optional(),
  region: z.string().optional(),
  city: z.string().optional().nullable(),
  zipcode: z.string().optional().nullable(),
  status: z.nativeEnum(LeadStatus),
  campaign: z.object({
    id: z.string().optional(),
    name: z.string().optional(),
    code: z.string().optional(),
  }),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type LeadColumnType = z.infer<typeof LeadSchema>;

export type AdminLeadColumnDef = GetAllUsersLeads[number];

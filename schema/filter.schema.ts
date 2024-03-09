import { CampaignStatus } from "@prisma/client";
import { z } from "zod";

export const campaignsFilterSchema = z.object({
    q: z.string().optional(),
    status: z.enum(["All", ...Object.values(CampaignStatus)]).optional()
});


export type CampaignsFilterValues = z.infer<typeof campaignsFilterSchema>;
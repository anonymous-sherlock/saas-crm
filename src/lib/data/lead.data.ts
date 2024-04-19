"use server";

import { DEFAULT_LEAD_CHARGE_DAYS } from "@/constants/index";
import { db } from "@/db";

interface findExistingLeadProps {
  phone: string;
  campaignId: string;
}
export async function findExistingLead({ phone, campaignId }: findExistingLeadProps) {
  const existingLead = await db.lead.findMany({
    where: {
      OR: [{ phone: phone }],
      AND: [
        {
          createdAt: {
            gte: new Date(Date.now() - DEFAULT_LEAD_CHARGE_DAYS),
          },
        },
      ],
      campaignId: campaignId,
    },
  });

  return { existingLead: existingLead[0], count: existingLead.length };
}

"use server";

import { Lead } from "@prisma/client";
import { getActorUser, getCurrentUser } from "../auth";
import { db } from "@/db";
import { LeadSchema, LeadSchemaType } from "@/schema/lead.schema";

interface upsertLeadDetailsProps {
  data: Partial<LeadSchemaType>;
  leadId?: string;
}
export async function upsertLeadDetails({ data, leadId }: upsertLeadDetailsProps) {
  try {
    const user = await getCurrentUser();
    if (!user) return { error: "Unauthorized: Please log in to your account" };
    if (!leadId) return { error: "Lead id not provide" };
    const parsedData = LeadSchema.partial().safeParse(data);

    if (!parsedData.success) return { error: "Invalid data passed. Please check the provided information." };
    const updatedLeadDetails = await db.lead.update({
      where: { id: leadId },
      data: parsedData.data,
    });
    return { success: `${updatedLeadDetails.name}'s customer details have been successfully updated.` };
  } catch (error) {
    return { error: "Uh oh! Something went wrong." };
  }
}

interface getCampaignLeadsProps {
  campaignId: string;
}
export async function getCampaignLeads({ campaignId }: getCampaignLeadsProps) {
  try {
    if (!campaignId) throw new Error("Campaign id not provided");
    const user = await getCurrentUser();
    const actor = await getActorUser(user);
    if (!user) throw new Error("Unauthorized: Please log in to your account");
    const leads = await db.lead.findMany({
      orderBy: { createdAt: "desc" },
      where: {
        userId: actor ? actor.userId : user.id,
        campaign: {
          OR: [{ code: campaignId }, { id: campaignId }],
        },
      },
      include: {
        campaign: {
          select: {
            name: true,
            code: true,
            id: true,
          },
        },
      },
    });
    return leads;
  } catch (error) {
    console.error("Error fetching leads:", error);
    return [];
  }
}

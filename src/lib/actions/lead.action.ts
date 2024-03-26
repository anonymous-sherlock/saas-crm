"use server";
import { db } from "@/db";
import { LeadSchema, LeadSchemaType } from "@/schema/lead.schema";
import { getAuthUser, getCurrentUser } from "../auth";
import { z } from "zod";
import { getUserByUserId } from "../data/user.data";
import { allowedAdminRoles } from "../auth.permission";

interface upsertLeadDetailsProps {
  data: Partial<LeadSchemaType>;
  leadId?: string;
}
export async function upsertLeadDetails({ data, leadId }: upsertLeadDetailsProps) {
  try {
    const user = await getCurrentUser();
    if (!user) return { error: "Unauthorized: Please log in to your account" }
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


const leadDeleteSchema = z.object({
  leadIds: z.string({ required_error: "Lead Id is required to delete a lead" }).array(),
  userId: z.string(),
});
export async function deleteLeads(rawInput: z.infer<typeof leadDeleteSchema>) {
  const parserData = leadDeleteSchema.safeParse(rawInput);
  if (!parserData.success) return { error: parserData.error.message ?? "Bad Request" };

  const { authUserId, authUserRole } = await getAuthUser();
  if (!authUserId) return { error: "Unauthorized: Please log in to your account" };
  const user = await getUserByUserId(parserData.data.userId);
  if (!user) return { error: "User not found" };
  const isAdmin = allowedAdminRoles.some((role) => role === authUserRole);
  const isUserAuthorized = authUserId === user.id || isAdmin;
  if (!isUserAuthorized) return { error: "Unauthorized: You don't have permission to delete lead for other users" };

  const leads = await db.lead.findMany({ where: { userId: user.id, id: { in: rawInput.leadIds } } });
  if (!leads) return { error: "Leads not found" };
  const deletedLeads = await db.lead.deleteMany({ where: { userId: user.id, id: { in: rawInput.leadIds } } });
  return { success: `Successfully deleted ${deletedLeads.count} lead${deletedLeads.count > 1 ? "s" : ""}` };
}
"use server";
import { db } from "@/db";
import { CampaignFormSchemaType, campaignFormSchema } from "@/schema/campaign.schema";
import { CampaignsFilterValues } from "@/schema/filter.schema";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { getAuthUser, getCurrentUser } from "../auth";
import { allowedAdminRoles } from "../auth.permission";
import { getUserByUserId } from "../data/user.data";
import { generateCampaignCodeID } from "../utils";

type findCampaignByCodeProps = {
  campaignCode: string;
};
export async function findCampaignByCode({ campaignCode }: findCampaignByCodeProps) {
  const campaign = await db.campaign.findUnique({
    where: {
      code: campaignCode,
    },
  });
  if (!campaign) return null;
  return campaign;
}

interface updateCampaignDetailsProps {
  data: Partial<CampaignFormSchemaType>;
  campaignId?: string;
  userId: string;
  type: "update" | "create";
}
export async function upsertCampaignDetails({ data, campaignId, type, userId }: updateCampaignDetailsProps) {
  const authUser = await getCurrentUser();
  if (!authUser) return { error: "Unauthorized: Please log in to your account" };
  const user = await getUserByUserId(userId);
  if (!user) return { error: "User not found" };
  try {
    if (type === "create") {
      const createCampaignParsedData = campaignFormSchema.safeParse(data);
      if (!createCampaignParsedData.success) return { error: "Invalid data passed. Please check the provided information." };
      const { campaignName, campaignDescription, callCenterTeamSize, leadsRequirements, targetCountry, targetAge, targetGender, trafficSource, workingDays, workingHours, targetRegion, productId } =
        createCampaignParsedData.data;
      const newCampaign = await db.campaign.create({
        data: {
          code: generateCampaignCodeID(),
          name: campaignName,
          description: campaignDescription,
          callCenterTeamSize,
          leadsRequirements,
          targetCountry,
          targetGender: targetGender,
          trafficSource: trafficSource,
          workingDays,
          workingHours,
          targetAge: targetAge,
          targetRegion: {
            createMany: {
              data: (targetRegion || []).map((region) => ({
                regionName: region.toString(),
              })),
            },
          },
          user: { connect: { id: user.id } },
          product: { connect: { id: productId } },
        },
      });
      return { success: `New campaign '${newCampaign.name}' has been successfully created.`, campaign: newCampaign };
    }
    if (type === "update") {
      if (!campaignId) return { error: "Campaign id not provide" };
      const existingCampaign = await db.campaign.findFirst({ where: { id: campaignId } });
      if (!existingCampaign) return { error: "No campaign found" };

      const updateCampaignParsedData = campaignFormSchema.partial().safeParse(data);
      if (!updateCampaignParsedData.success) return { error: "Invalid data passed. Please check the provided information." };
      const { campaignName, campaignDescription, callCenterTeamSize, leadsRequirements, targetCountry, targetAge, targetGender, trafficSource, workingDays, workingHours, targetRegion, productId } =
        updateCampaignParsedData.data;

      const updatedCampaignDetails = await db.$transaction(async (tx) => {
        await tx.targetRegion.deleteMany({
          where: { campaignId: campaignId },
        });
        if (targetRegion && targetRegion?.length > 0) {
          // Assuming targetGender is an array of strings
          await tx.targetRegion.createMany({
            data: targetRegion.map((reg) => ({
              campaignId,
              regionName: reg,
            })),
          });
        }
        const result = await tx.campaign.update({
          where: { id: campaignId, userId: user.id },
          data: {
            name: campaignName,
            description: campaignDescription,
            callCenterTeamSize,
            leadsRequirements,
            targetCountry,
            targetAge,
            targetGender,
            trafficSource,
            workingDays,
            workingHours,
            product: { connect: { id: productId } },
          },
        });
        return result;
      });
      return { success: `${updatedCampaignDetails.name}'s details have been successfully updated.`, campaign: updatedCampaignDetails };
    }
  } catch (error) {
    return { error: "Uh oh! Something went wrong." };
  }
}

interface getAllCampaignsProps {
  filterValues: CampaignsFilterValues;
  page?: number;
  userId?: string;
}
export async function getAllCampaigns({ filterValues, page: searchPage = 1, userId }: getAllCampaignsProps) {
  const { q, status } = filterValues;
  const campaignsPerPage = 12;
  const page = isNaN(searchPage) ? 1 : searchPage;
  const skip = (page - 1) * campaignsPerPage;

  const searchString = q
    ?.split(" ")
    .filter((word) => word.length > 0)
    .join(" & ");

  const searchFilter: Prisma.CampaignWhereInput = searchString
    ? {
      OR: [{ name: { search: searchString } }, { name: { contains: searchString } }, { code: { contains: searchString } }],
    }
    : {};

  const where: Prisma.CampaignWhereInput = {
    AND: [searchFilter, userId && userId ? { userId: userId } : {}, status && status === "All" ? {} : {}, status !== "All" ? { status: status } : {}],
  };

  const campaignsPromise = db.campaign.findMany({
    where,
    select: {
      id: true,
      name: true,
      code: true,
      description: true,
      status: true,
      createdAt: true,
      userId: true,
      _count: {
        select: {
          leads: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: campaignsPerPage,
    skip,
  });

  const countPromise = db.campaign.count({ where });
  const [campaigns, totalResults] = await Promise.all([campaignsPromise, countPromise]);
  return { campaigns, totalResults, campaignsPerPage, page };
}

const campaignDeleteSchema = z.object({
  campaignIds: z.string({ required_error: "campaign Id is required to delete a campaign" }).array(),
  userId: z.string(),
});
export async function deleteCampaigns(rawInput: z.infer<typeof campaignDeleteSchema>) {
  const parserData = campaignDeleteSchema.safeParse(rawInput);
  if (!parserData.success) return { error: parserData.error.message ?? "Bad Request" };

  const { authUserId, authUserRole } = await getAuthUser();
  if (!authUserId) return { error: "Unauthorized: Please log in to your account" };
  const user = await getUserByUserId(parserData.data.userId);
  if (!user) return { error: "User not found" };
  const isAdmin = allowedAdminRoles.some((role) => role === authUserRole);
  const isUserAuthorized = authUserId === user.id || isAdmin;
  if (!isUserAuthorized) return { error: "Unauthorized: You don't have permission to delete products for other users" };

  const campaigns = await db.campaign.findMany({ where: { userId: user.id, id: { in: rawInput.campaignIds } } });
  if (!campaigns) return { error: "Campaign not found" };
  const deletedCampaigns = await db.campaign.deleteMany({ where: { userId: user.id, id: { in: rawInput.campaignIds } } });
  return { success: `Successfully deleted ${deletedCampaigns.count} campaign${deletedCampaigns.count > 1 ? "s" : ""}` };
}


export type getAllCampaignsType = Awaited<ReturnType<typeof getAllCampaigns>>;

import { db } from "@/db";
import { generateCampaignCodeID } from "@/lib/utils";
import { campaignFormSchema } from "@/schema/campaignSchema";
import { privateProcedure, router } from "@/server/trpc";
import { CampaignStatus } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const campaignRouter = router({
  get: privateProcedure.input(z.object({ camapaingId: z.string() })).query(async ({ ctx, input }) => {
    const { userId, isImpersonating, actor } = ctx;
    const { camapaingId } = input;

    const campaign = await db.campaign.findFirst({
      where: {
        id: camapaingId,
        userId: isImpersonating ? actor.userId : userId,
      },
      include: {
        targetRegion: true,
        product: true,
        _count: {
          select: {
            leads: true,
          },
        },
      },
    });

    if (!campaign) throw new TRPCError({ code: "NOT_FOUND", message: "Campaign not Found" });
    const parsedTargetAge: TargetAge = campaign.targetAge as TargetAge;

    return {
      ...campaign,
      targetAge: parsedTargetAge,
    };
  }),
  create: privateProcedure
    .input(
      z.object({
        campaign: campaignFormSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, isImpersonating, actor } = ctx;
      const {
        campaignName,
        campaignDescription,
        product,
        callCenterTeamSize,
        leadsRequirements,
        targetAge,
        targetCountry,
        targetGender,
        targetRegion,
        trafficSource,
        workingDays,
        workingHours,
      } = input.campaign;
      const campaignCode = generateCampaignCodeID();

      const newCampaign = await db.campaign.create({
        data: {
          name: campaignName,
          description: campaignDescription,
          callCenterTeamSize,
          leadsRequirements,
          targetCountry,
          targetGender: targetGender === "Female" ? "Female" : "Male",
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
          code: campaignCode,
          user: {
            connect: {
              id: isImpersonating ? actor.userId : userId,
            },
          },
          product: {
            connect: {
              productId: product,
            },
          },
        },
      });
      return {
        success: "true",
        campaign: newCampaign,
      };
    }),
  updateStatus: privateProcedure
    .input(
      z.object({
        campaignId: z.string({
          required_error: "Campaign Id is required to update a campaign status",
        }),
        campaignStatus: z.nativeEnum(CampaignStatus),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, isImpersonating, actor } = ctx;
      const { campaignId, campaignStatus } = input;
      const campaign = await db.campaign.findFirst({
        where: {
          userId: isImpersonating ? actor.userId : userId,
          id: campaignId,
        },
      });
      if (!campaign) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Campaign with this id not found",
        });
      }
      const updatedCampaign = await db.campaign.update({
        where: {
          userId: isImpersonating ? actor.userId : userId,
          id: campaignId,
        },
        data: {
          status: campaignStatus,
        },
      });
      return {
        success: "true",
        updatedCampaign,
      };
    }),
  getAll: privateProcedure.query(async ({ ctx }) => {
    const { userId, actor, isImpersonating } = ctx;
    const campaignsData = await db.campaign.findMany({
      where: {
        userId: isImpersonating ? actor.userId : userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        _count: {
          select: {
            leads: true,
          },
        },
        id: true,
        code: true,
        description: true,
        name: true,
        status: true,
        targetCountry: true,
        createdAt: true,
        product: {
          select: {
            productId: true,
            name: true,
            category: true,
            description: true,
            price: true,
            images: true,
            createdAt: true,
          },
        },
      },
    });
    return campaignsData;
  }),
  copyCampaign: privateProcedure
    .input(
      z.object({
        campaignId: z.string({
          required_error: "Campaign Id is required to copy a campaign",
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, actor, isImpersonating } = ctx;
      const { campaignId } = input;
      const campaign = await db.campaign.findFirst({
        where: {
          userId: isImpersonating ? actor.userId : userId,
          id: campaignId,
        },
      });
      if (!campaign) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Campaign with this id not found",
        });
      }

      const copiedCampaign = await db.campaign.create({
        data: {
          code: generateCampaignCodeID(),
          name: `${campaign.name}`,
          description: campaign.description,
          callCenterTeamSize: campaign.callCenterTeamSize,
          leadsRequirements: campaign.leadsRequirements,
          targetAge: JSON.stringify(campaign.targetAge),
          targetCountry: campaign.targetCountry,
          targetGender: campaign.targetGender,
          trafficSource: campaign.trafficSource,
          workingDays: JSON.stringify(campaign.workingDays),
          workingHours: JSON.stringify(campaign.workingHours),
          productId: campaign.productId,
          userId: campaign.userId,
        },
      });

      return {
        success: "true",
        copiedCampaign,
      };
    }),
  deleteCampaign: privateProcedure
    .input(
      z.object({
        campaignIds: z
          .string({
            required_error: "Campaign Id is required to delete a campaign",
          })
          .array(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, actor, isImpersonating } = ctx;
      const { campaignIds } = input;
      const campaigns = await db.campaign.findMany({
        where: {
          userId: isImpersonating ? actor.userId : userId,
          id: {
            in: campaignIds,
          },
        },
      });
      if (!campaigns)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Campaign not found",
        });

      const deletedCampaign = await db.campaign.deleteMany({
        where: {
          userId: userId,
          id: {
            in: campaignIds,
          },
        },
      });
      const deletedCount = deletedCampaign.count;
      return {
        success: "true",
        deletedCampaign,
        deletedCount,
      };
    }),
});

export type CampaignRouter = typeof campaignRouter;

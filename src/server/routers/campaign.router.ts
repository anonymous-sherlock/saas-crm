import { db } from "@/db";
import { generateCampaignCodeID } from "@/lib/utils";
import { privateProcedure, router } from "@/server/trpc";
import { CampaignStatus, Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const campaignRouter = router({
  get: privateProcedure.input(z.object({ camapaingId: z.string(), userId: z.string() })).query(async ({ ctx, input }) => {
    const { camapaingId, userId } = input;
    const campaign = await db.campaign.findFirst({
      where: {
        id: camapaingId,
        userId: userId,
      },
      include: {
        targetRegion: true,
        product: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          }
        },
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
      const { campaignId, campaignStatus } = input;
      const campaign = await db.campaign.findFirst({ where: { id: campaignId, }, });
      if (!campaign) throw new TRPCError({ code: "NOT_FOUND", message: "Campaign with this id not found", });

      const updatedCampaign = await db.campaign.update({
        where: { id: campaignId, },
        data: { status: campaignStatus, },
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
            id: true,
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
      const { campaignId } = input;
      const campaign = await db.campaign.findFirst({
        where: {
          id: campaignId,
        },
        include: { targetRegion: true },
      });
      if (!campaign) throw new TRPCError({ code: "NOT_FOUND", message: "Campaign with this id not found" });


      const copiedCampaign = await db.campaign.create({
        data: {
          code: generateCampaignCodeID(),
          name: `${campaign.name} copy`,
          description: campaign.description,
          callCenterTeamSize: campaign.callCenterTeamSize,
          leadsRequirements: campaign.leadsRequirements,
          targetAge: campaign.targetAge as Prisma.InputJsonValue,
          targetCountry: campaign.targetCountry,
          targetGender: campaign.targetGender,
          trafficSource: campaign.trafficSource,
          workingDays: campaign.workingDays as Prisma.InputJsonValue,
          workingHours: campaign.workingHours as Prisma.InputJsonValue,
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

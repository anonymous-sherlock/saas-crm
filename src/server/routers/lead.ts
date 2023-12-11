import { db } from "@/db";
import { determineLeadStatus } from "@/lib/helpers";
import { getIpInfo } from "@/lib/helpers/getIpInfo";
import { LeadsFormSchema } from "@/schema/LeadSchema";
import { privateProcedure, router } from "@/server/trpc";
import { LeadStatus } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const leadRouter = router({
  getAll: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;
    const leads = await db.lead.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        userId: userId,
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
  }),
  getCampaignLeads: privateProcedure
    .input(
      z.object({
        campaignId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;
      const { campaignId } = input;

      const leads = await db.lead.findMany({
        orderBy: {
          createdAt: "desc",
        },
        where: {
          userId,
          campaignId: campaignId,
        },
      });
      return leads;
    }),
  updateStatus: privateProcedure
    .input(
      z.object({
        leadId: z.string({
          required_error: "Lead id is required to update a lead",
        }),
        leadStatus: z.nativeEnum(LeadStatus),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const { leadId, leadStatus } = input;
      const lead = await db.lead.findFirst({
        where: {
          userId: userId,
          id: leadId,
        },
      });
      if (!lead) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Lead with this id not found",
        });
      }
      const updatedLead = await db.lead.update({
        where: {
          userId: userId,
          id: leadId,
        },
        data: {
          status: leadStatus,
        },
      });
      return {
        success: "true",
        updatedLead,
      };
    }),
  deleteLead: privateProcedure
    .input(
      z.object({
        leadIds: z
          .string({
            required_error: "Lead Id is required to delete a Lead",
          })
          .array(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const { leadIds } = input;
      const leads = await db.lead.findMany({
        where: {
          userId: userId,
          id: {
            in: leadIds,
          },
        },
      });
      if (!leads)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Leads not found",
        });

      const deletedLead = await db.lead.deleteMany({
        where: {
          userId: userId,
          id: {
            in: leadIds,
          },
        },
      });
      const deletedCount = deletedLead.count;
      return {
        success: "true",
        deletedLead,
        deletedCount,
      };
    }),

  add: privateProcedure.input(LeadsFormSchema).mutation(async ({ ctx, input }) => {
    const { userId, req } = ctx;
    const { name, phone, address, campaignCode } = input;

    const campaign = await db.campaign.findUnique({
      where: {
        userId,
        code: campaignCode,
      },
    });

    if (!campaign) throw new TRPCError({ code: "NOT_FOUND", message: "Campaign not found" });
    const userIp = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip");
    const ipInfo = await getIpInfo(userIp);

    const existingLead = await db.lead.findFirst({
      where: {
        OR: [
          { phone: phone }
        ]
      },
    });
    const newLead = await db.lead.create({
      data: {
        name,
        phone,
        address: address || "",
        country: ipInfo.country || "",
        ip: ipInfo.ip,
        region: ipInfo.region || "",
        state: ipInfo.region || "",
        userId,
        campaignId: campaign.id,
        status: existingLead ? "Trashed" : determineLeadStatus({ name, phone })
      },
    });

    return {
      success: true,
      lead: newLead,
    };
  }),
});

export type LeadRouter = typeof leadRouter;

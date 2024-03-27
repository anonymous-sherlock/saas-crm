import { db } from "@/db";
import { determineLeadStatus } from "@/lib/helpers";
import { getIpInfo } from "@/lib/helpers/getIpInfo";
import { AddLeadFormSchema } from "@/schema/lead.schema";
import { privateProcedure, router } from "@/server/trpc";
import { LeadStatus } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const leadRouter = router({
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
      const { userId, isImpersonating, actor } = ctx;
      const { leadId, leadStatus } = input;
      const lead = await db.lead.findFirst({
        where: {
          userId: isImpersonating ? actor.userId : userId,
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
          userId: isImpersonating ? actor.userId : userId,
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
  add: privateProcedure.input(AddLeadFormSchema).mutation(async ({ ctx, input }) => {
    const { req } = ctx;
    const { name, phone, address, campaignId } = input;

    const campaign = await db.campaign.findUnique({ where: { id: campaignId, }, });

    if (!campaign) throw new TRPCError({ code: "NOT_FOUND", message: "Campaign not found" });
    const userIp = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip");
    const ipInfo = await getIpInfo(userIp);

    const existingLead = await db.lead.findFirst({ where: { OR: [{ phone: phone }], }, });

    const newLead = await db.lead.create({
      data: {
        name,
        phone,
        address: address || "",
        country: ipInfo.country || "",
        ip: ipInfo.ip,
        region: ipInfo.region || "",
        city: ipInfo.region || "",
        region_code: ipInfo.region_code,
        country_code: ipInfo.country_code,
        zipcode: ipInfo.postal,
        userId: campaign.userId,
        campaignId: campaign.id,
        status: existingLead ? ("Trashed" ? (campaign.status === "OnHold" ? "OnHold" : "Approved") : "Trashed") : determineLeadStatus({ name, phone }),
      },
    });

    return {
      success: true,
      lead: newLead,
    };
  }),
  getLeadDetails: privateProcedure.input(z.object({ leadId: z.string() })).query(async ({ ctx, input }) => { 
    const { leadId } = input
    try {
      const lead = await db.lead.findFirst({
        where: { id: leadId },
        include: {
          campaign: {
            include: {
              product: {
                include: {
                  images: {
                    include: {
                      media: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      return lead
    } catch (error) {
      console.error("Error occurred during getLeadDetails:", error);
      return null;
    }
  })
});

export type LeadRouter = typeof leadRouter;

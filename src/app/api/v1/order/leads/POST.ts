import { DEFAULT_LEAD_CHARGE_DAYS, DEFAULT_MAX_TRASHED_LEAD_COUNT, DEFAULT_PRICE_PER_LEAD } from "@/constants/index";
import { db } from "@/db";
import { findCampaignByCode } from "@/lib/actions/campaign.action";
import { findExistingLead } from "@/lib/data/lead.data";
import { determineLeadStatus } from "@/lib/helpers";
import { getIpInfo } from "@/lib/helpers/getIpInfo";
import { handleAuthorization } from "@/lib/helpers/handleAuthorization.helper";
import { LeadSchema } from "@/schema/lead.schema";
import { ApiLeadUploadError, AuthorizationError } from "@/types/api-type";
import { $Enums } from "@prisma/client";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { ZodError, z } from "zod";

const extendedLeadschema = LeadSchema.extend({
  campaignCode: z.string().min(1, "Campaign Code is required"),
});

export async function CreateLead(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();
    const parsedBody = extendedLeadschema.parse(body);
    let { campaignCode, name, phone, address, city, country, description, email, region, street, website, zipcode } = parsedBody;
    const campaign = await findCampaignByCode({ campaignCode });
    if (!campaign)
      return NextResponse.json({ success: false, error: "Not Found", message: "Campaign not found" } satisfies ApiLeadUploadError, { status: 404 });

    const apiKey = headers().get("API_KEY");
    const authorizationHeader = headers().get("authorization");
    const bearerToken = authorizationHeader && authorizationHeader.startsWith("Bearer ") ? authorizationHeader.slice(7) : null;
    await handleAuthorization({ apiKey, bearerToken });

    const userIp = headers().get("x-forwarded-for") || headers().get("x-real-ip");
    const ipInfo = await getIpInfo(userIp);

    const { existingLead, count: leadCount } = await findExistingLead({ campaignId: campaign.id, phone });
    if (leadCount > DEFAULT_MAX_TRASHED_LEAD_COUNT) throw new Error("Order Already Placed");

    let status: $Enums.LeadStatus | undefined;
    if (campaign) {
      city = city || ipInfo.city || req.geo?.city;
      country = country || ipInfo.country_name || req.geo?.country;
      region = region || ipInfo.region || req.geo?.region;
      zipcode = zipcode || ipInfo.postal;
      address = address || ipInfo.city;
      status = existingLead ? "Trashed" : determineLeadStatus({ name, phone, city, email, campaignStatus: campaign.status });
    }

    const results = await db.$transaction(async (tx) => {
      const newLead = await tx.lead.create({
        data: {
          campaignId: campaign.id,
          userId: campaign.userId,
          ip: ipInfo.ip,
          description: description,
          email: email,
          zipcode: zipcode,
          street: street,
          website: website,
          country: country,
          name: name,
          phone: phone,
          address: address,
          region: region,
          city: city,
          status: status,
        },
      });
      if (!existingLead) {
        await tx.wallet.update({
          where: { userId: campaign.userId },
          data: { balance: { decrement: campaign.pricePerLead ?? DEFAULT_PRICE_PER_LEAD } },
        });
        await tx.leadPaymentActivity.create({
          data: {
            amount: campaign.pricePerLead ?? DEFAULT_PRICE_PER_LEAD,
            leadId: newLead.id,
            userId: campaign.userId,
            status: "COMPLETED",
          },
        });
      }

      return newLead;
    });

    return NextResponse.json({ sucess: true, lead: results });
  } catch (err) {
    if (err instanceof AuthorizationError)
      return NextResponse.json({ success: false, error: "unauthorized", message: err.details.message } satisfies ApiLeadUploadError, { status: 401 });
    else if (err instanceof ZodError)
      return NextResponse.json({ success: false, error: "error", message: formatZodError(err) ?? "Validation error occurred" } satisfies ApiLeadUploadError, {
        status: 400,
      });
    else if (err instanceof Error)
      return NextResponse.json({ success: false, error: "error", message: err.message } satisfies ApiLeadUploadError, { status: 400 });
    else return NextResponse.json({ success: false, error: "error", message: "Something went wrong" } satisfies ApiLeadUploadError, { status: 500 });
  }
}

function formatZodError(error: ZodError) {
  return error.errors.map((err) => ({
    field: err.path.join("."),
    message: err.message,
  }));
}

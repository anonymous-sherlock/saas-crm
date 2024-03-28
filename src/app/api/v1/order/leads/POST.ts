import { db } from "@/db";
import { findCampaignByCode } from "@/lib/actions/campaign.action";
import { determineLeadStatus } from "@/lib/helpers";
import { getIpInfo } from "@/lib/helpers/getIpInfo";
import { handleAuthorization } from "@/lib/helpers/handleAuthorization.helper";
import { LeadSchema } from "@/schema/lead.schema";
import { ApiLeadUploadError, AuthorizationError } from "@/types/api-type";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { ZodError, z } from "zod";

const extendedLeadschema = LeadSchema.extend({
  campaignCode: z.string().min(1, "Campaign Code is required"),
})


export async function CreateLead(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json()
    const parsedBody = extendedLeadschema.parse(body);
    const { campaignCode, name, phone, address, city, country, description, email, region, street, website, zipcode } = parsedBody;
    const campaign = await findCampaignByCode({ campaignCode });
    if (!campaign) {
      return NextResponse.json({ success: false, error: "Not Found", message: "campaign not found with this code" } satisfies ApiLeadUploadError, { status: 404 });
    }
    const apiKey = headers().get("API_KEY");
    const authorizationHeader = headers().get("authorization");
    const bearerToken = authorizationHeader && authorizationHeader.startsWith("Bearer ") ? authorizationHeader.slice(7) : null;
    await handleAuthorization({ apiKey, bearerToken });

    const userIp = headers().get("x-forwarded-for") || headers().get("x-real-ip");
    const ipInfo = await getIpInfo(userIp);

    const existingLead = await db.lead.findFirst({
      where: {
        OR: [{ phone: phone }, { ip: ipInfo.ip }],
      },
    });

    const newLead = await db.lead.create({
      data: {
        campaignId: campaign.id,
        ip: ipInfo.ip,
        description: description,
        email: email,
        zipcode: zipcode,
        street: street,
        website: website,
        country: country || ipInfo.country_name || req.geo?.country,
        name: name,
        phone: phone,
        address: address ?? ipInfo.city ?? "",
        region: region || ipInfo.region || req.geo?.region,
        city: city || ipInfo.city || req.geo?.city,
        userId: campaign.userId,
        status: existingLead ? "Trashed" : determineLeadStatus({ name, phone }),
      },
    });
    revalidatePath("/leads")
    return NextResponse.json({ sucess: true, lead: newLead });
  } catch (err) {
    console.error(err)
    if (err instanceof ZodError) {
      return NextResponse.json({ success: false, error: "error", message: formatZodError(err) ?? "Validation error occurred" } satisfies ApiLeadUploadError, { status: 400 });
    } else if (err instanceof AuthorizationError) {
      return NextResponse.json({ success: false, error: "unauthorized", message: err.details.message } satisfies ApiLeadUploadError, { status: 401 });
    } else if (err instanceof Error) {
      return NextResponse.json({ success: false, error: "error", message: err.message } satisfies ApiLeadUploadError, { status: 400 });
    } else {
      return NextResponse.json({ success: false, error: "error", message: "Something went wrong" } satisfies ApiLeadUploadError, { status: 500 });
    }
  }
}

function formatZodError(error: ZodError): string {
  return error.errors
    .map((err) => {
      const { path, message } = err;
      return `${path.join(".")} ${message}`;
    })
    .join(", ");
}

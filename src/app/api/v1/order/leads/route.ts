import { trpc } from "@/app/_trpc/client";
import { db } from "@/db";
import { LeadValidator } from "@/schema/LeadSchema";
import { IpInfoSchema } from "@/schema/ipInfoSchema";
import { ApiLeadUploadError } from "@/types/api-type";
import axios from "axios";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: NextRequest, res: NextResponse) {
  const body = await req.json();
  try {
    const {
      campaignCode,
      data: { name, phone, address },
    } = LeadValidator.parse(body);
    const campaign = await db.campaign.findUnique({
      where: {
        code: campaignCode,
      },
    });
    if (!campaign) {
      return NextResponse.json({ success: false, error: "Not Found", message: "campaign not found with this code" } satisfies ApiLeadUploadError, { status: 404 });
    }
    const apiKey = headers().get("API_KEY");
    if (!apiKey) {
      return NextResponse.json({ success: false, error: "unauthorized", message: "Api key not provided." } satisfies ApiLeadUploadError, { status: 401 });
    }
    const validApiKey = await db.apiKey.findFirst({
      where: {
        key: apiKey,
        enabled: true,
      },
    });
    if (!validApiKey) {
      return NextResponse.json({ success: false, error: "unauthorized", message: "Invalid Api key." } satisfies ApiLeadUploadError, { status: 401 });
    }
    const authorizationHeader = headers().get("authorization");
    const bearerToken = authorizationHeader && authorizationHeader.startsWith("Bearer ") ? authorizationHeader.slice(7) : null;

    if (!authorizationHeader) {
      return NextResponse.json({ success: false, error: "unauthorized", message: "Authorization Header required." } satisfies ApiLeadUploadError, { status: 401 });
    }

    const userIp = headers().get("x-forwarded-for") || headers().get("x-real-ip");
    const ipInfoResponse = await axios.get(`https://ipapi.co/${"123.45.67.89"}/json`);
    const { country_name, region, city, ip, version, country_capital, country_calling_code, postal } = IpInfoSchema.parse(ipInfoResponse.data);

    const newLead = await db.lead.create({
      data: {
        campaingId: campaign.id,
        ip,
        country: country_name ?? "",
        name: name,
        phone: phone,
        address: address ?? city ?? "",
        region: region ?? "",
        state: region ?? "",
        userId: campaign.userId,
        status: name.includes("test") ? "Trashed" : "Paid",
      },
    });


    return NextResponse.json({ sucess: true, lead: newLead });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ success: false, error: "error", message: err.formErrors.fieldErrors } satisfies ApiLeadUploadError, { status: 402 });
    } else if (err instanceof Error) {
      return NextResponse.json({ success: false, error: "error", message: err.message } satisfies ApiLeadUploadError, { status: 500 });
    } else {
      return NextResponse.json({ success: false, error: "error", message: "Something went wrong" } satisfies ApiLeadUploadError, { status: 500 });
    }
  }
}

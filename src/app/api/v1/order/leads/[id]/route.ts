import { db } from "@/db";
import { handleAuthorization } from "@/lib/helpers/handleAuthorization.helper";
import { ApiLeadUploadError, AuthorizationError } from "@/types/api-type";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const leadId = params.id
        const apiKey = headers().get("API_KEY");
        const authorizationHeader = headers().get("authorization");
        const bearerToken = authorizationHeader && authorizationHeader.startsWith("Bearer ") ? authorizationHeader.slice(7) : null;
        const { userId } = await handleAuthorization({ apiKey, bearerToken })
        const existingLead = await db.lead.findFirst({
            where: {
                userId: userId,
                id: leadId
            },
        });
        if (!existingLead) {
            return NextResponse.json({ success: false, error: "Not Found", message: "No lead found with this id" } satisfies ApiLeadUploadError, { status: 404 });

        }
        const lead = await db.lead.delete({
            where: {
                userId: userId,
                id: leadId
            },
            select: {
                id: true,
                name: true,
                phone: true,
                address: true,
                status: true,
                createdAt: true,
                region: true,
            }
        });
        return NextResponse.json({
            sucess: true,
            message: "Lead deleted sucessfully",
            lead
        }, { status: 200 });
    } catch (err) {
        if (err instanceof AuthorizationError) {
            return NextResponse.json({ success: false, error: "unauthorized", message: err.details.message } satisfies ApiLeadUploadError, { status: 401 });
        }
        else if (err instanceof Error) {
            return NextResponse.json({ success: false, error: "error", message: err.message } satisfies ApiLeadUploadError, { status: 500 });
        } else {
            return NextResponse.json({ success: false, error: "error", message: "Something went wrong" } satisfies ApiLeadUploadError, { status: 500 });
        }
    }
}
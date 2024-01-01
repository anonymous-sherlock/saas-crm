import { db } from '@/db';
import { handleAuthorization } from '@/lib/helpers/handleAuthorization.helper';
import { ApiLeadUploadError, AuthorizationError } from '@/types/api-type';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const GetLeads = async (req: NextRequest, res: NextResponse) => {

    try {
        const apiKey = headers().get("API_KEY");
        const authorizationHeader = headers().get("authorization");
        const bearerToken = authorizationHeader && authorizationHeader.startsWith("Bearer ") ? authorizationHeader.slice(7) : null;
        const { userId } = await handleAuthorization({ apiKey, bearerToken })

        const leads = await db.lead.findMany({
            where: {
                userId: userId
            },
        });
        return NextResponse.json(leads, { status: 200 });

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


};


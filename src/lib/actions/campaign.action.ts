import { db } from "@/db";

type findCampaignByCodeProps = {
    campaignCode: string
}
export async function findCampaignByCode({ campaignCode }: findCampaignByCodeProps) {
    const campaign = await db.campaign.findUnique({
        where: {
            code: campaignCode,
        },
    });
    if (!campaign) return null
    return campaign
}
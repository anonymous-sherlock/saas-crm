import { server } from "@/app/_trpc/server";
import {CampaignStats} from "@/components/campaigns/CampaignStats";
import { notFound } from "next/navigation";

export default async function CampaginStatsPage({ params }: { params: { campaignId: string } }) {
    const campaign = await server.campaign.get({ camapaingId: params.campaignId })

    if (!campaign) {
        notFound()
    }
    
    return (
        <CampaignStats campaign={campaign} />
    )
}
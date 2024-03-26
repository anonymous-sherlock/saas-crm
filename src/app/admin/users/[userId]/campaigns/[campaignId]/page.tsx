import { server } from "@/app/_trpc/server";
import { CampaignStats } from "@/components/template/campaigns/CampaignStats";
import { notFound } from "next/navigation";

interface UserCampaginStatsPageProps {
  params: {
    userId: string;
    campaignId: string;
  };
}
export default async function UserCampaginStatsPage({ params: { campaignId, userId } }: UserCampaginStatsPageProps) {
  try {
    const campaign = await server.campaign.get({ camapaingId: campaignId, userId: userId });
    if (campaign) {
      return <CampaignStats campaign={campaign} />;
    }
  } catch (error) {
    console.log(error);
    return notFound();
  }
}

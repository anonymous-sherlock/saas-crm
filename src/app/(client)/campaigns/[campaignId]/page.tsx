import { server } from "@/app/_trpc/server";
import { CampaignStats } from "@/components/template/campaigns/CampaignStats";
import { getAuthUser, getCurrentUser } from "@/lib/auth";
import { authPages } from "@routes";
import { notFound, redirect } from "next/navigation";

export default async function CampaginStatsPage({ params }: { params: { campaignId: string } }) {
  const { authUserId } = await getAuthUser();
  if (!authUserId) redirect(authPages.login);

  try {
    const campaign = await server.campaign.get({ camapaingId: params.campaignId, userId: authUserId });
    if (campaign) {
      return <CampaignStats campaign={campaign} />;
    }
  } catch (error) {
    console.log(error);
    return notFound();
  }
}

import { server } from "@/app/_trpc/server";
import { CampaignStats } from "@/components/template/campaigns/campaign-stats";
import { getAuthUser } from "@/lib/auth";
import { authPages } from "@routes";
import { notFound, redirect } from "next/navigation";
export const dynamic = 'force-dynamic';

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

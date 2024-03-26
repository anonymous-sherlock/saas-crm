import { server } from "@/app/_trpc/server";
import { CampaignStats } from "@/components/template/campaigns/CampaignStats";
import { getCurrentUser } from "@/lib/auth";
import { authPages } from "@routes";
import { notFound, redirect } from "next/navigation";

export default async function CampaginStatsPage({ params }: { params: { campaignId: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect(authPages.login);

  try {
    const campaign = await server.campaign.get({ camapaingId: params.campaignId, userId: user.id });
    if (campaign) {
      return <CampaignStats campaign={campaign} />;
    }
  } catch (error) {
    console.log(error);
    return notFound();
  }
}

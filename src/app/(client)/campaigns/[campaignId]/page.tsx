import { server } from "@/app/_trpc/server";
import { CampaignStats } from "@/components/campaigns/CampaignStats";
import { getAuthSession } from "@/lib/authOption";
import { notFound, redirect } from "next/navigation";

export default async function CampaginStatsPage({ params }: { params: { campaignId: string } }) {

  const session = await getAuthSession()

  if (!session) redirect("/login")

  try {
    const campaign = await server.campaign.get({ camapaingId: params.campaignId })
    if (campaign) {
      return <CampaignStats campaign={campaign} user={session.user} />
    }
  } catch (error) {
    console.log(error)
    return notFound()
  }
}
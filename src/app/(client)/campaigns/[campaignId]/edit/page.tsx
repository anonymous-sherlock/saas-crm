import { server } from "@/app/_trpc/server";
import CampaignForm from "@/components/template/campaigns/CampaignForm";
import { getCurrentUser } from "@/lib/auth";
import { authPages } from "@routes";
import { notFound, redirect } from "next/navigation";

export default async function CampaginEditPage({ params }: { params: { campaignId: string } }) {
  const user = await getCurrentUser()
  if (!user) redirect(authPages.login)
  try {
    const campaign = await server.campaign.get({ camapaingId: params.campaignId })
    if (campaign) {
      return <CampaignForm 
      title="Update Campaign Details"
      data={campaign} type="update" />
    }
  } catch (error) {
    console.log(error)
    return notFound()
  }
}
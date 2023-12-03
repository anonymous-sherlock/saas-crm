import { server } from "@/app/_trpc/server";
import { CampaignStats } from "@/components/campaigns/CampaignStats";
import { notFound } from "next/navigation";

export default async function CampaginStatsPage({ params }: { params: { campaignId: string } }) {

  return <>
  {params.campaignId}
  </>
}
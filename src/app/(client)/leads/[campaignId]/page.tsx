import { server } from "@/app/_trpc/server";
import LeadsForm from "@/components/leads/LeadsForm";
import { db } from "@/db";
import { getCurrentUser } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import SingleCampaignLeads from "./singleCampaignLeads/_table/SingleCampaignLeads";
import { authPages } from "@routes";

export default async function LeadsPage({
  params
}: {
  params: { codeID: string };
  searchParams: { [key: string]: string | string[] | undefined }

}) {

  const user = await getCurrentUser()
  if (!user) redirect(authPages.login)

  const { actor, isImpersonating } = user
  const campaign = await db.campaign.findFirst({
    where: {
      code: params.codeID,
      userId: isImpersonating ? actor.userId : user.id
    },
    select: {
      name: true,
      id: true,
      code: true,
    }
  })
  if (!campaign) {
    notFound()
  }

  const Leads = await server.lead.getCampaignLeads({ campaignId: campaign.id });

  return (
    <main className="mx-auto max-w-7xl md:p-2">
      <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
        <h1 className="mb-3 font-bold text-3xl text-gray-900">Leads for <span className='text-green-600'>{campaign.name}</span></h1>

        <LeadsForm campaignCode={campaign.code} />
      </div>

      <SingleCampaignLeads campaignId={campaign.id} leads={Leads} />
    </main>
  );
} 
"use client";
import { trpc } from "@/app/_trpc/client";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { BarChart2, Ghost, Plus } from "lucide-react";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import { buttonVariants } from "../../ui/button";
import { DeleteCampaign } from "./DeleteCampaign";
import { CAMPAIGN_STATUS } from "@/constants/index";
import { CustomBadge } from "../../CustomBadge";


const CampaignDashboard = () => {

  const { data: campaigns, isLoading } = trpc.campaign.getAll.useQuery();



  return (
    <main className="mx-auto max-w-7xl md:p-2">
      <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
        <h1 className="mb-3 font-bold text-4xl text-gray-900">My Campaigns</h1>

        <Link href="/campaigns/create" className={cn(buttonVariants({ variant: "default" }), "rounded-full")}>Create Campaign</Link>
      </div>

      {/* display all user ccampaign */}
      {campaigns && campaigns?.length !== 0 ? (
        <ul className="mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3">
          {campaigns
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((campaign) => (
              <li key={campaign.id} className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg">
                <Link href={`/campaigns/${campaign.id}`} className="flex flex-col gap-2 relative">
                  <div className="pt-6 px-6 flex w-full items-center justify-between space-x-6">
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
                    <div className="flex-1 truncate">
                      <div className="flex items-center space-x-3">
                        <h3 className="truncate text-md font-medium text-zinc-900">{campaign.name}</h3>
                        <CustomBadge badgeValue={campaign.status} status={CAMPAIGN_STATUS} />
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="px-6 mt-4 grid grid-cols-3 place-items-center py-2 gap-2 text-xs text-zinc-500">
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    {format(new Date(campaign.createdAt), "MMM dd, yyyy")}
                  </div>

                  <Link href={`/leads/${campaign.code}`} >
                    <div className="flex items-center gap-2">
                      <BarChart2 className="h-4 w-4" />
                      {campaign._count.leads ?? 0}
                    </div>
                  </Link>
                  <DeleteCampaign campaignId={campaign.id} />
                </div>
              </li>
            ))}
        </ul>
      ) : isLoading ? (
        <Skeleton height={100} className="my-2" count={3} />
      ) : (
        <div className="mt-16 flex flex-col items-center gap-2">
          <Ghost className="h-8 w-8 text-zinc-800" />
          <h3 className="font-semibold text-xl">Pretty empty around here</h3>
          <p>Let&apos;s create your first campaign.</p>
        </div>
      )}
    </main>
  );
};

export default CampaignDashboard;

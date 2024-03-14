import { db } from "@/db";
import { cn } from "@/lib/utils";
import { CampaignsFilterValues } from "@/schema/filter.schema";
import { Prisma } from "@prisma/client";
import Link from "next/link";

import { Pagination } from "@/components/global/pagination";
import { buttonVariants } from "@/ui/button";
import CampaignCard from "./CampaignCard";
import { getAllCampaignsType } from "@/lib/actions/campaign.action";

interface CampaignsResultsProps {
  data: getAllCampaignsType
  baseUrl: string;
}

export default async function CampaignsResults({
  data: { campaigns, totalResults, campaignsPerPage, page },
  baseUrl,
}: CampaignsResultsProps) {
  return (
    <div className="grow space-y-4">
      <section className={cn("grid gap-6 sm:grid-cols-2 lg:grid-cols-3")}>
        {campaigns.map((campaign) => (
          <CampaignCard key={campaign.id} href={`${baseUrl}/${campaign.id}`} campaign={campaign} leadsCount={campaign._count.leads} />
        ))}
      </section>
      {campaigns.length === 0 && (
        <p className="m-auto text-center">
          No Campaigns found. Try adjusting your search filters.{" "}<Link href={`?`} className={cn(buttonVariants({ variant: "link" }))}>Clear Filters</Link>
        </p>
      )}
      {campaigns.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={Math.ceil(totalResults / campaignsPerPage)}
        />
      )}
    </div>
  );
}


import { db } from "@/db";
import { cn } from "@/lib/utils";
import { CampaignsFilterValues } from "@/schema/filter.schema";
import { Prisma } from "@prisma/client";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/ui/button";
import CampaignCard from "./CampaignCard";

interface CampaignsResultsProps {
  filterValues: CampaignsFilterValues;
  page?: number;
}

export default async function CampaignsResults({
  filterValues,
  page: searchPage = 1,
}: CampaignsResultsProps) {
  const { q, status } = filterValues;
  const campaignsPerPage = 9;
  const page = isNaN(searchPage) ? 1 : searchPage
  const skip = (page - 1) * campaignsPerPage;

  const searchString = q
    ?.split(" ")
    .filter((word) => word.length > 0)
    .join(" & ");

  const searchFilter: Prisma.CampaignWhereInput = searchString
    ? {
      OR: [
        { name: { search: searchString, } },
        { code: { contains: searchString } },
        { description: { search: searchString } },
      ],
    }
    : {};

  const where: Prisma.CampaignWhereInput = {
    AND: [
      searchFilter,
      status && status === "All" ? {} : {},
      status !== "All" ? { status: status } : {},

    ],
  };

  const campaignsPromise = db.campaign.findMany({
    where,
    select: {
      id: true,
      name: true,
      code: true,
      status: true,
      createdAt: true,
      _count: {
        select: {
          leads: true
        }
      }
    },
    orderBy: { createdAt: "desc" },
    take: campaignsPerPage,
    skip,

  });

  const countPromise = db.campaign.count({ where });
  const [campaigns, totalResults] = await Promise.all([campaignsPromise, countPromise]);

  return (
    <div className="grow space-y-4">
      <section className={cn("grid gap-6 sm:grid-cols-2 lg:grid-cols-3")}>
        {campaigns.map((campaign) => (
          <CampaignCard key={campaign.id} href={`/admin/user-campaigns/${campaign.id}`} campaign={campaign} leadsCount={campaign._count.leads} />
        ))}
      </section>
      {campaigns.length === 0 && (
        <p className="m-auto text-center">
          No Campaigns found. Try adjusting your search filters.{" "}<Link href="/admin/user-campaigns/?" className={cn(buttonVariants({ variant: "link" }))}>Clear Filters</Link>
        </p>
      )}
      {campaigns.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={Math.ceil(totalResults / campaignsPerPage)}
          filterValues={filterValues}
        />
      )}
    </div>
  );
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  filterValues: CampaignsFilterValues;
}

function Pagination({
  currentPage,
  totalPages,
  filterValues: { q, status },
}: PaginationProps) {
  function generatePageLink(page: number) {
    const searchParams = new URLSearchParams({
      ...(q && { q }),
      ...(status && { status: status }),
      page: page.toString(),
    });

    return `/admin/user-campaigns/?${searchParams.toString()}`;
  }

  return (
    <div className="flex justify-between !mt-10">
      <Link
        href={generatePageLink(currentPage - 1)}
        className={cn(
          "flex items-center gap-2 font-semibold",
          currentPage <= 1 && "invisible",
        )}
      >
        <ArrowLeft size={16} />
        Previous page
      </Link>
      <span className="font-semibold">
        Page {currentPage} of {totalPages}
      </span>
      <Link
        href={generatePageLink(currentPage + 1)}
        className={cn(
          "flex items-center gap-2 font-semibold",
          currentPage >= totalPages && "invisible",
        )}
      >
        Next page
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}

import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/global/page-header";
import { AddLeadsForm } from "@/components/leads/add-lead-form";
import { DataTableSkeleton } from "@/components/tables/global/data-table-skeleton";
import LeadsTableShell from "@/components/tables/leads_table/leads-table-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { getDateFromParams } from "@/lib/helpers/date";
import { lead } from "@/server/api/lead";
import { notFound } from "next/navigation";
import React from "react";

interface UserCampaignLeadsPageProps {
  params: {
    userId: string;
    campaignId: string;
  };
  searchParams: {
    date?: string;
  };
}
async function CampaignLeadsPage({ params: { campaignId, userId }, searchParams: { date } }: UserCampaignLeadsPageProps) {
  const campaign = await db.campaign.findFirst({ where: { OR: [{ code: campaignId }, { id: campaignId }] } });
  if (!campaign) notFound();

  const { from, to } = getDateFromParams(date);
  const leads = await lead.getCampaignLeads({ date: { from, to }, campaignId: campaign.id, userId: campaign.userId });

  return (
    <>
      <PageHeader className="flex flex-col md:flex-row justify-between md:items-center">
        <div>
          <div className="flex space-x-4">
            <PageHeaderHeading size="sm" className="flex-1 font-bold text-lg">
              Leads for <span className="text-green-600">{campaign.name}</span>
            </PageHeaderHeading>
          </div>
          <PageHeaderDescription size="sm">Manage Leads</PageHeaderDescription>
        </div>
        <div>
          <AddLeadsForm campaignId={campaign.id} />
        </div>
      </PageHeader>
      <div className="p-0 md:!pt-4">
        <React.Suspense>
          <Card className="col-span-3 !mt-0">
            <CardHeader>
              <CardTitle>Welcome back!</CardTitle>
              <CardDescription>Here&apos;s a list of all your leads!.</CardDescription>
            </CardHeader>
            <CardContent>
              <React.Suspense fallback={<DataTableSkeleton columnCount={6} />}>
                <LeadsTableShell data={leads ?? []} />
              </React.Suspense>
            </CardContent>
          </Card>
        </React.Suspense>
      </div>
    </>
  );
}

export default CampaignLeadsPage;

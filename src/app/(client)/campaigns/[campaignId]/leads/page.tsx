import LowBalanceCard from "@/components/global/cards/low-balance-card";
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/global/page-header";
import { AddLeadsForm } from "@/components/leads/add-lead-form";
import { DataTableSkeleton } from "@/components/tables/global/data-table-skeleton";
import LeadsTableShell from "@/components/tables/leads_table/leads-table-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { getAuthUser } from "@/lib/auth";
import { getDateFromParams } from "@/lib/helpers/date";
import { lead } from "@/server/api/lead";
import { authPages } from "@routes";
import { notFound, redirect } from "next/navigation";
import React from "react";
import { Card as NextUiCard } from "@nextui-org/card";
import { LowBalanceAlert } from "@/components/global/alerts/low-balance-alert";
export const dynamic = "force-dynamic";

interface CampaignLeadsPageProps {
  params: {
    campaignId: string;
  };
  searchParams: {
    date?: string;
  };
}
async function CampaignLeadsPage({ params: { campaignId }, searchParams: { date } }: CampaignLeadsPageProps) {
  const { authUserId } = await getAuthUser();
  if (!authUserId) redirect(authPages.login);
  const { from, to } = getDateFromParams(date);

  const campaign = await db.campaign.findFirst({ where: { userId: authUserId, OR: [{ code: campaignId }, { id: campaignId }] } });
  if (!campaign) notFound();

  const wallet = await db.wallet.findFirst({ where: { userId: authUserId } });
  if (wallet && wallet?.balance < 50) {
    return (
      <NextUiCard className="w-max mx-auto p-4">
        <LowBalanceCard />
      </NextUiCard>
    );
  }

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
                <LeadsTableShell data={leads ?? []} userId={authUserId} />
              </React.Suspense>
            </CardContent>
          </Card>
        </React.Suspense>
      </div>
      <LowBalanceAlert balance={wallet?.balance ?? 0} />
    </>
  );
}

export default CampaignLeadsPage;

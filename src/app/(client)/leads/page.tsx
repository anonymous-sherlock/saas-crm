import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/global/page-header";
import UploadLeadFromExcel from "@/components/leads/upload-lead-from-excel";
import { DataTableSkeleton } from "@/components/tables/global/data-table-skeleton";
import LeadsTableShell from "@/components/tables/leads_table/leads-table-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { getAuthUser } from "@/lib/auth";
import { getDateFromParams } from "@/lib/helpers/date";
import { lead } from "@/server/api/lead";
import { authPages } from "@routes";
import { redirect } from "next/navigation";
import React from "react";

export const dynamic = "force-dynamic";

interface LeadsPageProps {
  searchParams: {
    date?: string;
  };
}
export default async function LeadsPage({ searchParams: { date } }: LeadsPageProps) {
  const { authUserId } = await getAuthUser();
  if (!authUserId) redirect(authPages.login);
  const { from, to } = getDateFromParams(date);
  const leads = await lead.getAllLeads({ userId: authUserId, date: { from, to } });

  const wallet = await db.wallet.findFirst({ where: { userId: authUserId } });

  if (wallet && wallet?.balance < 50) {
    return "Low Balance";
  }
  return (
    <>
      <PageHeader separated>
        <div className="flex flex-col md:flex-row justify-between md:items-center">
          <div>
            <div className="flex space-x-4">
              <PageHeaderHeading size="sm" className="flex-1">
                All Leads
              </PageHeaderHeading>
            </div>
            <PageHeaderDescription size="sm">Manage Leads</PageHeaderDescription>
          </div>
          <UploadLeadFromExcel />
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
    </>
  );
}

import { server } from '@/app/_trpc/server';
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '@/components/global/page-header';
import LeadsForm from '@/components/leads/LeadsForm';
import { DataTableSkeleton } from '@/components/tables/global/data-table-skeleton';
import LeadsTableShell from '@/components/tables/leads_table/leads-table-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '@/db';
import { getCampaignLeads } from '@/lib/actions/lead.action';
import { getCurrentUser } from '@/lib/auth';
import { safeExecute } from '@/lib/utils';
import { authPages } from '@routes';
import { notFound, redirect } from 'next/navigation';
import React from 'react';


interface CampaignLeadsPageProps {
  params: {
    campaignId: string
  }
}
async function CampaignLeadsPage({ params: { campaignId } }: CampaignLeadsPageProps) {
  const user = await getCurrentUser()
  if (!user) redirect(authPages.login)

  const campaign = await db.campaign.findFirst({
    where: {
      OR: [
        { code: campaignId },
        { id: campaignId },
      ]
    }
  })
  if (!campaign) notFound()
  const leads = await safeExecute(() => getCampaignLeads({ campaignId: campaign.id }));

  return (
    <>
      <PageHeader className="flex flex-col md:flex-row justify-between md:items-center">
        <div>
          <div className="flex space-x-4">
            <PageHeaderHeading size="sm" className="flex-1 font-bold text-lg">
              Leads for <span className='text-green-600'>{campaign.name}</span>
            </PageHeaderHeading>
          </div>
          <PageHeaderDescription size="sm">
            Manage Leads
          </PageHeaderDescription>
        </div>
        <div>
          <LeadsForm campaignId={campaign.id} />
        </div>
      </PageHeader>
      <div className="p-0 md:!pt-4">
        <React.Suspense>
          <Card className="col-span-3 !mt-0">
            <CardHeader>
              <CardTitle>Welcome back!</CardTitle>
              <CardDescription>
                Here&apos;s a list of all your leads!.
              </CardDescription>
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

export default CampaignLeadsPage
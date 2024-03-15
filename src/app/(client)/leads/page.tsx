import { server } from '@/app/_trpc/server';
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '@/components/global/page-header';
import { DataTableSkeleton } from '@/components/tables/global/data-table-skeleton';
import LeadsTableShell from '@/components/tables/leads_table/leads-table-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getCurrentUser } from '@/lib/auth';
import { authPages } from '@routes';
import { redirect } from 'next/navigation';
import React from 'react';


interface LeadsPageProps {

}
async function LeadsPage({ }: LeadsPageProps) {
  const user = await getCurrentUser()
  if (!user) redirect(authPages.login)

  const leads = await server.lead.getAll();

  return (
    <>
      <PageHeader className="flex flex-col md:flex-row justify-between md:items-center">
        <div>
          <div className="flex space-x-4">
            <PageHeaderHeading size="sm" className="flex-1">
              All Leads
            </PageHeaderHeading>
          </div>
          <PageHeaderDescription size="sm">
            Manage Leads
          </PageHeaderDescription>
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

export default LeadsPage
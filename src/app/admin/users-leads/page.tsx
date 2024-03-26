import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/global/page-header";
import { DataTableSkeleton } from "@/components/tables/global/data-table-skeleton";
import AdminAllLeadsTableShell from "@/components/tables/leads_table/admin-all-leads-table-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAuthUser, getCurrentUser } from "@/lib/auth";
import { allowedAdminRoles } from "@/lib/auth.permission";
import { getDateFromParams } from "@/lib/helpers/date";
import { lead } from "@/server/api/lead";
import { authPages } from "@routes";
import { notFound, redirect } from "next/navigation";
import React from "react";

interface AllUsersLeadsPageProps {
  searchParams: {
    date?: string;
  };
}
const AllUsersLeadsPage = async ({ searchParams: { date } }: AllUsersLeadsPageProps) => {
  const user = await getCurrentUser();
  if (!user) redirect(authPages.login);
  const isAdmin = allowedAdminRoles.some((role) => role === user.role);
  if (!isAdmin) return notFound();
  const { from, to } = getDateFromParams(date);
  const leads = await lead.getAllUsersLeads({ date: { from, to } });
  return (
    <>
      <PageHeader separated>
        <div className="flex flex-col md:flex-row justify-between md:items-center">
          <div>
            <div className="flex space-x-4">
              <PageHeaderHeading size="sm" className="flex-1">
                All Users Leads
              </PageHeaderHeading>
            </div>
            <PageHeaderDescription size="sm">Manage Leads</PageHeaderDescription>
          </div>
        </div>
      </PageHeader>
      <div className="p-0 md:!pt-4">
        <React.Suspense>
          <Card className="col-span-3 !mt-0">
            <CardHeader>
              <CardTitle>Welcome back!</CardTitle>
              <CardDescription>Here&apos;s a list of all users leads!.</CardDescription>
            </CardHeader>
            <CardContent>
              <React.Suspense fallback={<DataTableSkeleton columnCount={6} />}>
                <AdminAllLeadsTableShell data={leads ?? []} />
              </React.Suspense>
            </CardContent>
          </Card>
        </React.Suspense>
      </div>
    </>
  );
};

export default AllUsersLeadsPage;

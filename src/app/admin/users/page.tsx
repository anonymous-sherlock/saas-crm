import AddUserForm from "@/components/admin/user/add-user-form";
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/global/page-header";
import { DataTableSkeleton } from "@/components/tables/global/data-table-skeleton";
import UserListTableShell from "@/components/tables/users_list_table/user-list-table-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { getCurrentUser } from "@/lib/auth";
import { allowedAdminRoles } from "@/lib/auth.permission";
import { getDateFromParams } from "@/lib/helpers/date";
import { authPages } from "@routes";
import { redirect } from "next/navigation";
import React from "react";

interface UserListPageProps {
  searchParams: {
    date?: string;
  };
}
export default async function UserListPage({ searchParams: { date } }: UserListPageProps) {
  const user = await getCurrentUser();
  if (!user) redirect(authPages.login);
  const { from, to } = getDateFromParams(date);

  const users = await db.user.findMany({
    where: {
      id: { not: user.id },
      createdAt: {
        gte: from,
        lte: to,
      },
    },
    include: { company: { select: { id: true, name: true, address: true } } },
    orderBy: { createdAt: "desc" },
  });

  const isAdmin = allowedAdminRoles.some((role) => role === user.role);
  return (
    <div className="flex flex-col gap-4">
      <PageHeader className="" separated>
        <div className="flex flex-col md:flex-row justify-between md:items-center">
          <div>
            <div className="flex space-x-4">
              <PageHeaderHeading size="sm" className="flex-1">
                All Users
              </PageHeaderHeading>
            </div>
            <PageHeaderDescription size="sm">Manage Users</PageHeaderDescription>
          </div>
          {isAdmin ? <AddUserForm /> : null}
        </div>
      </PageHeader>
      <div className="p-0">
        <React.Suspense>
          <Card className="!mt-0">
            <CardHeader>
              <CardTitle>Welcome back!</CardTitle>
              <CardDescription>Here&apos;s a list of all the users!.</CardDescription>
            </CardHeader>
            <CardContent>
              <React.Suspense fallback={<DataTableSkeleton columnCount={6} />}>
                <UserListTableShell data={users ?? []} />
              </React.Suspense>
            </CardContent>
          </Card>
        </React.Suspense>
      </div>
    </div>
  );
}

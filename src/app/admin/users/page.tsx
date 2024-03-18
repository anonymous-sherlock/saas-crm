import AddUserForm from "@/components/admin/user/AddUserForm"
import UserListTableShell from "@/components/tables/users_list_table/user-list-table-shell"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { db } from "@/db"
import { getCurrentUser } from "@/lib/auth"
import { authPages } from "@routes"
import { Ghost } from "lucide-react"
import { redirect } from "next/navigation"
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '@/components/global/page-header';
import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTableSkeleton } from "@/components/tables/global/data-table-skeleton"

export default async function UserListpage() {
  const user = await getCurrentUser()
  if (!user) redirect(authPages.login)
  const users = await db.user.findMany({
    where: { id: { not: user.id } },
    include: { company: { select: { id: true, name: true, address: true } } },
    orderBy: {
      createdAt: "desc"
    }
  })

  const isAdmin = user.role === "ADMIN"
  return (
    <div className="flex flex-col gap-4">
      <PageHeader className="" separated >
        <div className="flex flex-col md:flex-row justify-between md:items-center">
          <div>
            <div className="flex space-x-4">
              <PageHeaderHeading size="sm" className="flex-1">
                All Users
              </PageHeaderHeading>
            </div>
            <PageHeaderDescription size="sm">
              Manage Users
            </PageHeaderDescription>
          </div>
          {isAdmin ? <AddUserForm /> : null}
        </div>
      </PageHeader>
      <div className="p-0">
        <React.Suspense>
          <Card className="!mt-0">
            <CardHeader>
              <CardTitle>Welcome back!</CardTitle>
              <CardDescription>
                Here&apos;s a list of all the users!.
              </CardDescription>
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
  )
}
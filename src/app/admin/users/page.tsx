import AddUserForm from "@/components/admin/user/AddUserForm"
import UserListTableShell from "@/components/tables/users_list_table/user-list-table-shell"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { db } from "@/db"
import { getCurrentUser } from "@/lib/auth"
import { authPages } from "@routes"
import { Ghost } from "lucide-react"
import { redirect } from "next/navigation"

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

  return (
    <div className="">
      <ScrollArea className="w-full rounded-md" type="always">
        <div className="border h-full flex-1 flex-col space-y-8 rounded-lg bg-white p-8 md:flex">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Welcome Admin!
              </h2>
              <p className="text-muted-foreground">
                Here&apos;s a list of all your users!
              </p>
            </div>
            {user.role === "ADMIN" ?
              <AddUserForm /> : null
            }
          </div>
          {users.length === 0 ? (
            <div className="!mb-20 !mt-20 flex flex-col items-center gap-2">
              <Ghost className="h-8 w-8 text-zinc-800" />
              <h3 className="text-xl font-semibold">
                Pretty empty around here
              </h3>
              <p>Let&apos;s upload your first product.</p>
            </div>
          ) : (
            <UserListTableShell data={users} />
          )}
        </div>
        <ScrollBar orientation="horizontal" className="w-full" />
      </ScrollArea>
    </div>
  )
}
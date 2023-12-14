import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { db } from "@/db"
import { getAuthSession } from "@/lib/authOption"
import { Ghost } from "lucide-react"
import { redirect } from "next/navigation"
import { columns } from "./_usersTable/columns"
import { DataTable } from "./_usersTable/data-table"
import AddUserForm from "@/components/admin/AddUserForm"

export default async function UserListpage() {


  const session = await getAuthSession()
  if (!session) redirect("/login")

  const users = await db.user.findMany({
    where: {
      id: {
        not: session.user.id
      }
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
            {session.user.role === "ADMIN" ?
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
            <DataTable data={users} columns={columns} />
          )}
        </div>
        <ScrollBar orientation="horizontal" className="w-full" />
      </ScrollArea>
    </div>
  )
}
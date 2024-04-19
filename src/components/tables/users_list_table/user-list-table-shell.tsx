"use client";
import { Icons } from "@/components/Icons";
import { Badge } from "@/components/ui/badge";
import { USER_ROLE } from "@/constants/index";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/ui/checkbox";
import { User } from "@nextui-org/react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import React, { FC } from "react";
import { DataTable } from "../global/data-table";
import { DataTableColumnHeader } from "../global/data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { UserListColumnDef } from "./schema";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface UserListTableShellProps {
  data: UserListColumnDef[];
}

const UserListTableShell: FC<UserListTableShellProps> = ({ data }) => {
  const { data: session, status } = useSession();
  const UsersColumnDef = React.useMemo<ColumnDef<UserListColumnDef>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
            className="translate-y-[2px]"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="translate-y-[2px]"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "id",
        header: ({ column }) => <DataTableColumnHeader column={column} title="User Id" />,
        cell: ({ row }) => <div className="w-[75px] truncate">{row.original.id}</div>,
        enableSorting: false,
        enableHiding: false,
      },
      {
        id: "user",
        accessorFn: (row) => row.email,
        header: ({ column }) => <DataTableColumnHeader column={column} title="User" />,
        cell: ({ row }) => (
          <div>
            <User
              as="button"
              name={
                <>
                  {row.original.name}
                  {session?.user.id === row.original.id ? (
                    <Badge className={cn("pointer-events-none ml-2 rounded-sm px-1 font-semibold", "border-green-600/20 bg-green-100 text-green-700")}>
                      You
                    </Badge>
                  ) : null}
                </>
              }
              description={row.original?.email}
              avatarProps={{
                size: "sm",
                isBordered: true,
                src: row.original.image ?? "",
                className: "shrink-0",
                fallback: <Icons.user className="h-4 w-4 text-zinc-900" />,
              }}
            />
          </div>
        ),
        enableSorting: false,
        enableGlobalFilter: true,
        enableColumnFilter: true,
        filterFn: (row, id, value) => {
          return row.original.email.includes(value) || row.original.name.includes(value);
        },
      },
      {
        accessorKey: "role",
        header: ({ column }) => <DataTableColumnHeader column={column} title="User Role" />,
        cell: ({ row }) => {
          const UserRole = USER_ROLE.find((role) => role.value === row.original.role)?.label;
          if (!UserRole) {
            return row.original.role;
          }
          return <div className={cn("flex w-[100px] items-center")}>{UserRole}</div>;
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
        enableSorting: false,
      },
      {
        id: "Total Campaigns",
        accessorFn: (row) => row._count.campaigns,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Campaigns" />,
        cell: ({ row }) => (
          <div className="truncate flex gap-2 items-center justify-center mx-auto">
            <span className="">{row.original._count.campaigns}</span>
            <Link href={`/admin/users/${row.original.id}/campaigns`}>
              <ExternalLink className="size-4 text-primary" />
            </Link>
          </div>
        ),
        enableSorting: false,
      },
      {
        id: "Total Leads",
        accessorFn: (row) => row._count.leads,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Leads" />,
        cell: ({ row }) => (
          <div className="truncate flex gap-2 items-center justify-center mx-auto">
            <span className="">{row.original._count.leads}</span>
            <Link href={`/admin/users/${row.original.id}/leads`}>
              <ExternalLink className="size-4 text-primary" />
            </Link>
          </div>
        ),
        enableSorting: false,
      },
      {
        id: "Account Active",
        accessorKey: "active",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Account Active" />,
        cell: ({ row }) => (
          <div className="truncate">
            <Badge
              className={cn(
                "pointer-events-none  rounded-sm px-2 py-0.5 font-semibold",
                row.original.active ? "border-green-600/20 bg-green-100 text-green-700" : "border-red-600/10 bg-red-100 text-red-700",
              )}
            >
              {row.original.active ? "Active" : "Inactive"}
            </Badge>
          </div>
        ),
        enableSorting: false,
      },
      {
        id: "Joined On",
        accessorKey: "createdAt",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Joined on" />,
        cell: ({ row }) => <div className="truncate">{format(row.original.createdAt, "dd, MMM - hh:mm a")}</div>,
        enableSorting: true,
      },
      {
        id: "actions",
        cell: ({ row }) => <DataTableRowActions row={row} />,
        size: 50,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data],
  );
  return (
    <DataTable
      data={data ?? []}
      columns={UsersColumnDef}
      filterableColumns={[
        {
          id: "role",
          title: "Role",
          options: USER_ROLE,
        },
      ]}
      searchPlaceholder="Search users..."
      messages={{
        filteredDataNotFoundMessage: { title: "No Users Found!", description: "Add some users to get started!" },
        emptyDataMessage: { title: "No users Found!", description: "Add some users to get started!" },
      }}
    />
  );
};

export default UserListTableShell;

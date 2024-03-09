"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/ui/checkbox";

import {
  $Enums, Company
} from "@prisma/client";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { format } from "date-fns";
import { USER_ROLE } from "@/constants/index";
import { cn } from "@/lib/utils";
export type UsersList = {
  id: string;
  name: string;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  role: $Enums.Role;
  password: string | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  company: {
    id: string | undefined | null,
    name: string | undefined | null,
    address: string | undefined | null
  } | undefined
};

export const columns: ColumnDef<UsersList>[] = [
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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User Id" />
    ),
    cell: ({ row }) => (
      <div className="w-[75px] truncate">{row.original.id}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <div className="truncate">
        {row.original.name}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User Email" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex max-w-[220px] space-x-2 ">
          {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
          <span className="w-full truncate font-medium ">
            {row.original.email}
          </span>

        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User Role" />
    ),
    cell: ({ row }) => {
      const UserRole = USER_ROLE.find((role) => role.value === row.original.role)?.label;
      if (!UserRole) {
        return row.original.role;
      }
      return (
        <div
          className={cn(
            "flex w-[100px] items-center",

          )}
        >
          {UserRole}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableSorting: false,

  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="joined on" />
    ),
    cell: ({ row }) => (
      <div className="truncate">
        {format(row.original.createdAt, 'dd, MMM - hh:mm a')}
      </div>
    ),
    enableSorting: false,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
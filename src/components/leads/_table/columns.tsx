"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/ui/checkbox";

import { CustomBadge } from "@/components/CustomBadge";
import TooltipComponent from "@/components/global/tooltip-component";
import { LEADS_STATUS } from "@/constants/index";
import { cn } from "@/lib/utils";
import {
  LeadStatus
} from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
export type Lead = {
  id: string;
  ip: string;
  name: string;
  phone: string;
  address: string;
  state: string;
  region: string;
  country: string;
  status: LeadStatus;
  createdAt: Date;
  updatedAt: Date;
  campaign: {
    name: string;
    id: string;
    code: string
  };
  userId: string | null;
};

export const columns: ColumnDef<Lead>[] = [
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
      <DataTableColumnHeader column={column} title="Lead Id" />
    ),
    cell: ({ row }) => (
      <div className="w-[75px] truncate">{row.getValue("id")}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "campaign",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Campaign code" />
    ),
    cell: ({ row }) => (
      <div className="truncate">
        <TooltipComponent delayDuration={300} message={`${row.original.campaign.code} - ${row.original.campaign.name}`}>
          <span className="cursor-default">
            {`${row.original.campaign.code} - ${row.original.campaign.name.substring(0, 8)}`}
          </span>
        </TooltipComponent>
      </div>
    ),
    filterFn: (row, id, value) => {
      return row.original.campaign.code.includes(row.getValue(id))
    },

    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const cell = row.original;

      return (
        <div className="flex max-w-[220px] space-x-2 ">
          {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
          <span className="w-full truncate font-medium ">
            {row.getValue("name")}{" "}
          </span>

        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex max-w-[220px] space-x-2 ">
          <span className="w-full truncate font-medium ">
            {row.getValue("phone")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Address" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex max-w-[180px] items-center ">
          <span className="mr-1 line-clamp-1 whitespace-pre-line leading-7 ">
            {row.original.address}
          </span>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "region",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Region" />
    ),

    cell: ({ row }) => {
      const cell = row.original;
      return (
        <div className="flex max-w-[180px] items-center ">
          <span className="mr-1 line-clamp-1 whitespace-pre-line leading-7 ">
            {cell.region}
          </span>

        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "ip",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="IP" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center ">
          <span className="mr-1 line-clamp-1 whitespace-pre-line leading-7 ">
            {row.original.ip}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Uploaded On" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center max-w-[180px] ">
          <span className="truncate mr-1 ">
            {formatDistanceToNow(row.original.createdAt, { addSuffix: true })}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = LEADS_STATUS.find(
        (status) => status.value === row.getValue("status")
      );
      if (!status) {
        return "Trashed";
      }
      return (
        <div
          className={cn(
            "flex w-[100px] items-center",
            status.value === "Trashed" ? "text-red-500" : status.value === "Approved" ? "text-green-600" : ""
          )}
        >
          <CustomBadge badgeValue={status.value} status={LEADS_STATUS} />
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableSorting: false,

  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
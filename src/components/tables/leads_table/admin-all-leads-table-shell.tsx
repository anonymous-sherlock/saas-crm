"use client";
import { CustomBadge } from "@/components/CustomBadge";
import { LEADS_STATUS } from "@/constants/index";
import { cn } from "@/lib/utils";
import { Option } from "@/types";
import { Checkbox } from "@/ui/checkbox";
import { Tooltip, User } from "@nextui-org/react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import React, { FC } from "react";
import { DataTable } from "../global/data-table";
import { DataTableColumnHeader } from "../global/data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { DeleteLead } from "./delete-lead";
import { DownloadLeadsBtn } from "./download-leads-button";
import { AdminLeadColumnDef } from "./schema";

interface AdminAllLeadsTableShellProps {
  data: AdminLeadColumnDef[];
}

const AdminAllLeadsTableShell: FC<AdminAllLeadsTableShellProps> = ({ data }) => {
  const LeadsColumnDef = React.useMemo<ColumnDef<AdminLeadColumnDef>[]>(
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
          <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" className="translate-y-[2px]" />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "id",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Lead Id" />,
        cell: ({ row }) => <div className="w-[75px] truncate">{row.getValue("id")}</div>,
        enableSorting: false,
        enableHiding: false,
      },
      {
        id: "code",
        accessorFn: (row) => row.campaign.code,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Campaign" />,
        cell: ({ row }) => (
          <div className="w-[75px] truncate">
            <Tooltip
              content={
                <div className="px-4 py-4">
                  <div className="text-small font-semibold">
                    Campaign Name : <span className="font-normal">{row.original.campaign.name}</span>
                  </div>
                  <div className="text-small font-semibold">
                    Campaign Code : <span className="font-normal">{row.original.campaign.code}</span>
                  </div>
                </div>
              }
            >
              <div>
                <span className="text-muted-foreground">#</span>
                {row.original.campaign.code}
              </div>
            </Tooltip>
          </div>
        ),
        enableSorting: false,
        enableGlobalFilter: true,
        enableColumnFilter: true,
        filterFn: (row, id, value) => {
          return row.original.campaign.code.includes(value);
        },
      },
      {
        id: "user-email",
        accessorFn: (row) => row.user?.email,
        header: ({ column }) => <DataTableColumnHeader column={column} title="User" />,
        cell: ({ row }) => (
          <div>
            <User
              as="button"
              name={row.original.user?.name}
              description={row.original.user?.email}
              avatarProps={{
                size: "sm",
                isBordered: true,
                src: row.original.user?.image ?? "",
                className: "shrink-0",
              }}
            />
          </div>
        ),
        enableSorting: false,
        enableGlobalFilter: true,
        enableColumnFilter: true,
        filterFn: (row, id, value) => {
          return !!row.original.user?.email && row.original.user.email.includes(value);
        },
      },
      {
        accessorKey: "name",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
        cell: ({ row }) => (
          <div className="flex max-w-[220px] space-x-2 ">
            <span className="w-full truncate ">{row.original.name} </span>
          </div>
        ),
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
        enableSorting: false,
      },
      {
        accessorKey: "phone",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Phone" />,
        cell: ({ row }) => {
          return (
            <div className="flex max-w-[220px] space-x-2 ">
              <span className="w-full truncate font-medium ">{row.getValue("phone")}</span>
            </div>
          );
        },
        enableSorting: false,
      },
      {
        accessorKey: "address",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Address" />,
        cell: ({ row }) => {
          return (
            <div className="flex max-w-[180px] items-center ">
              <span className="mr-1 line-clamp-1 whitespace-pre-line leading-7 ">{row.original.address}</span>
            </div>
          );
        },
        enableSorting: false,
      },
      {
        accessorKey: "country",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Country" />,
        cell: ({ row }) => {
          const cell = row.original;
          return (
            <div className="flex max-w-[180px] items-center ">
              <span className="mr-1 line-clamp-1 whitespace-pre-line leading-7 ">{cell.country}</span>
            </div>
          );
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
        enableSorting: false,
      },
      {
        accessorKey: "region",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Region" />,

        cell: ({ row }) => {
          const cell = row.original;
          return (
            <div className="flex max-w-[180px] items-center ">
              <span className="mr-1 line-clamp-1 whitespace-pre-line leading-7 ">{cell.region}</span>
            </div>
          );
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
        enableSorting: false,
      },
      {
        accessorKey: "ip",
        header: ({ column }) => <DataTableColumnHeader column={column} title="IP" />,
        cell: ({ row }) => {
          return (
            <div className="flex items-center ">
              <span className="mr-1 line-clamp-1 whitespace-pre-line leading-7 ">{row.original.ip}</span>
            </div>
          );
        },
        enableSorting: false,
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Lead Date" />,
        cell: ({ row }) => {
          return (
            <div className="flex items-center max-w-[180px]">
              <span className="truncate mr-1 ">{format(row.original.createdAt, "yyyy-MM-dd HH:mm:ss")}</span>
            </div>
          );
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
      },
      {
        accessorKey: "status",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }) => {
          const status = LEADS_STATUS.find((status) => status.value === row.getValue("status"));
          if (!status) {
            return "Trashed";
          }
          return (
            <div className={cn("flex w-[100px] items-center", status.value === "Trashed" ? "text-red-500" : status.value === "Approved" ? "text-green-600" : "")}>
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
        size: 50,
      },
    ],
    [],
  );

  const country = React.useMemo(() => {
    const countries = data.map((lead) => lead?.country).filter((country) => country !== null);
    const countryInTable = new Set(countries);
    const options: Option[] = Array.from(countryInTable).map((name) => {
      if (!name) {
        return {
          label: "No Country",
          value: "",
        };
      }
      return {
        label: name,
        value: name,
      };
    });

    return options;
  }, [data]);

  return (
    <DataTable
      data={data ?? []}
      columns={LeadsColumnDef}
      filterableColumns={[
        {
          id: "status",
          title: "Status",
          options: LEADS_STATUS,
        },
        {
          id: "country",
          title: "Country",
          options: country,
        },
      ]}
      searchPlaceholder="Search Leads..."
      visibleColumn={[
        { id: "id", value: false },
        { id: "ip", value: false },
        { id: "region", value: false },
      ]}
      messages={{
        filteredDataNotFoundMessage: { title: "No Leads Found!", description: "" },
        emptyDataMessage: { title: "No Leads Found!", description: "" },
      }}
      DownloadRowAction={DownloadLeadsBtn}
      DeleteRowsAction={DeleteLead}
    />
  );
};

export default AdminAllLeadsTableShell;

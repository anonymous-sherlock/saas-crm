"use client";
import { CustomBadge } from "@/components/CustomBadge";
import { LEADS_STATUS } from "@/constants/index";
import { cn, catchError } from "@/lib/utils";
import { Option } from "@/types";
import { Checkbox } from "@/ui/checkbox";
import { Tooltip } from "@nextui-org/react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import React, { FC } from "react";
import { toast } from "sonner";
import { DataTable } from "../global/data-table";
import { DataTableColumnHeader } from "../global/data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { DownloadLeadsBtn } from "./download-leads-button";
import { LeadColumnDef } from "./schema";
import { deleteLeads } from "@/lib/actions/lead.action";
import { allowedAdminRoles } from "@/lib/auth.permission";
import { useSession } from "next-auth/react";

interface LeadsTableShellProps {
  data: LeadColumnDef[];
  userId: string;
}

const LeadsTableShell: FC<LeadsTableShellProps> = ({ data, userId }) => {
  const { data: session, status } = useSession();
  const isAdmin = allowedAdminRoles.some((role) => role === session?.user.role);
  const [selectedRowIds, setSelectedRowIds] = React.useState<string[]>([]);
  const LeadsColumnDef = React.useMemo<ColumnDef<LeadColumnDef, unknown>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => {
              table.toggleAllPageRowsSelected(!!value);
              setSelectedRowIds((prev) => (prev.length === data.length ? [] : data.map((row) => row.id)));
            }}
            aria-label="Select all"
            className="translate-y-[2px]"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => {
              row.toggleSelected(!!value);
              setSelectedRowIds((prev) => (value ? [...prev, row.original.id] : prev.filter((id) => id !== row.original.id)));
            }}
            aria-label="Select row"
            className="translate-y-[2px]"
          />
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
        id: "campaign.code",
        accessorFn: (row) => row.campaign.code,
        filterFn: (row, id, value) => {
          return row.original.campaign.code.includes(value);
        },
        enableSorting: false,
        enableHiding: false,
      },
      {
        id: "campaign",
        accessorFn: (row) => row.campaign.name,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Campaign" />,
        cell: ({ row }) => (
          <div className="w-[150px] truncate cursor-default">
            <Tooltip
              delay={200}
              content={
                <div className="px-4 py-4">
                  <div className="text-small font-semibold">
                    Campaign Name : <span className="font-normal">{row.original.name}</span>
                  </div>
                  <div className="text-small font-semibold">
                    Campaign Code : <span className="font-normal">{row.original.campaign.code}</span>
                  </div>
                </div>
              }
            >
              <div className="truncate text-xs">
                <span className="text-muted-foreground">#</span>
                {row.original.campaign.code} - {row.original.campaign.name}
              </div>
            </Tooltip>
          </div>
        ),
        enableSorting: false,
        enableGlobalFilter: true,
        enableColumnFilter: true,
        filterFn: (row, id, value) => {
          return row.original.campaign.name.includes(value) || row.original.campaign.code.includes(value);
        },
      },
      {
        accessorKey: "name",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
        cell: ({ row }) => {
          const cell = row.original;

          return (
            <div className="flex max-w-[220px] space-x-2 ">
              {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
              <span className="w-full truncate ">{row.getValue("name")} </span>
            </div>
          );
        },
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
        id: "ip",
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
        id: "Created At",
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
    [data],
  );

  function deleteSelectedRows() {
    toast.promise(deleteLeads({ leadIds: selectedRowIds, userId: userId }), {
      loading: "Deleting...",
      success: () => {
        setSelectedRowIds([]);
        return "Leads deleted successfully.";
      },
      error: (err: unknown) => {
        setSelectedRowIds([]);
        return catchError(err);
      },
    });
  }

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
        { id: "campaign.code", value: false },
        { id: "id", value: false },
        { id: "ip", value: false },
        { id: "region", value: false },
        { id: "country", value: false },
      ]}
      messages={{
        filteredDataNotFoundMessage: { title: "No Leads Found!", description: "" },
        emptyDataMessage: { title: "No Leads Found!", description: "" },
        deleteRowMessage: {
          title: "Are you absolutely sure?",
          description: "This action cannot be undone. This will permanently delete your Leads and remove your data from our servers.",
        },
      }}
      DownloadRowAction={DownloadLeadsBtn}
      deleteRowsAction={isAdmin ? deleteSelectedRows : undefined}
    />
  );
};

export default LeadsTableShell;

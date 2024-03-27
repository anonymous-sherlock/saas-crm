"use client";
import { CustomBadge } from "@/components/CustomBadge";
import { Icons } from "@/components/Icons";
import { LEADS_STATUS } from "@/constants/index";
import { catchError, cn } from "@/lib/utils";
import { Option } from "@/types";
import { Checkbox } from "@/ui/checkbox";
import { Avatar, Tooltip, User } from "@nextui-org/react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import React, { FC } from "react";
import { toast } from "sonner";
import { DataTable } from "../global/data-table";
import { DataTableColumnHeader } from "../global/data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { DownloadLeadsBtn } from "./download-leads-button";
import { AdminLeadColumnDef } from "./schema";
import { deleteLeads } from "@/lib/actions/lead.action";

interface AdminAllLeadsTableShellProps {
  data: AdminLeadColumnDef[];
  userId: string;
}

export const AdminAllLeadsTableShell: FC<AdminAllLeadsTableShellProps> = ({ data, userId }) => {
  const [isPending, startTransition] = React.useTransition();
  const [selectedRowIds, setSelectedRowIds] = React.useState<string[]>([]);
  const LeadsColumnDef = React.useMemo<ColumnDef<AdminLeadColumnDef>[]>(
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
        id: "user.email",
        accessorFn: (row) => row.user?.email,
        enableSorting: false,
        enableHiding: false,
        filterFn: (row, id, value) => {
          return !!row.original.user?.email && row.original.user.email.includes(value);
        },
      },
      {
        id: "code",
        accessorFn: (row) => row.campaign.code,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Campaign" />,
        cell: ({ row }) => (
          <div className="w-[75px] truncate cursor-default">
            <Tooltip
              showArrow
              shadow="md"
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
        id: "User",
        accessorFn: (row) => row.user?.email,
        header: ({ column }) => <DataTableColumnHeader column={column} title="User" />,
        cell: ({ row }) => (
          <div>
            <Tooltip
              delay={500}
              showArrow
              shadow="md"
              content={
                <div className="px-2 py-3">
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
              }
            >
              <Avatar isBordered radius="lg" size="sm" src={row.original.user?.image ?? ""} className="shrink-0" fallback={<Icons.user className="h-4 w-4 text-zinc-900" />} />
            </Tooltip>
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
  const userEmail = React.useMemo(() => {
    const emails = data.map((lead) => lead?.user?.email).filter((email) => email !== null);
    const emailInTable = new Set(emails);
    const options: Option[] = Array.from(emailInTable).map((mail) => {
      if (!mail) {
        return {
          label: "No User",
          value: "",
        };
      }
      return {
        label: mail,
        value: mail,
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
        {
          id: "user.email",
          title: "User",
          options: userEmail,
        },
      ]}
      searchPlaceholder="Search Leads..."
      visibleColumn={[
        { id: "id", value: false },
        { id: "user.email", value: false },
        { id: "ip", value: false },
        { id: "region", value: false },
        { id: "campaign.name", value: false },
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
      deleteRowsAction={deleteSelectedRows}
    />
  );
};


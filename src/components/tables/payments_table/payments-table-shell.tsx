"use client";
import { CustomBadge } from "@/components/CustomBadge";
import { Checkbox } from "@/components/ui/checkbox";
import { PAYMENT_STATUS } from "@/constants/index";
import { allowedAdminRoles } from "@/lib/auth.permission";
import { cn, formatPrice, toSentenceCase } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import React, { FC } from "react";
import { DataTable } from "../global/data-table";
import { DataTableColumnHeader } from "../global/data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { PaymentsColumnDef } from "./schema";
import { Payment_Type } from "@prisma/client";
import { Option } from "@/types";
import { IoMdArrowDropup } from "react-icons/io";

interface ProductTableShellProps {
  data: PaymentsColumnDef[];
  userId: string;
}

export const PaymentsTableShell: FC<ProductTableShellProps> = ({ data, userId }) => {
  const { data: session } = useSession();
  const isAdmin = allowedAdminRoles.some((role) => role === session?.user.role);
  const [selectedRowIds, setSelectedRowIds] = React.useState<string[]>([]);
  const LeadsColumnDef = React.useMemo<ColumnDef<PaymentsColumnDef>[]>(
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
        header: ({ column }) => <DataTableColumnHeader column={column} title="Id" />,
        cell: ({ row }) => <div className="w-[75px] truncate">{row.original.id}</div>,
        enableSorting: false,
        enableHiding: false,
      },
      {
        
        accessorKey: "txid",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Transaction Id" />,
        cell: ({ row }) => <div className="w-[120px] truncate">{row.original.txid}</div>,
        enableSorting: false,
      },
      {
        accessorKey: "amount",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Amount" />,
        cell: ({ row }) => {
          return (
            <div className="flex space-x-2 max-w-[220px] ">
              <span className="w-full truncate font-medium ">{formatPrice(row.original.amount)}</span>
            </div>
          );
        },
      },

      {
        accessorKey: "type",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
        cell: ({
          row: {
            original: { type },
          },
        }) => {
          const arrowColor = type === "CREDIT" ? "text-green-600" : "text-red-600";

          return (
            <div className="flex space-x-2 max-w-[220px] ">
              <span className={cn("w-full truncate font-medium flex gap-1  items-center", arrowColor)}>
                <span>{type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}</span>
                <IoMdArrowDropup size={20} className={type === "DEBIT" ? "rotate-180" : ""} />
              </span>
            </div>
          );
        },
        enableSorting: false,
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
      },
      {
        accessorKey: "status",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Payment Status" />,
        cell: ({ row }) => {
          return <CustomBadge badgeValue={row.original.status} status={PAYMENT_STATUS} />;
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
        enableSorting: false,
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Payment made on" />,
        cell: ({ row }) => <div className="truncate">{format(row.original.createdAt, "dd MMM, yyyy - hh:mmaaa")}</div>,
        enableSorting: false,
      },
      {
        id: "actions",
        cell: ({ row }) => <DataTableRowActions row={row} />,
      },
    ],
    [data],
  );
  const Type: Option[] = React.useMemo(() => {
    return Object.values(Payment_Type).map((type) => ({
      label: type.charAt(0).toUpperCase() + type.slice(1).toLowerCase(),
      value: type,
    }));
  }, []);

  return (
    <DataTable
      data={data ?? []}
      columns={LeadsColumnDef}
      filterableColumns={[
        {
          id: "status",
          title: "Status",
          options: PAYMENT_STATUS,
        },
        {
          id: "type",
          title: "Payment Type",
          options: Type,
        },
      ]}
      visibleColumn={[
        {
          id: "id",
          value: false,
        },
      ]}
      searchPlaceholder="Search payments..."
      messages={{
        filteredDataNotFoundMessage: {
          title: "No Payments Found",
          description: "",
        },
        emptyDataMessage: {
          title: "No Payments Found",
          description: "",
        },
      }}
    />
  );
};

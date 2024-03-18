"use client";
import { DataTableFilterableColumn, DataTableSearchableColumn, DataTableVisibleColumn } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/ui/table";
import { ColumnDef, ColumnFiltersState, SortingState, VisibilityState, flexRender, getCoreRowModel, getFacetedRowModel, getFacetedUniqueValues, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, } from "@tanstack/react-table";
import * as React from "react";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";

const DEFAULT_REACT_TABLE_COLUMN_WIDTH = 150;
interface EmptyMessageProps {
  title: string;
  description: string;
}
type ColumnKeys<T> = keyof T;
type ColumnVisibilityState<T> = Partial<{ [K in ColumnKeys<T>]: boolean; }>;

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterableColumns?: DataTableFilterableColumn<TData>[]
  searchableColumns?: DataTableSearchableColumn<TData>[]
  searchPlaceholder?: string
  deleteRowsComponent?: React.ReactNode
  messages: {
    emptyDataMessage?: EmptyMessageProps;
    filteredDataNotFoundMessage?: EmptyMessageProps
  }
  visibleColumn?: ColumnVisibilityState<TData>
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterableColumns = [],
  searchableColumns = [],
  searchPlaceholder,
  deleteRowsComponent,
  messages: {
    emptyDataMessage = {
      title: "No results found.",
      description: ""
    },
    filteredDataNotFoundMessage = {
      title: "No results found.",
      description: "Clear some filter"
    },
  },
  visibleColumn
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(visibleColumn as VisibilityState);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const table = useReactTable({
    data: data || [],
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      globalFilter,
    },
    enableRowSelection: true,
    enableGlobalFilter: true,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });
  return (
    <div className="space-y-4">
      <DataTableToolbar table={table}
        filterableColumns={filterableColumns}
        searchableColumns={searchableColumns}
        searchPlaceholder={searchPlaceholder}
      />
      <div className="rounded-md border overflow-x-auto w-full">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const header_size_styles: React.CSSProperties = header.getSize() !== DEFAULT_REACT_TABLE_COLUMN_WIDTH ? { width: `${header.getSize()}px` } : {}
                  return (
                    <TableHead key={header.id} style={header_size_styles}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="p-2 px-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center bg-[#F9F9FA]">
                  {data.length === 0 ?
                    <EmptyMessage title={emptyDataMessage.title} description={emptyDataMessage.description} />
                    :
                    <EmptyMessage title={filteredDataNotFoundMessage.title} description={filteredDataNotFoundMessage.description} />
                  }
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} deleteComponent={deleteRowsComponent} />
    </div>
  );
}

const EmptyMessage: React.FC<EmptyMessageProps> = ({ title, description }) => (
  <div className="flex h-full w-full flex-col items-center justify-center py-40 text-center">
    <h1 className="text-lg font-medium sm:text-xl">{title}</h1>
    <p className="text-xs text-muted-foreground sm:text-sm">{description}</p>
  </div>
);
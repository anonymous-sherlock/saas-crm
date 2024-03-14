"use client";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { trpc } from "@/app/_trpc/client";
import { CalendarDateRangePicker } from "@/components/global/date-range-picker";
import TooltipComponent from "@/components/global/tooltip-component";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { RefreshCw } from "lucide-react";
import { useState } from "react";

import { DeleteProduct } from "./delete-product";
import { DataTableViewOptions } from "../global/data-table-view-options";
import { useRouter } from "next/navigation";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const [isRotating, setRotating] = useState(false);
  const utils = trpc.useUtils()
  const router = useRouter()

  const handleRefreshClick = () => {
    setRotating(true);
    setTimeout(() => {
      utils.product.getAll.invalidate()
      router.refresh()
      setRotating(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col md:flex-row gap-2 md:items-center justify-between">
      <div className="flex md:flex-row flex-wrap flex-1 md:items-center justify-start  md:space-x-2
      gap-2">
        <Input
          placeholder="Search Products..."
          value={table.getState().globalFilter}
          onChange={e => table.setGlobalFilter(String(e.target.value))}
          className="md:h-8 h-9 grow md:grow-0 w-[150px] lg:w-[250px]"
        />
        <TooltipComponent message="Refetch Data" delayDuration={250} >
          <Button variant="outline" size="sm" className="h-8 w-8 p-2 border-dashed" onClick={handleRefreshClick} >
            <RefreshCw color="#000" className={cn("",
              isRotating ? 'animate-spin' : '',
            )} /></Button>
        </TooltipComponent>
        {/* {table.getColumn("category") && (
          <DataTableFacetedFilter
            column={table.getColumn("category")}
            title="Category"
            options={statuses}
          />
        )} */}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DeleteProduct table={table} />
      <CalendarDateRangePicker />
      <DataTableViewOptions table={table} />
    </div>
  );
}
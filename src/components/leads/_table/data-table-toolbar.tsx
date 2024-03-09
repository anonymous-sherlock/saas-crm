"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";

import { trpc } from "@/app/_trpc/client";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { RefreshCw } from "lucide-react";

import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DeleteLead } from "./delete-lead";
import { LEADS_STATUS } from "@/constants/index";
import { useState } from "react";
import TooltipComponent from "@/components/global/tooltip-component";
import { cn } from "@/lib/utils";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const [isRotating, setRotating] = useState(false);
  const utils = trpc.useUtils()

  const handleRefreshClick = () => {
    setRotating(true);
    setTimeout(() => {
      utils.lead.getAll.invalidate()
      setRotating(false);
    }, 1000); // Adjust the duration as needed
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter Leads..."
          value={table.getState().globalFilter}
          onChange={e => table.setGlobalFilter(String(e.target.value))}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        <TooltipComponent message="Refetch Data" delayDuration={250}>
          <Button variant="outline" size="sm" className="h-8 w-8 p-2 border-dashed" onClick={handleRefreshClick} >
            <RefreshCw color="#000" className={cn("",
              isRotating ? 'animate-spin' : '',
            )} /></Button>
        </TooltipComponent>
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={LEADS_STATUS}
          />
        )}

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
      <DeleteLead table={table} />
      <DataTableViewOptions table={table} />
    </div >
  );
}
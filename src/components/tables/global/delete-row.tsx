"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import React from "react";
import { ProductColumnDef } from "../products_table/schema";

interface DeleteProductProps<TData> {
  children?: React.ReactNode;
  table: Table<TData>;
  onDelete: () => void
  isDeleting: boolean
}

export function DeleteProduct<TData>({
  children,
  table,
  onDelete,
  isDeleting

}: DeleteProductProps<TData>) {


  function handleCampaignDelete() {
    const rows = table?.getFilteredSelectedRowModel().rows;
    const payload = rows.map((row) => {
      const rowOriginal = row.original as ProductColumnDef;
      return rowOriginal.id;
    });


  }
  return (
    <>
      {table?.getFilteredSelectedRowModel().rows.length > 0 && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            {children ? (
              children
            ) : (
              <Button
                variant="destructive"
                size="sm"
                className="h-8 px-2 lg:px-3 mr-2 border border-destructive-foreground/50"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
                <Cross2Icon className="ml-2 h-4 w-4" />
              </Button>
            )}
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                Products and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleCampaignDelete}
                disabled={isDeleting}
                className={buttonVariants({ variant: "destructive" })}
              >
                {isDeleting ? "Deleting..." : "Delete Products"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
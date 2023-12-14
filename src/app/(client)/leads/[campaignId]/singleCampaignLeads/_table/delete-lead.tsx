"use client";
import { trpc } from "@/app/_trpc/client";
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
import { toast as hotToast } from "react-hot-toast";
import { Lead } from "./columns";

interface DeleteLeadProps<TData> {
  table: Table<TData>;
}

export function DeleteLead<TData>({ table }: DeleteLeadProps<TData>) {

  const utils = trpc.useUtils();

  const { mutateAsync: deleteLead, isLoading } = trpc.lead.deleteLead.useMutation({
    onSuccess: () => {
      utils.lead.getCampaignLeads.invalidate()
      table.toggleAllPageRowsSelected(false)
    },

  })

  function handleLeadsDelete() {
    const rows = table.getFilteredSelectedRowModel().rows;
    const payload = rows.map((row) => {
      const rowOriginal = row.original as Lead;
      return rowOriginal.id;
    });
    hotToast.promise(
      deleteLead({ leadIds: payload }),
      {
        loading: 'Deleting leads...',
        success: (data) => `${data.deletedCount} ${data.deletedCount === 1 ? "Lead" : "Leads"} deleted successfully!`,
        error: "Could not delete Leads.",
      }
    );
  }
  return (
    <>
      {table.getFilteredSelectedRowModel().rows.length > 0 && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="sm"
              className="h-8 px-2 lg:px-3 mr-2"
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete"}
              <Cross2Icon className="ml-2 h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                Leads and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleLeadsDelete}
                disabled={isLoading}
                className={buttonVariants({ variant: "destructive" })}
              >
                {isLoading ? "Deleting..." : "Delete Lead"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
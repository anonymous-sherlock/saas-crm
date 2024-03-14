"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";

import { Button, buttonVariants } from "@/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";

import { trpc } from "@/app/_trpc/client";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import Spinner from "@/components/ui/spinner";
import { LeadStatus } from "@prisma/client";
import { useState } from "react";
import { toast as hotToast } from "react-hot-toast";

import { LEADS_STATUS } from "@/constants/index";
import { LeadSchema } from "./schema";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {

  const utils = trpc.useUtils();

  const lead = LeadSchema.parse(row.original);
  const [leadStatus, setLeadStatus] = useState<LeadStatus>(
    lead.status
  );
  const { mutateAsync: updateStatus, isLoading: isUpdatingStatus } =
    trpc.lead.updateStatus.useMutation({
      onSuccess: (data) => {
        setLeadStatus(data.updatedLead.status)
        utils.lead.getCampaignLeads.invalidate();
      },
    });
  const { mutateAsync: deleteLead, isLoading: isDeletingLead } = trpc.lead.deleteLead.useMutation({
    onSuccess: (data) => {
      utils.lead.getCampaignLeads.invalidate();
    },

  });


  function handleStatusChange(status: LeadStatus) {
    hotToast.promise(
      updateStatus({ leadId: lead.id, leadStatus: status, }),
      {
        loading: 'Updating lead status...',
        success: "Lead status updated successfully!",
        error: "Could not update lead status.",
      }
    );
  }

  function handleDeleteLead() {
    hotToast.promise(
      deleteLead({ leadIds: [lead.id] }),
      {
        loading: 'Deleting lead...',
        success: "Lead deleted successfully!",
        error: "Could not delete lead.",
      }
    );

  }


  return (
    <>
      {isUpdatingStatus || isDeletingLead ? (
        <div className="flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
              >
                <DotsHorizontalIcon className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(lead.id.toString());
                  hotToast.success('Successfully Copied lead ID!')

                }}
              >Copy Lead ID</DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={leadStatus}
                    onValueChange={(e) => handleStatusChange(e as LeadStatus)}
                  >
                    {LEADS_STATUS.map((status) => (
                      <DropdownMenuRadioItem
                        key={status.value}
                        value={status.value}
                        className=""
                      >
                        {status.icon && (
                          <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                        )}
                        {status.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="text-red-600" disabled={isDeletingLead}>
                  Delete
                  <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          {/*Delete Dialog Content */}
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this
                lead from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteLead}
                disabled={isDeletingLead}
                className={buttonVariants({ variant: "destructive" })}
              >
                {isDeletingLead ? "Deleting..." : "Delete Lead"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
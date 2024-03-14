"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";

import { Button } from "@/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from "@/ui/dropdown-menu";

import { trpc } from "@/app/_trpc/client";
import Spinner from "@/components/ui/spinner";
import { LeadStatus } from "@prisma/client";
import { useState } from "react";
import { toast as hotToast } from "react-hot-toast";

import { Icons } from "@/components/Icons";
import { Separator } from "@/components/ui/separator";
import { LEADS_STATUS } from "@/constants/index";
import { cn } from "@/lib/utils";
import { Listbox, ListboxItem, ListboxSection } from "@nextui-org/react";
import { pages } from "@routes";
import { DeleteLeadAlert } from "./delete-lead-alert";
import { LeadSchema } from "./schema";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const utils = trpc.useUtils();
  const { data: session, status } = useSession()
  const isAdmin = session?.user?.role === 'ADMIN';
  const router = useRouter()
  const lead = LeadSchema.parse(row.original);
  const [leadStatus, setLeadStatus] = useState<LeadStatus>(lead.status);
  const { mutateAsync: updateStatus, isLoading: isUpdatingStatus } =
    trpc.lead.updateStatus.useMutation({
      onSuccess: (data) => {
        setLeadStatus(data.updatedLead.status)
        utils.lead.getAll.invalidate();
      },
    });
  const { mutateAsync: deleteLead, isLoading: isDeletingLead } = trpc.lead.deleteLead.useMutation({
    onSuccess: (data) => {
      utils.lead.getAll.invalidate();
    },

  });


  function handleStatusChange(status: LeadStatus) {
    hotToast.promise(
      updateStatus({ leadId: lead.id, leadStatus: status, }).then((res) => router.refresh()),
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

  const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";

  return (
    <>
      {isUpdatingStatus || isDeletingLead ? (
        <div className="flex items-center justify-center">
          <Spinner />
        </div>
      ) : (

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
          <DropdownMenuContent align="end">
            <Listbox variant="faded" aria-label="lead quick actions menu">
              <ListboxSection title="Quick actions" aria-label='Quick actions'>
                <ListboxItem key="edit" startContent={<Icons.EditIcon className={iconClasses} />} href={`${pages.leads}/${lead.id}/edit`} >
                  Edit Lead
                </ListboxItem>
                <ListboxItem key="copy-lead-id" aria-label='Copy lead id' startContent={<Icons.CopyIcon className={iconClasses} />}
                  onClick={() => {
                    navigator.clipboard.writeText(lead.id.toString());
                    hotToast.success('Successfully Copied Lead id')
                  }}
                >
                  Copy Lead Id
                </ListboxItem>
              </ListboxSection>
            </Listbox>
            <Separator className='my-1' />
            {isAdmin ?
              <>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className={cn("aria-selected:bg-transparent focus:bg-transparent p-1", "!bg-transparent")}>
                    <Listbox variant='faded' aria-label="Lead status dropdown menu">
                      <ListboxItem key="status" aria-label='Lead status' startContent={<Icons.PlayCircleIcon className={iconClasses} />} >
                        Lead status
                      </ListboxItem>
                    </Listbox>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup
                      value={leadStatus}
                      onValueChange={(e) => handleStatusChange(e as LeadStatus)}
                    >
                      {LEADS_STATUS.map((status) => (
                        <DropdownMenuRadioItem
                          key={status.value}
                          value={status.value}
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
                <Separator className='my-1' />
              </>
              : null}
            <DeleteLeadAlert
              onDelete={handleDeleteLead}
              isDeleting={isDeletingLead}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
}
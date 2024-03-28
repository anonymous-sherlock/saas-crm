"use client";

import { trpc } from "@/app/_trpc/client";
import { Icons } from "@/components/Icons";
import { CustomDeleteAlertDailog } from "@/components/global/custom-delete-alert-dailog";
import { CustomModal } from "@/components/global/custom-modal";
import { UpdateLeadForm } from "@/components/leads/update-leads-form";
import { Separator } from "@/components/ui/separator";
import { LEADS_STATUS } from "@/constants/index";
import { deleteLeads } from "@/lib/actions/lead.action";
import { allowedAdminRoles } from "@/lib/auth.permission";
import { cn } from "@/lib/utils";
import { useModal } from "@/providers/modal-provider";
import { Button } from "@/ui/button";
import { Listbox, ListboxItem, ListboxSection, Popover, PopoverContent, PopoverTrigger, Spinner, type Selection } from "@nextui-org/react";
import { LeadStatus } from "@prisma/client";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { ChevronRightIcon, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast as hotToast } from "react-hot-toast";
import { DataLeadSchema } from "./schema";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
  const router = useRouter();
  const { setOpen: setModalOpen } = useModal();
  const [statusOpen, setStatusOpen] = useState<boolean>(false);
  const { data: session, status } = useSession();
  const isAdmin = allowedAdminRoles.some((role) => role === session?.user.role);
  const lead = DataLeadSchema.parse(row.original);
  const [leadStatus, setLeadStatus] = useState<LeadStatus>(lead.status);
  const [isDeletingLead, startDeleteTransition] = useTransition();

  const { mutateAsync: updateStatus, isLoading: isUpdatingStatus } = trpc.lead.updateStatus.useMutation({
    onSuccess: (data) => {
      setLeadStatus(data.updatedLead.status);
      router.refresh();
    },
  });

  function handleStatusChange(status: Selection) {
    const newStatus = Array.from(status)[0] as LeadStatus;
    setStatusOpen(!statusOpen);
    hotToast.promise(
      updateStatus({ leadId: lead.id, leadStatus: newStatus }).then((res) => router.refresh()),
      {
        loading: "Updating lead status...",
        success: "Lead status updated successfully!",
        error: "Could not update lead status.",
      },
    );
  }

  function handleDeleteLead() {
    startDeleteTransition(() => {
      hotToast.promise(
        deleteLeads({ leadIds: [lead.id], userId: lead.userId }).then((data) => {
          if (data.success) {
            router.refresh();
          }
        }),
        {
          loading: "Deleting lead...",
          success: "Lead deleted successfully!",
          error: "Could not delete lead.",
        },
      );
    });
  }

  const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";

  return (
    <>
      {isUpdatingStatus || isDeletingLead ? (
        <div className="flex items-center justify-center">
          <Spinner size="sm" color={isDeletingLead ? "danger" : "primary"} />
        </div>
      ) : (
        <Popover placement="left-start" style={{ zIndex: 200 }}>
          <PopoverTrigger>
            <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
              <DotsHorizontalIcon className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <Listbox variant="faded" aria-label="lead quick actions menu">
              <ListboxSection title="Quick actions" aria-label="Quick actions">
                <ListboxItem
                  key="edit"
                  startContent={<Icons.EditIcon className={iconClasses} />}
                  onClick={() => {
                    setModalOpen(
                      <CustomModal size="5xl" title="Update Lead Details ">
                        <UpdateLeadForm leadId={lead.id} />
                      </CustomModal>,
                    );
                  }}
                >
                  Edit Lead
                </ListboxItem>
                <ListboxItem
                  key="copy-lead-id"
                  aria-label="Copy lead id"
                  startContent={<Icons.CopyIcon className={iconClasses} />}
                  onClick={() => {
                    navigator.clipboard.writeText(lead.id.toString());
                    hotToast.success("Successfully Copied Lead id");
                  }}
                >
                  Copy Lead Id
                </ListboxItem>
              </ListboxSection>
            </Listbox>
            {isAdmin ? (
              <>
                <Separator className="my-1" />
                <Popover isOpen={statusOpen} onOpenChange={() => setStatusOpen(false)} placement="left-start">
                  <PopoverTrigger className="aria-expanded:scale-[1]">
                    <Listbox variant="faded" aria-label="lead status dropdown menu">
                      <ListboxItem
                        key="status"
                        aria-label="lead status"
                        startContent={<Icons.PlayCircleIcon className={iconClasses} />}
                        endContent={<ChevronRightIcon className={cn(iconClasses, "size-4")} />}
                        onClick={() => setStatusOpen(!statusOpen)}
                      >
                        Lead status
                      </ListboxItem>
                    </Listbox>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Listbox
                      aria-label="lead selection"
                      variant="flat"
                      disallowEmptySelection
                      selectionMode="single"
                      selectedKeys={[leadStatus]}
                      onSelectionChange={(key) => handleStatusChange(key)}
                    >
                      {LEADS_STATUS.map((status) => (
                        <ListboxItem key={status.value} value={status.value} textValue={status.value} className={cn("", leadStatus === status.value && "bg-default-200")}>
                          <div className="flex gap-2 justify-start items-center">
                            {status.icon && <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
                            <span>{status.label}</span>
                          </div>
                        </ListboxItem>
                      ))}
                    </Listbox>
                  </PopoverContent>
                </Popover>
                <Separator className="my-1" />
                <Listbox variant="faded" aria-label="Leads Danger zone menu">
                  <ListboxSection title="Danger zone" aria-label="Danger zone">
                    <ListboxItem
                      key="delete"
                      className="text-danger"
                      color="danger"
                      aria-label="Permanently delete Lead"
                      description="Permanently delete Lead"
                      onClick={() => {
                        setModalOpen(
                          <CustomDeleteAlertDailog
                            title="Are you absolutely sure?"
                            description="This action cannot be undone. This will permanently delete this
                        lead from our servers."
                            isDeleting={isDeletingLead}
                            onDelete={handleDeleteLead}
                            actionText="Delete User"
                          />,
                        );
                      }}
                      startContent={isDeletingLead ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icons.DeleteIcon className={cn(iconClasses, "text-danger")} />}
                    >
                      Delete
                    </ListboxItem>
                  </ListboxSection>
                </Listbox>
              </>
            ) : null}
          </PopoverContent>
        </Popover>
      )}
    </>
  );
}

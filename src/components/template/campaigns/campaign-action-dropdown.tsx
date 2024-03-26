"use client"
import { trpc } from "@/app/_trpc/client";
import { Icons } from "@/components/Icons";
import { CustomDeleteAlertDailog } from "@/components/global/custom-delete-alert-dailog";
import { CustomModal } from "@/components/global/custom-modal";
import { Separator } from "@/components/ui/separator";
import { CAMPAIGN_STATUS } from "@/constants/index";
import { deleteCampaigns } from "@/lib/actions/campaign.action";
import { cn } from "@/lib/utils";
import { useModal } from "@/providers/modal-provider";
import { Button } from "@/ui/button";
import { Listbox, ListboxItem, ListboxSection, Popover, PopoverContent, PopoverTrigger, Spinner, type Selection } from "@nextui-org/react";
import { CampaignStatus } from "@prisma/client";
import { pages } from "@routes";
import { ChevronRightIcon, Loader2, MoreVertical } from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import { toast as hotToast } from "react-hot-toast";
import { UpdateCampaignForm } from "./update-campaign-form";

interface CampaignActionDropDownProps {
  campaign: {
    id: string;
    name: string;
    code: string;
    status: CampaignStatus;
    userId: string;
  };
  children?: React.ReactNode;
  type?: "custom" | "default";
}

export const CampaignActionDropDown = ({ campaign, children, type = "default" }: CampaignActionDropDownProps) => {
  const { data: session } = useSession();
  const { setOpen: setModalOpen } = useModal();
  const [selectedStatus, setSelectedStatus] = React.useState<CampaignStatus>(campaign.status);
  const [statusOpen, setStatusOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const isAdmin = session?.user?.role === "ADMIN";
  const viewLeadsRoute = pathname.startsWith(pages.admin) ? `${pages.admin}/users/${campaign.userId}/${campaign.id}/leads` : `${pages.campaign}/${campaign.id}/leads`;
  const router = useRouter();
  const utils = trpc.useUtils();
  const [isDeletingCampaign, startDeleteTransition] = useTransition();
  const { mutateAsync: copyCampaign, isLoading: isCopyingCampaign } = trpc.campaign.copyCampaign.useMutation({
    onSuccess: () => {
      utils.campaign.getAll.invalidate();
      router.refresh();
    },
  });

  const { mutateAsync: updateStatus, isLoading: isUpdatingStatus } = trpc.campaign.updateStatus.useMutation({
    onSuccess: (data) => {
      setSelectedStatus(data.updatedCampaign.status);
      utils.campaign.getAll.invalidate();
      router.refresh();
    },
  });

  function handleCopyCampaign() {
    hotToast.promise(
      copyCampaign({
        campaignId: campaign.id,
      }),
      {
        loading: "Copying...",
        success: "Campaign Copied successfully!",
        error: "Could not make a copy of this campaign.",
      },
    );
  }
  function handleStatusChange(status: Selection) {
    const newStatus = Array.from(status)[0] as CampaignStatus;
    setStatusOpen(!statusOpen);
    if (status !== "all") {
      hotToast.promise(
        updateStatus({
          campaignId: campaign.id,
          campaignStatus: newStatus,
        }),
        {
          loading: "Updating status...",
          success: "Campaign status updated!",
          error: "Could not updated campaign status.",
        },
      );
    }
  }
  function handleCampaignDelete() {
    startDeleteTransition(() => {
      hotToast.promise(
        deleteCampaigns({ campaignIds: [campaign.id], userId: campaign.userId }).then((data) => {
          if (data.success) {
            router.refresh();
          }
        }),
        {
          loading: "Deleting campaign...",
          success: "Campaign deleted successfully!",
          error: "Could not delete campaign.",
        },
      );
    });
  }

  const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";
  return (
    <Popover placement="left-start" style={{ zIndex: 200 }}>
      <PopoverTrigger>
        {type === "custom" ? (
          isCopyingCampaign || isUpdatingStatus || isDeletingCampaign ? (
            <Button
              variant="secondary"
              disabled={isCopyingCampaign || isUpdatingStatus || isDeletingCampaign}
              className="flex justify-center items-center h-8 w-8 p-0 data-[state=open]:bg-muted border-2 rounded-full justify-self-end"
            >
              <Spinner size="sm" />
              <span className="sr-only">Open menu</span>
            </Button>
          ) : (
            children
          )
        ) : (
          <Button
            size="icon"
            variant="secondary"
            disabled={isCopyingCampaign || isUpdatingStatus}
            className={cn(
              "rounded-full border-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-slate-400 disabled:pointer-events-none dark:focus:ring-offset-slate-900 border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground h-10 p-2",
            )}
          >
            {isCopyingCampaign || isUpdatingStatus ? <Spinner /> : <MoreVertical />}
            <span className="sr-only">Open menu</span>
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent>
        <Listbox variant="faded" aria-label="Campaign action menu">
          <ListboxSection title="Actions" aria-label="Actions">
            <ListboxItem
              key="copy"
              aria-label="Make a campaign copy"
              description="Make a duplicate campaign"
              startContent={<Icons.CopyIcon className={iconClasses} />}
              onClick={handleCopyCampaign}
            >
              Make a campaign copy
            </ListboxItem>
          </ListboxSection>
        </Listbox>
        <Separator className="my-1" />
        <Listbox variant="faded" aria-label="Campaign quick actions menu">
          <ListboxSection title="Quick actions" aria-label="Quick actions">
            <ListboxItem key="view-leads" startContent={<Icons.ViewLeadsIcon className={iconClasses} />} href={viewLeadsRoute}>
              View Leads
            </ListboxItem>
            <ListboxItem
              key="edit"
              startContent={<Icons.EditIcon className={iconClasses} />}
              onClick={() => {
                setModalOpen(
                  <CustomModal size="5xl" title="Update Campaign Details ">
                    <UpdateCampaignForm campaignId={campaign.id} userId={campaign.userId} />
                  </CustomModal>,
                );
              }}
            >
              Edit campaign
            </ListboxItem>
            <ListboxItem
              key="copy-campaign"
              aria-label="Copy campaign code"
              startContent={<Icons.CopyIcon className={iconClasses} />}
              onClick={() => {
                navigator.clipboard.writeText(campaign.code.toString());
                hotToast.success("Successfully Copied Campaign Code");
              }}
            >
              Copy campaign code
            </ListboxItem>
          </ListboxSection>
        </Listbox>
        <Separator className="my-1" />
        {isAdmin ? (
          <>
            <Popover isOpen={statusOpen} onOpenChange={() => setStatusOpen(false)} placement="right-start">
              <PopoverTrigger className="aria-expanded:scale-[1]">
                <Listbox variant="faded" aria-label="campaign status dropdown menu">
                  <ListboxItem
                    key="status"
                    aria-label="campaign status"
                    startContent={<Icons.PlayCircleIcon className={iconClasses} />}
                    endContent={<ChevronRightIcon className={cn(iconClasses, "size-4")} />}
                    onClick={() => setStatusOpen(!statusOpen)}
                  >
                    Campaign status
                  </ListboxItem>
                </Listbox>
              </PopoverTrigger>
              <PopoverContent>
                <Listbox
                  aria-label="Single selection example"
                  variant="flat"
                  disallowEmptySelection
                  selectionMode="single"
                  selectedKeys={[selectedStatus]}
                  onSelectionChange={(key) => handleStatusChange(key)}
                >
                  {CAMPAIGN_STATUS.map((status) => (
                    <ListboxItem key={status.value} value={status.value} textValue={status.value} className={cn("", selectedStatus === status.value && "bg-default-200")}>
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
          </>
        ) : null}

        <Listbox variant="faded" aria-label="Campaign Danger zone menu">
          <ListboxSection title="Danger zone" aria-label="Danger zone">
            <ListboxItem
              key="delete"
              className="text-danger"
              color="danger"
              aria-label="Permanently delete campaign"
              description="Permanently delete campaign"
              onClick={() => {
                setModalOpen(
                  <CustomDeleteAlertDailog
                    title="Are you absolutely sure?"
                    description="This action cannot be undone. This will permanently delete your
                    Campaign and remove your data from our servers."
                    isDeleting={isDeletingCampaign}
                    onDelete={handleCampaignDelete}
                    actionText="Delete Campaign"
                  />,
                );
              }}
              startContent={isDeletingCampaign ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icons.DeleteIcon className={cn(iconClasses, "text-danger")} />}
            >
              Delete campaign
            </ListboxItem>
          </ListboxSection>
        </Listbox>
      </PopoverContent>
    </Popover>
  );
};

import { trpc } from '@/app/_trpc/client'
import { Icons } from '@/components/Icons'
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import Spinner from '@/components/ui/spinner'
import { CAMPAIGN_STATUS } from '@/constants/index'
import { cn } from '@/lib/utils'
import { Button } from '@/ui/button'
import { Listbox, ListboxItem, ListboxSection } from '@nextui-org/react'
import { CampaignStatus } from '@prisma/client'
import { pages } from '@routes'
import { AreaChart, MoreVertical } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast as hotToast } from "react-hot-toast"
import { DeleteCampaign } from './DeleteCampaign'

interface CampaignActionDropDownProps {
  campaign: {
    id: string
    name: string;
    code: string;
    status: CampaignStatus
  }
  children?: React.ReactNode
  type?: "custom" | "default"
}

export const CampaignActionDropDown = ({ campaign, children, type = "default" }: CampaignActionDropDownProps) => {
  const [campaignStatus, setCampaignStatus] = useState<CampaignStatus>(campaign.status);
  const [statusOpen, setStatusOpen] = useState<boolean>(false);
  const { data: session, status } = useSession()
  const utils = trpc.useUtils();
  const router = useRouter()
  const isAdmin = session?.user?.role === 'ADMIN';

  const { mutateAsync: copyCampaign, isLoading: isCopyingCampaign } = trpc.campaign.copyCampaign.useMutation({
    onSuccess: () => {
      utils.campaign.getAll.invalidate();
      router.refresh()
    }
  })

  const { mutateAsync: updateStatus, isLoading: isUpdatingStatus } = trpc.campaign.updateStatus.useMutation({
    onSuccess: (data) => {
      setCampaignStatus(data.updatedCampaign.status)
      utils.campaign.getAll.invalidate();
      router.refresh()
    },

  });
  const { mutateAsync: deleteCampaign, isLoading: isDeletingCampaign } = trpc.campaign.deleteCampaign.useMutation({
    onSuccess: (data) => {
      utils.campaign.getAll.invalidate()
      router.refresh()
    },
  })

  function handleCopyCampaign() {
    hotToast.promise(
      copyCampaign({
        campaignId: campaign.id,
      }),
      {
        loading: 'Copying...',
        success: "Campaign Copied successfully!",
        error: "Could not make a copy of this campaign.",
      }
    );
  }
  function handleStatusChange(status: CampaignStatus) {
    hotToast.promise(
      updateStatus({
        campaignId: campaign.id,
        campaignStatus: status,
      }),
      {
        loading: 'Updating status...',
        success: "Campaign status updated!",
        error: "Could not updated campaign status.",
      }
    );

  }
  function handleCampaignDelete() {
    hotToast.promise(
      deleteCampaign({ campaignIds: [campaign.id] }),
      {
        loading: 'Deleting campaign...',
        success: "Campaign deleted successfully!",
        error: "Could not delete campaign.",
      }
    );
  }

  const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";
  return (

    <DropdownMenu open={statusOpen} onOpenChange={setStatusOpen}>
      <DropdownMenuTrigger asChild>
        {type === "custom" ?
          isCopyingCampaign || isUpdatingStatus || isDeletingCampaign ?
            <Button variant="secondary" disabled={isCopyingCampaign || isUpdatingStatus || isDeletingCampaign} className="flex justify-center items-center h-8 w-8 p-0 data-[state=open]:bg-muted border-2 rounded-full justify-self-end"   >
              <Spinner className="h-4 w-4 text-muted-foreground !mx-auto" />
              <span className="sr-only">Open menu</span>
            </Button> : children
          :
          <Button size="icon" variant="secondary" disabled={isCopyingCampaign || isUpdatingStatus} className={cn("rounded-full border-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-slate-400 disabled:pointer-events-none dark:focus:ring-offset-slate-900 border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground h-10 p-2")}>
            {isCopyingCampaign || isUpdatingStatus ? <Spinner /> : <MoreVertical />}
            <span className="sr-only">Open menu</span>
          </Button>
        }
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <Listbox variant="faded" aria-label="Campaign action menu">
          <ListboxSection title="Actions" aria-label='Actions' >
            <ListboxItem key="new" aria-label='New campaign' description="Create a new campaign" startContent={<Icons.AddNoteIcon className={iconClasses} />} >
              New campaign
            </ListboxItem>
            <ListboxItem key="copy" aria-label='Make a campaign copy' description="Make a duplicate campaign" startContent={<Icons.CopyIcon className={iconClasses} />} onClick={handleCopyCampaign}>
              Make a campaign copy
            </ListboxItem>
          </ListboxSection>
        </Listbox>
        <Separator className='my-1' />
        <Listbox variant="faded" aria-label="Campaign quick actions menu">
          <ListboxSection title="Quick actions" aria-label='Quick actions'>
          <ListboxItem key="view-leads" startContent={<Icons.ViewLeadsIcon className={iconClasses} />} href={`${pages.campaign}/${campaign.id}/leads`} >
              View Leads
            </ListboxItem>
            <ListboxItem key="edit" startContent={<Icons.EditIcon className={iconClasses} />} href={`${pages.campaign}/${campaign.id}/edit`} >
              Edit campaign
            </ListboxItem>
            <ListboxItem key="copy-campaign" aria-label='Copy campaign code' startContent={<Icons.CopyIcon className={iconClasses} />}
              onClick={() => {
                navigator.clipboard.writeText(campaign.code.toString());
                hotToast.success('Successfully Copied Campaign Code')
              }}
            >
              Copy campaign code
            </ListboxItem>
          </ListboxSection>
        </Listbox>
        <Separator className='my-1' />
        {isAdmin ?
          <>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className={cn("aria-selected:bg-transparent focus:bg-transparent p-1", "!bg-transparent")}>
                <Listbox variant='faded' aria-label="campaign status dropdown menu">
                  <ListboxItem key="status" aria-label='campaign status' startContent={<Icons.PlayCircleIcon className={iconClasses} />} >
                    Campaign status
                  </ListboxItem>
                </Listbox>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup
                  value={campaignStatus}
                  onValueChange={(e) => handleStatusChange(e as CampaignStatus)}
                >
                  {CAMPAIGN_STATUS.map((status) => (
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
            <Separator className='my-1' />
          </>
          : null}
        <DeleteCampaign campaignId={campaign.id} onDelete={handleCampaignDelete} isDeleting={isDeletingCampaign} />
      </DropdownMenuContent>
    </DropdownMenu >

  )
}

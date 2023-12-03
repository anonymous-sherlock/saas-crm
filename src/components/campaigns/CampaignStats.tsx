"use client"
import { cn } from '@/lib/utils'
import { $Enums, CampaignStatus } from '@prisma/client'
import { ChevronLeft, MoreVertical, Trash } from 'lucide-react'
import Link from 'next/link'
import { FC, useState } from 'react'
import { toast as hotToast } from "react-hot-toast"
import { Button, buttonVariants } from '../ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { trpc } from '@/app/_trpc/client'
import { CAMPAIGN_STATUS } from '@/constants/index'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog'
import { useRouter } from 'next/navigation'

interface CampaignStatsProps {
	campaign: {
		name: string;
		code: string;
		status: $Enums.CampaignStatus;
		description: string | null;
		userId: string;
		id: string;
	}
}

export const CampaignStats = ({ campaign }: CampaignStatsProps) => {
	return (<main className="mx-auto max-w-7xl md:p-2">
		<Link href="/campaigns" className={cn(buttonVariants({ variant: "secondary" }), "rounded-full")}>
			<ChevronLeft className='h-4 w-4' />{" "}Back
		</Link>
		<div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
			<h1 className="mb-3 font-bold text-3xl text-gray-900">Insights for <span className='text-green-600'>{campaign.name}</span></h1>

			<CampaignActionDropDown campaign={campaign} />
		</div>



	</main>
	)
}


interface CampaignActionDropDownProps {
	campaign: {
		id: string
		name: string;
		code: string;
		status: CampaignStatus
	}
}

const CampaignActionDropDown = ({ campaign }: CampaignActionDropDownProps) => {
	const [campaignStatus, setCampaignStatus] = useState<CampaignStatus>(campaign.status);
	const utils = trpc.useUtils();
	const router = useRouter()

	const { mutateAsync: copyCampaign, isLoading: isCopyingCampaign } = trpc.campaign.copyCampaign.useMutation({
	})

	const { mutateAsync: updateStatus, isLoading: isUpdatingStatus } =
		trpc.campaign.updateStatus.useMutation({
			onSuccess: (data) => {
				setCampaignStatus(data.updatedCampaign.status)
				utils.campaign.getAll.invalidate();
			},

		});
	const { mutateAsync: deleteCampaign, isLoading: isDeletingCampaign } = trpc.campaign.deleteCampaign.useMutation({
		onSuccess: (data) => {
			utils.campaign.getAll.invalidate();
			router.push("/campaigns")
		},
	});
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
	function handleDeleteCampaign() {
		hotToast.promise(
			deleteCampaign({ campaignIds: [campaign.id] }),
			{
				loading: 'Deleting campaign...',
				success: "Campaign deleted successfully!",
				error: "Could not delete campaign.",
			}
		);
		
	}
	
	return (
		<AlertDialog>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button size="icon" variant="secondary" className={cn("rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-slate-400 disabled:pointer-events-none dark:focus:ring-offset-slate-900 border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground h-10 p-2")}><MoreVertical />
						<span className="sr-only">Open menu</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-56">
					<DropdownMenuLabel>Campaign Actions</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem className="cursor-pointer" onClick={handleCopyCampaign}>Make a copy</DropdownMenuItem>
					<DropdownMenuItem className="cursor-pointer"
						onClick={() => {
							navigator.clipboard.writeText(campaign.code.toString());
							hotToast.success('Successfully Copied Campaign Code')

						}}
					>Copy Campaign Code</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuSub>
						<DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
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
					<DropdownMenuSeparator />



					<AlertDialogTrigger asChild>
						<DropdownMenuItem className="text-red-600 focus:text-red-600 cursor-pointer">
							<Trash className='w-4 h-4 mr-2' /> Delete Campaign
						</DropdownMenuItem>
					</AlertDialogTrigger>
				</DropdownMenuContent>
			</DropdownMenu>
			{/*Delete Dialog Content */}
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete your
						Campaign from our servers.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={handleDeleteCampaign}
						disabled={isDeletingCampaign}
						className={buttonVariants({ variant: "destructive" })}
					>
						{isDeletingCampaign ? "Deleting..." : "Delete Campaign"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog >

	)
}

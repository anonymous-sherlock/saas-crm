"use client"
import { cn } from '@/lib/utils'
import { $Enums } from '@prisma/client'
import { ChevronLeft, MoreVertical, Trash } from 'lucide-react'
import Link from 'next/link'
import { FC } from 'react'
import { Button, buttonVariants } from '../ui/button'
import { toast as hotToast } from "react-hot-toast";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'

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

export const CampaignStats: FC<CampaignStatsProps> = ({ campaign }) => {
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
		name: string;
		code: string;
	}
}

const CampaignActionDropDown = ({ campaign }: CampaignActionDropDownProps) => {
	return (

		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button size="icon" variant="secondary" className={cn("rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-slate-400 disabled:pointer-events-none dark:focus:ring-offset-slate-900 border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground h-10 p-2")}><MoreVertical />
					<span className="sr-only">Open menu</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56">
				<DropdownMenuLabel>Campaign Actions</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem >Make a copy</DropdownMenuItem>
				<DropdownMenuItem className="cursor-pointer"
					onClick={() => {
						navigator.clipboard.writeText(campaign.code.toString());
						hotToast.success('Successfully Copied Campaign Code')

					}}
				>Copy Campaign Code</DropdownMenuItem>
				<DropdownMenuCheckboxItem>
					Status Bar
				</DropdownMenuCheckboxItem>
				<DropdownMenuCheckboxItem>
					Activity Bar
				</DropdownMenuCheckboxItem>
				<DropdownMenuCheckboxItem>
					Panel
				</DropdownMenuCheckboxItem>
				<DropdownMenuSeparator />

				<DropdownMenuItem className="text-red-600 focus:text-red-600">
					<Trash className='w-4 h-4 mr-2' /> Delete Campaign
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>

	)
}

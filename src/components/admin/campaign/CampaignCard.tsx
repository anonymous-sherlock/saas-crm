"use client"
import { CustomBadge } from '@/components/CustomBadge'
import TooltipComponent from '@/components/global/tooltip-component'
import { CampaignActionDropDown } from '@/components/template/campaigns/CampaignActionDropDown'
import { Button } from '@/components/ui/button'
import { CAMPAIGN_STATUS } from '@/constants/index'
import { toSentenceCase } from '@/lib/utils'
import { Campaign } from '@prisma/client'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { pages } from '@routes'
import { format } from 'date-fns'
import { BarChart2, Plus } from 'lucide-react'
import Link from 'next/link'
import { FC } from 'react'

interface CampaignCardProps {
    campaign: Pick<Campaign, "id" | "name" | "status" | "code" | "description" | "createdAt">
    leadsCount: number,
    href: string
}

const CampaignCard: FC<CampaignCardProps> = ({ campaign, leadsCount, href }) => {

    return (
        <div key={campaign.id} className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg">
            <div className="flex flex-col gap-2 relative">
                <CustomBadge badgeValue={campaign.status} status={CAMPAIGN_STATUS} className='absolute top-2 right-2' />
                <div className="pt-6 px-6 flex flex-col w-full gap-2 space-x-2">
                    <Link href={href} className='flex gap-2 items-center'>
                        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
                        <div className="flex-1 truncate">
                            <div className="flex flex-col items-start ">
                                <TooltipComponent message={
                                    <>
                                        <strong className='font-semibold mb-2'>Description</strong>
                                        <p>{campaign.description}</p>
                                    </>
                                }
                                    delayDuration={100} classNames={{ TooltipContent: "max-w-[300px] text-wrap p-4" }} >
                                    <h3 className="truncate text-sm font-medium text-zinc-900 ">{campaign.name}</h3>
                                </TooltipComponent>
                                <span className='text-xs text-muted-foreground'>#{campaign.code}</span>
                            </div>
                        </div>
                    </Link>
                </div>

            </div>

            <div className="px-6 mt-4 grid grid-cols-3 place-items-center py-2 gap-2 text-xs text-zinc-500">
                <div className="flex items-center gap-1 justify-start shrink-0">
                    <Plus className="h-4 w-4 shrink-0" />
                    <span className='flex shrink-0'>
                        {format(new Date(campaign.createdAt), "MMM dd, yyyy")}
                    </span>
                </div>

                <Link href={`${pages.campaign}/${campaign.id}/leads`} className='justify-self-end' title='View Leads' >
                    <div className="flex items-center gap-2">
                        <BarChart2 className="h-4 w-4" />
                        {leadsCount ?? 0}
                    </div>
                </Link>

                <CampaignActionDropDown type='custom' campaign={campaign}>
                    <Button variant="secondary" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted border-2 rounded-full justify-self-end"   >
                        <DotsHorizontalIcon className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </CampaignActionDropDown>
            </div>
        </div>
    )
}

export default CampaignCard
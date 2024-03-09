import { CustomBadge } from '@/components/CustomBadge'
import { DeleteCampaign } from '@/components/campaigns/DeleteCampaign'
import { CAMPAIGN_STATUS } from '@/constants/index'
import { Campaign } from '@prisma/client'
import { format } from 'date-fns'
import { BarChart2, Plus } from 'lucide-react'
import Link from 'next/link'
import { FC } from 'react'

interface CampaignCardProps {
    campaign: Pick<Campaign, "id" | "name" | "status" | "code" | "createdAt">
    leadsCount: number,
    href: string
}

const CampaignCard: FC<CampaignCardProps> = ({ campaign, leadsCount, href }) => {
    return (
        <li key={campaign.id} className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg">
            <Link href={href} className="flex flex-col gap-2 relative">
                <div className="pt-6 px-6 flex w-full items-center justify-between space-x-6">
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
                    <div className="flex-1 truncate">
                        <div className="flex items-center space-x-3">
                            <h3 className="truncate text-md font-medium text-zinc-900">{campaign.name}</h3>
                            <CustomBadge badgeValue={campaign.status} status={CAMPAIGN_STATUS} />
                        </div>
                    </div>
                </div>
            </Link>

            <div className="px-6 mt-4 grid grid-cols-3 place-items-center py-2 gap-2 text-xs text-zinc-500">
                <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    {format(new Date(campaign.createdAt), "MMM dd, yyyy")}
                </div>

                <Link href={`/leads/${campaign.code}`} >
                    <div className="flex items-center gap-2">
                        <BarChart2 className="h-4 w-4" />
                        {leadsCount ?? 0}
                    </div>
                </Link>
                <DeleteCampaign campaignId={campaign.id} />
            </div>
        </li>
    )
}

export default CampaignCard
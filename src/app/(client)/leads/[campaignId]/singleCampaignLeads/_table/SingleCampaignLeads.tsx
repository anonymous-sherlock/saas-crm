"use client"
import { trpc } from '@/app/_trpc/client'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Ghost } from 'lucide-react'
import Skeleton from 'react-loading-skeleton'
import { DataTable } from './data-table'
import { columns } from './columns'
import { RouterOutputs } from '@/server'


interface SingleCampaignLeadsProps {
    campaignId: string
    leads: RouterOutputs["lead"]["getCampaignLeads"]
}

const SingleCampaignLeads = ({ campaignId, leads }: SingleCampaignLeadsProps) => {

    const { data: Leads, isLoading } = trpc.lead.getCampaignLeads.useQuery({ campaignId }, {
        initialData: leads,
        refetchOnMount: false,
        refetchOnWindowFocus: false
    }

    )
    return (
        <ScrollArea className="w-full rounded-md" type="always">
            <div className="border mt-4 h-full flex-1 flex-col space-y-8 rounded-lg border-gray-200 bg-white p-8 md:flex">
                <div className="flex items-center justify-between space-y-2">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            Welcome back!
                        </h2>
                        <p className="text-muted-foreground">
                            Here&apos;s a list of your leads!
                        </p>
                    </div>
                </div>
                {/* display all user ccampaign */}
                {Leads && Leads?.length !== 0 ? (
                    <DataTable data={Leads} columns={columns} />
                ) : isLoading ? (
                    <Skeleton height={100} className="my-2" count={3} />
                ) : (
                    <div className="mt-16 flex flex-col items-center gap-2">
                        <Ghost className="h-8 w-8 text-zinc-800" />
                        <h3 className="font-semibold text-xl">Pretty empty around here</h3>
                        <p>Let&apos;s create your first campaign.</p>
                    </div>
                )}
            </div>
            <ScrollBar orientation="horizontal" className="w-full" />
        </ScrollArea>
    )
}

export default SingleCampaignLeads
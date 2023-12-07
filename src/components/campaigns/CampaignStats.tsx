"use client"
import { trpc } from '@/app/_trpc/client'
import { CAMPAIGN_STATUS } from '@/constants/index'
import { cn } from '@/lib/utils'
import { RouterOutputs } from '@/server'
import { ChevronLeft, HelpCircle } from 'lucide-react'
import { Session } from 'next-auth'
import Link from 'next/link'
import Skeleton from 'react-loading-skeleton'
import { CustomBadge } from '../CustomBadge'
import { Icons } from '../Icons'
import { CampaignAnalyticsChart } from '../charts/CampaignAnalyticsChart'
import LeadsForm from '../leads/LeadsForm'
import TooltipComponent from '../tooltip-component'
import { buttonVariants } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import { CampaignActionDropDown } from './CampaignActionDropDown'

interface CampaignStatsProps {
  campaign: RouterOutputs["campaign"]["get"]
  user: Session["user"]
}

export const CampaignStats = ({ campaign: InitialCampaignData, user }: CampaignStatsProps) => {
  const { data: campaign } = trpc.campaign.get.useQuery({ camapaingId: InitialCampaignData.id }, {
    initialData: InitialCampaignData,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    keepPreviousData: true
  })
  return (
    <main className="mx-auto max-w-7xl md:p-2">
      <Link href="/campaigns" className={cn(buttonVariants({ variant: "secondary" }), "rounded-full")}>
        <ChevronLeft className='h-4 w-4' />{" "}Back
      </Link>

      <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-2 sm:flex-row sm:items-center sm:gap-0">
        <div className=''>

          <h1 className="mb-3 font-bold text-3xl text-gray-900">Insights for <span className='text-green-600'>{campaign.name}</span>

          </h1>
          <span className="inline-flex w-fit items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
            <div className="relative">
              <Icons.liveData className='mr-1.5 h-4 w-4' />
              <Icons.liveData className='absolute inset-0 animate-custom-ping mr-1.5 h-4 w-4' />
            </div>live data</span>
        </div>

        <div className='flex justify-end items-center gap-4'>
          {user.role === "ADMIN" ?
            <LeadsForm campaignCode={campaign.code} /> : null
          }
          <CampaignActionDropDown campaign={campaign} />
        </div>
      </div>



      <div className='tremor-Grid-root grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4'>
        <Card className='p-4'>
          <CardContent className={cn("p-2")}>
            <div className='flex items-center gap-3'>
              <p className="font-medium text-lg text-muted-foreground flex items-center gap-2">Impressions
                <TooltipComponent message='Total Impressions' delayDuration={300}>
                  <HelpCircle className='w-4 h-4 text-muted-foreground' />
                </TooltipComponent>
              </p>
            </div>

            <Skeleton height={50} className="my-4" count={1} />

          </CardContent>
        </Card>

        <Card className='p-4'>
          <CardContent className={cn("p-2")}>
            <div className='flex items-center gap-3 justify-between'>
              <p className="font-medium text-lg text-muted-foreground flex items-center gap-2">Status
                <TooltipComponent message='Campaign Status' delayDuration={300}>
                  <HelpCircle className='w-4 h-4 text-muted-foreground' />
                </TooltipComponent>
              </p>
              <CustomBadge badgeValue={campaign.status} status={CAMPAIGN_STATUS} />
            </div>
            <Skeleton height={50} className="my-4" count={1} />
          </CardContent>
        </Card>


        <Card className='p-4'>
          <CardContent className={cn("p-2")}>
            <div className='flex items-center gap-3'>
              <p className="font-medium text-lg text-muted-foreground flex items-center gap-2">Conversions
                <TooltipComponent message='Total Conversions' delayDuration={300}>
                  <HelpCircle className='w-4 h-4 text-muted-foreground' />
                </TooltipComponent>
              </p>
            </div>

            <Skeleton height={50} className="my-4" count={1} />
          </CardContent>
        </Card>


      </div>



      <Card className='p-6 mt-8'>
        <CardContent>
          <CampaignAnalyticsChart campaignId={campaign.id} />
        </CardContent>
      </Card>


    </main>
  )
}


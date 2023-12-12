"use client"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import * as React from "react"

import { trpc } from "@/app/_trpc/client"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { RouterOutputs } from "@/server"
import { useDashboardChartStore } from "@/store/dashboard"
import { MoveRight } from "lucide-react"
import Skeleton from "react-loading-skeleton"

type ChartCampaignSelectProps = {
}

export function ChartCampaignSelect({ }: ChartCampaignSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [secondOpen, setSecondOpen] = React.useState(false)
  const [campaigns, setCampaigns] = React.useState<RouterOutputs["analytics"]["getCampaignName"]>()

  const { firstCampaignId, secondCampaignId, setFirstCampaignId, setSecondCampaignId } = useDashboardChartStore()


  const { data, isLoading, isFetched } = trpc.analytics.getCampaignName.useQuery(undefined, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })





  React.useEffect(() => {
    if (data) {
      setCampaigns(data)
    }
  }, [data])

  if(isLoading || !data){
    return <Skeleton height={40} className="m-0" width={425} count={1} />
  }

  return (
    <>
      <div className="flex gap-2 items-center justify-center">
        {/* first campaign */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between"
            >
              <span className="truncate">
                {firstCampaignId
                  ? campaigns && campaigns.find((campaign) => campaign.id === firstCampaignId)?.name
                  : "Select Campaign..."}
              </span>

              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search framework..." className="h-9" />
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                {
                  campaigns && campaigns.filter(campaign => campaign.id !== secondCampaignId).map((campaign) => (
                    <CommandItem
                      key={campaign.id}
                      value={campaign.id}
                      onSelect={(currentValue) => {
                        if (currentValue === firstCampaignId) {
                          setFirstCampaignId("");
                        } else {
                          setFirstCampaignId(currentValue);
                        }
                        setOpen(false)
                      }}
                    >
                      {campaign.name}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          firstCampaignId === campaign.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))
                }

              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
        <MoveRight className="text-muted-foreground" />
        {/* second campaign */}

        <Popover open={secondOpen} onOpenChange={setSecondOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between"
            >
              <span className="truncate">
                {secondCampaignId
                  ? campaigns && campaigns.find((campaign) => campaign.id === secondCampaignId)?.name
                  : "Select Campaign..."}
              </span>
              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search framework..." className="h-9" />
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                {
                  campaigns && campaigns.filter(campaign => campaign.id !== firstCampaignId).map((campaign) => (
                    <CommandItem
                      key={campaign.id}
                      value={campaign.id}
                      onSelect={(currentValue) => {
                        if (currentValue === secondCampaignId) {
                          setSecondCampaignId("");
                        } else {
                          setSecondCampaignId(currentValue);
                        }
                        setSecondOpen(false)
                      }}
                    >
                      {campaign.name}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          secondCampaignId === campaign.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))
                }

              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div >
    </>

  )
}


export default ChartCampaignSelect
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
import { RouterInputs, RouterOutputs } from "@/server"
import { MoveRight } from "lucide-react"

type ChartCampaignSelectProps = {
  compareCampaign?: ({ }: RouterInputs["analytics"]["get2CampaignAnalytics"]) => void
}

export function ChartCampaignSelect({ compareCampaign }: ChartCampaignSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [secondOpen, setSecondOpen] = React.useState(false)
  const [firstCampaign, setFirstCampaign] = React.useState<string>("")
  const [secondCampaign, setSecondCampaign] = React.useState<string>("")
  const [campaigns, setCampaigns] = React.useState<RouterOutputs["analytics"]["getCampaignName"]>()


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
                {firstCampaign
                  ? campaigns && campaigns.find((campaign) => campaign.id === firstCampaign)?.name
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
                  campaigns && campaigns.filter(campaign => campaign.id !== secondCampaign).map((campaign) => (
                    <CommandItem
                      key={campaign.id}
                      value={campaign.id}
                      onSelect={(currentValue) => {
                        if (currentValue === firstCampaign) {
                          setFirstCampaign("");
                        } else {
                          setFirstCampaign(currentValue);
                        }
                        setOpen(false)
                      }}
                    >
                      {campaign.name}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          firstCampaign === campaign.id ? "opacity-100" : "opacity-0"
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
                {secondCampaign
                  ? campaigns && campaigns.find((campaign) => campaign.id === secondCampaign)?.name
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
                  campaigns && campaigns.filter(campaign => campaign.id !== firstCampaign).map((campaign) => (
                    <CommandItem
                      key={campaign.id}
                      value={campaign.id}
                      onSelect={(currentValue) => {
                        if (currentValue === secondCampaign) {
                          setSecondCampaign("");
                        } else {
                          setSecondCampaign(currentValue);
                        }
                        setSecondOpen(false)
                      }}
                    >
                      {campaign.name}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          secondCampaign === campaign.id ? "opacity-100" : "opacity-0"
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
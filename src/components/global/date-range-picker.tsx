"use client"
import useDateRangeFromSearchParams from "@/hooks/useDateRangeFromUrl"
import { cn, formatDateRangeForParams } from "@/lib/utils"
import { Button } from "@/ui/button"
import { Calendar } from "@/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/ui/popover"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format, subDays, subMonths, subYears } from "date-fns"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import * as React from "react"
import { DateRange } from "react-day-picker"

type SubDaysType = "days" | "months" | "years";
type PredefinedDatesTypes = {
  label: string,
  value: number,
  type: SubDaysType
}
const predefinedDates: PredefinedDatesTypes[] = [
  { label: 'Today', value: 0, type: 'days' },
  { label: 'Yesterday', value: 1, type: 'days' },
  { label: 'Last 3 Days', value: 3, type: 'days' },
  { label: 'Last 7 Days', value: 7, type: 'days' },
  { label: 'Last 30 Days', value: 30, type: 'days' },
  { label: 'Last 3 Months', value: 3, type: 'months' },
  { label: 'Last 1 Year', value: 1, type: 'years' },
];

export function CalendarDateRangePicker({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const today = new Date()
  const { fromDate, toDate, hasDateParams } = useDateRangeFromSearchParams()


  const [dateState, setDateState] = React.useState<{ date: DateRange | undefined; isChanged: boolean }>({
    date: { from: fromDate, to: toDate },
    isChanged: false,
  });

  const handleDateChange = (newDate: DateRange | undefined) => {
    setDateState({ date: newDate, isChanged: true });
  };
  const handlePredefinedClick = (value: number, type: SubDaysType) => {
    const fromDate = type === "days" ? subDays(today, value) :
      type === "months" ? subMonths(today, value) :
        type === "years" ? subYears(today, value) : today;
    const toDate = today;
    setDateState({ date: { from: fromDate, to: toDate }, isChanged: true });
  };

  const handleDateApply = () => {
    const dateString = formatDateRangeForParams(dateState.date);
    const params = new URLSearchParams(searchParams.toString())
    params.set("date", dateString)
    router.push(`${pathname}?${params}`);
    setDateState(prevState => ({ ...prevState, isChanged: false }));
  };
  const removeDateFilter = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("date")
    router.push(`${pathname}?${params}`);
  }
  return (
    <div className={cn("flex flex-col-reverse md:flex-row gap-2", className)}>
      {dateState.isChanged && (
        <Button variant="default" className="text-sm h-9 md:h-8" onClick={handleDateApply}>Apply</Button>
      )}
      {
        hasDateParams ?
          <Button variant="destructive" onClick={removeDateFilter} className="hover:bg-destructive-foreground/15 text-destructive-foreground h-9 md:h-8">Clear Filter</Button> : null
      }
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "h-9 md:w-[260px] grow md:h-8 md:mr-2 justify-start text-left font-normal",
              !dateState.date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateState.date?.from ? (
              dateState.date.to ? (
                <>
                  {format(dateState.date.from, "LLL dd, y")} -{" "}
                  {format(dateState.date.to, "LLL dd, y")}
                </>
              ) : (
                format(dateState.date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 flex flex-col md:flex-row" align="end">
          <div className="flex flex-col gap-2 border-r px-2 py-4">
            <div className="grid min-w-[250px] gap-1">
              {predefinedDates.map(({ label, value, type }) => (
                <Button
                  key={label}
                  variant="ghost"
                  className="justify-start font-normal"
                  onClick={() => handlePredefinedClick(value, type)}
                >
                  {label}
                  <span className="ml-auto text-muted-foreground">
                    {
                      type === "days" ?
                        format(subDays(today, value), "E, dd MMM") :
                        type === "months" ?
                          format(subMonths(today, value), "E, dd MMM") :
                          type === "years" ?
                            format(subYears(today, value), "E, dd MMM") : null
                    }
                  </span>
                </Button>
              ))}
            </div>
          </div>
          <div className="p-2">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateState.date?.from}
              selected={dateState.date}
              onSelect={handleDateChange}
              numberOfMonths={2}
              disabled={(date) =>
                date > today
              }
              captionLayout="dropdown-buttons"
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
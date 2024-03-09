"use client";
import { Separator } from "@/components/ui/separator";
import { timeOptions, workingDayOptions } from "@/constants/time";
import { FC, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { ScrollArea } from "../ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { cn } from "@/lib/utils";
import { CampaignFormType } from "@/schema/campaignSchema";

interface WorkingHoursProps { }

const WorkingHours: FC<WorkingHoursProps> = ({ }) => {
  const { control, setValue, setError, clearErrors } = useFormContext<CampaignFormType>();
  const [daysOpen, setDaysOpen] = useState(false);

  const selectedWorkingDaysRef = useRef<Array<string>>([]);

  const handleDaySelect = (day: string) => {
    selectedWorkingDaysRef.current = selectedWorkingDaysRef.current.includes(day) ? selectedWorkingDaysRef.current.filter((d) => d !== day) : [...selectedWorkingDaysRef.current, day];
    setValue("workingDays", selectedWorkingDaysRef.current);
    if (selectedWorkingDaysRef.current.length === 0) {
      setError("workingDays", {
        type: "required",
        message: "Please select at least one region.",
      });
    } else {
      clearErrors("workingDays"); // Remove the error
    }
  };

  return (
    <>
      {/* Working Days */}
      <FormField
        control={control}
        name="workingDays"
        render={({ field }) => (
          <FormItem className="mt-0">
            <FormLabel>Working Days</FormLabel>
            <FormControl>
              <Popover open={daysOpen} onOpenChange={setDaysOpen} >
                <PopoverTrigger asChild >
                  <FormControl>
                    <Button variant="outline" role="combobox" aria-expanded={daysOpen} className={cn("w-full justify-between h-11", !field.value && "text-muted-foreground")}>
                      {selectedWorkingDaysRef.current.length > 0 ? `${selectedWorkingDaysRef.current.length}${" "}Days selected` : "Select Working Days"}
                      <ChevronsUpDown className=" h-3 w-3 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command className="m-0 h-full w-full p-0">
                    <CommandInput placeholder="Search..." />
                    <CommandList>
                      <CommandEmpty>No Days Found.</CommandEmpty>
                      <CommandGroup heading="Days">
                        {workingDayOptions.map((day, index) => (
                          <CommandItem
                            key={index}
                            value={day}
                            className="capitalize my-2"
                            onSelect={() => {
                              handleDaySelect(day);
                            }}
                          >
                            <Check className={cn("mr-1 h-4 w-4", selectedWorkingDaysRef.current.includes(day) ? "opacity-100" : "opacity-0")} />
                            <span>{day}</span>
                          </CommandItem>
                        ))}

                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* working Hours */}
      <div className="grid grid-cols-2 gap-2 items-end">
        <FormField
          control={control}
          name="workingHours.startTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Working Hours</FormLabel>
              <Select onValueChange={field.onChange}>
                <SelectTrigger className="w-full capitalize h-11">
                  <SelectValue placeholder="Start Time" />
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="h-72 ">
                    <SelectGroup>
                      <SelectLabel>Start Time</SelectLabel>
                      <Separator className="my-2" />
                      {timeOptions.map((time, index) => (
                        <SelectItem key={index} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </ScrollArea>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="workingHours.endTime"
          render={({ field }) => (
            <FormItem>
              {/* end time */}

              <Select onValueChange={field.onChange}>
                <FormControl className="capitalize">
                  <SelectTrigger className="w-full capitalize h-11">
                    <SelectValue
                      placeholder="End Time"
                      className="text-muted-foreground"
                    />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  <ScrollArea className="h-72 ">
                    <SelectGroup>
                      <SelectLabel>End Time</SelectLabel>
                      <Separator className="my-2" />
                      {timeOptions.map((time, index) => (
                        <SelectItem key={index} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </ScrollArea>
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};

export default WorkingHours;
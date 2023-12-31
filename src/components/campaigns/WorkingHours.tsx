"use client";
import { Separator } from "@/components/ui/separator";
import { timeOptions, workingDayOptions } from "@/constants/time";
import { FC } from "react";
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

interface WorkingHoursProps { }

const WorkingHours: FC<WorkingHoursProps> = ({ }) => {
  const { control, } =
    useFormContext();

  return (
    <>
      {/* Working Days */}
      <div className="grid grid-cols-2 gap-2 items-end">
        <FormField
          control={control}
          name="workingDays.start"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Working Days</FormLabel>
              <Select onValueChange={field.onChange}>
                <SelectTrigger className="w-full capitalize h-11">
                  <SelectValue placeholder="Start Day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Start Day</SelectLabel>
                    <Separator className="my-2" />
                    {workingDayOptions.map((day, index) => (
                      <SelectItem key={index} value={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="workingDays.end"
          render={({ field }) => (
            <FormItem>
              {/* end time */}

              <Select onValueChange={field.onChange}>
                <FormControl className="capitalize">
                  <SelectTrigger className="w-full capitalize h-11">
                    <SelectValue
                      placeholder="Last Day"
                      className="text-muted-foreground"
                    />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>End Day</SelectLabel>
                    <Separator className="my-2" />
                    {workingDayOptions.map((day, index) => (
                      <SelectItem key={index} value={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
      </div>

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
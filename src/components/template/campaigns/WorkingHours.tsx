"use client";
import { timeOptions, workingDayOptions } from "@/constants/time";
import { CampaignFormSchemaType } from "@/schema/campaign.schema";
import { Select, SelectItem } from "@nextui-org/react";
import React, { FC, useRef } from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";


interface WorkingHoursProps { }

const WorkingHours: FC<WorkingHoursProps> = ({ }) => {
  const { control, getValues, watch, setValue, setError, clearErrors } = useFormContext<CampaignFormSchemaType>();
  const selectedWorkingDaysRef = useRef<Array<string>>(getValues("workingDays"));

  const handleDaySelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValues = e.target.value.split(",")
    selectedWorkingDaysRef.current = newValues
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
              <Select
                isRequired
                aria-label="Select Working Days"
                placeholder="Select Working Days"
                className="w-full"
                variant="faded"
                selectionMode="multiple"
                size="sm"
                defaultSelectedKeys={field.value && field.value}
                {...field}
                onChange={handleDaySelectionChange}
              >
                {workingDayOptions.map((day, index) => (
                  <SelectItem key={day} value={day}>
                    {day}
                  </SelectItem>
                ))}
              </Select>
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
              <FormControl>
                <Select
                  isRequired
                  aria-label="Start Time"
                  placeholder="Start Time"
                  className="w-full"
                  variant="faded"
                  size="sm"
                  defaultSelectedKeys={field.value && [field.value]}
                  {...field}
                >
                  {timeOptions.map((time, index) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </Select>
              </FormControl>
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
              <FormControl>
                <Select
                  isRequired
                  aria-label="End Time"
                  placeholder="End Time"
                  className="w-full"
                  variant="faded"
                  size="sm"
                  defaultSelectedKeys={field.value && [field.value]}
                  {...field}
                >
                  {timeOptions.map((time, index) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};

export default WorkingHours;
"use client";
import { campaignFormSchema } from "@/schema/campaign.schema";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../ui/form";
import { Select, SelectItem } from "@nextui-org/react";
import { cn } from "@/lib/utils";

const AgeFields = () => {
  const { control, watch } = useFormContext<z.infer<typeof campaignFormSchema>>();
  const minAge = watch("targetAge.min");

  const ageNumbers = Array.from({ length: 48 }, (_, index) => 18 + index);

  return (
    <>
      <div className="grid grid-cols-2 gap-2 items-end">
        <FormField
          control={control}
          name="targetAge.min"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target Age</FormLabel>
              <FormControl>
                <Select
                  isRequired
                  aria-label="Target Min Age"
                  placeholder="Min Age"
                  className="w-full"
                  variant="faded"
                  size="sm"
                  defaultSelectedKeys={field.value && [field.value]}
                  {...field}
                >
                  {ageNumbers.map((age, index, self) => {
                    return (
                      <SelectItem key={String(age)} value={String(age)} textValue={String(age)} className={cn(index === self.length - 1 && "hidden")}>
                        {index === self.length - 1 ? null : age}
                      </SelectItem>
                    )
                  })}
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="targetAge.max"
          render={({ field }) => (
            <FormItem>
              {/* end time */}
              <FormControl>
                <Select
                  isRequired
                  aria-label="Target Max Age"
                  placeholder="Max Age"
                  className="w-full"
                  variant="faded"
                  size="sm"
                  defaultSelectedKeys={field.value && [field.value]}
                  {...field}
                >
                  {ageNumbers
                    .filter((age) => age > Number(minAge))
                    .map((age, index, self) => (
                      <SelectItem key={age.toString()} value={age.toString()} textValue={String(age)}>
                        {index === self.length - 1 ? `${age}+` : age}
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

export default AgeFields;

"use client"
import { Icons } from '@/components/Icons';
import { FormError } from '@/components/global/form-error';
import { FormSuccess } from '@/components/global/form-success';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { upsertCompanyDetails } from '@/lib/actions/onboarding.action';
import { catchError, cn } from '@/lib/utils';
import { CompanyDetailsSchema } from '@/schema/company.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Autocomplete, AutocompleteItem, Avatar, Input } from '@nextui-org/react';
import { Company } from '@prisma/client';
import { Country, State, City } from 'country-state-city';
import React, { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from "sonner";
import { z } from 'zod';


interface CompanyDetailsFormProps {
  data?: Pick<Company, "country" | "state" | "city" | "zipcode" | "landmark" | "address">
}

const pickedDetailsSchema = CompanyDetailsSchema.pick({
  country: true,
  state: true,
  city: true,
  zipcode: true,
  landmark: true,
  address: true
});

const CompanyBusinessLocation: FC<CompanyDetailsFormProps> = ({ data }) => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = React.useTransition();
  const [countryCode, setCountryCode] = useState<string | undefined>(Country.getAllCountries().find((country) => country.name === data?.country)?.isoCode);
  const [stateCode, setStateCode] = useState<string | undefined>(State.getAllStates().find((state) => state.name === data?.state)?.isoCode);

  const form = useForm<z.infer<typeof pickedDetailsSchema>>({
    resolver: zodResolver(pickedDetailsSchema),
    defaultValues: {
      country: data?.country,
      state: data?.state,
      city: data?.city,
      zipcode: data?.zipcode,
      landmark: data?.landmark || "",
      address: data?.address
    }
  });

  async function onSubmit(values: z.infer<typeof pickedDetailsSchema>) {
    startTransition(async () => {
      setError("");
      setSuccess("");
      try {
        await upsertCompanyDetails(values).then((data) => {
          if (data?.error) {
            setError(data.error)
            toast.error(data.error)
          } else if (data.success) {
            setSuccess(data.success)
            toast.success(data.success)
          }
        })
      } catch (err) {
        catchError(err);
      }
    })
  }

  const myFilter = (textValue: string, inputValue: string) => {
    if (inputValue.length === 0) { return true; }
    textValue = textValue.normalize("NFC").toLocaleLowerCase();
    inputValue = inputValue.normalize("NFC").toLocaleLowerCase();
    return textValue.slice(0, inputValue.length) === inputValue;
  };
  function handleCountrySelect(countryName: string) {
    if (!countryName) return setCountryCode("")
    const CountryCodeValue = Country.getAllCountries().find((country) => country.name === countryName)?.isoCode
    setCountryCode(CountryCodeValue)
  }
  function handleStateSelect(stateName: string) {
    if (!stateName) {
      setStateCode("")
      form.resetField("city")
      return
    }
    const StateCodeValue = State.getAllStates().find((state) => state.name === stateName)?.isoCode
    setStateCode(StateCodeValue)
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} method="post" className="flex flex-col items-start space-y-4 md:space-y-5 w-full" >
          <div className="flex flex-col md:grid grid-cols-2 gap-4 md:gap-6 w-full">
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-card-foreground text-sm" >Country</FormLabel>
                  <FormControl>
                    <Autocomplete
                      defaultItems={Country.getAllCountries()}
                      defaultFilter={myFilter}
                      size="sm"
                      variant="faded"
                      placeholder="Select Country"
                      defaultSelectedKey={countryCode && Country.getCountryByCode(countryCode)?.name}
                      aria-label="select a Country"
                      startContent={field.value && <Avatar alt="country logo" className="text-xl !w-5 !h-5 shrink-0" src={`https://flagcdn.com/${Country.getAllCountries().find((c) => c.name === form.getValues("country"))?.isoCode.toLowerCase()}.svg`} />}
                      onKeyDown={(e: any) => e.continuePropagation()}
                      onSelectionChange={(val) => {
                        val ? form.setValue("country", val.toString()) : form.resetField("country")
                        handleCountrySelect(String(val))
                      }}
                      {...field}
                    >
                      {(country) => (
                        <AutocompleteItem key={country.name} textValue={country.name}
                          aria-label={country.name}
                          startContent={<Avatar alt={country.name} className="w-6 h-6" src={`https://flagcdn.com/${country.isoCode.toLowerCase()}.svg`} />}>
                          {country.name}
                        </AutocompleteItem>
                      )}
                    </Autocomplete>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-card-foreground text-sm" >State</FormLabel>
                  <FormControl>
                    <Autocomplete
                      defaultItems={State.getStatesOfCountry(countryCode)}
                      defaultFilter={myFilter}
                      size="sm"
                      variant="faded"
                      allowsCustomValue
                      placeholder="Select a State"
                      aria-label="Select a State"
                      defaultSelectedKey={stateCode && countryCode && State.getStateByCodeAndCountry(stateCode, countryCode)?.name}
                      onKeyDown={(e: any) => e.continuePropagation()}
                      onSelectionChange={(val) => {
                        val ? form.setValue("state", val.toString()) : form.resetField("state");
                        handleStateSelect(String(val))
                      }}
                      {...field}
                    >
                      {(state) => (
                        <AutocompleteItem key={state.name} textValue={state.name}
                          aria-label={state.name}>
                          {state.name}
                        </AutocompleteItem>
                      )}
                    </Autocomplete>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem >
                  <FormLabel className="text-card-foreground text-sm w-full" >City</FormLabel>
                  <FormControl>
                    <Autocomplete
                      defaultItems={City.getCitiesOfState(String(countryCode), String(stateCode))}
                      defaultFilter={myFilter}
                      size="sm"
                      variant="faded"
                      allowsCustomValue
                      placeholder="Select a City"
                      aria-label="Select a City"
                      defaultSelectedKey={stateCode && City.getCitiesOfState(String(countryCode), String(stateCode)).find((c) => c.name === field.value)?.name}
                      onKeyDown={(e: any) => e.continuePropagation()}
                      onSelectionChange={(val) => {
                        val ? form.setValue("city", val.toString()) : form.resetField("city");
                      }}
                      {...field}
                    >
                      {(city) => (
                        <AutocompleteItem key={city.name} textValue={city.name}
                          aria-label={city.name}>
                          {city.name}
                        </AutocompleteItem>
                      )}
                    </Autocomplete>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="zipcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-card-foreground text-sm" >Area Zipcode</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      size="sm"
                      variant="faded"
                      placeholder="Zipcode"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="landmark"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel className="text-card-foreground text-sm" >Landmark</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      size="sm"
                      variant="faded"
                      placeholder="Landmark"
                      defaultValue={field.value}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel className="text-card-foreground text-sm" >Business Address</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      size="sm"
                      variant="faded"
                      placeholder="Address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormSuccess message={success} />
          <FormError message={error} />

          <Button type="submit"
            autoSave="false"
            className={cn("shrink-0 inline-flex min-w-60 w-max")}
            disabled={isPending}
          >
            {isPending && (
              <Icons.spinner
                className="mr-2 h-4 w-4 animate-spin"
                aria-hidden="true"
              />
            )}
            Update Details
          </Button>
        </form>
      </Form>
    </>
  )
}

export default CompanyBusinessLocation
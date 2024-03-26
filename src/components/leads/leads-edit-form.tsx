"use client";
import { FormError } from "@/components/global/form-error";
import { FormSuccess } from "@/components/global/form-success";
import { upsertLeadDetails } from "@/lib/actions/lead.action";
import { autoCompleteFilter } from "@/lib/helpers/filter";
import { cn, formatPrice, toSentenceCase } from "@/lib/utils";
import { LeadSchema } from "@/schema/lead.schema";
import { Card, CardContent, CardTitle } from "@/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/ui/form";
import { Card as CardUi, CardBody as CardBodyUi, CardFooter as CardFooterUi } from "@nextui-org/card"
import { zodResolver } from "@hookform/resolvers/zod";
import { Autocomplete, AutocompleteItem, Avatar, CardBody, Chip, Image, Input, Textarea } from "@nextui-org/react";
import { Campaign, Lead, Media, Product, ProductImage } from "@prisma/client";
import { pages } from "@routes";
import { City, Country, ICity, State } from "country-state-city";
import { CircleUserRound, Globe, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { FC, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast as hotToast } from "react-hot-toast";
import { z } from "zod";
import { Icons } from "../Icons";
import { Button } from "@/ui/button";
import Spinner from "@/ui/spinner";
import { PRODUCT_CATEGORIES } from "@/constants/index";

interface LeadsEditDormProps {
  data?: Partial<Lead & {
    campaign: Campaign & {
      product: Product & {
        images: ProductImage & {
          media: Media[] | []
        } | null;
      } | null;
    } | null;
  }>;
  title: string,
}

export const LeadsEditForm: FC<LeadsEditDormProps> = ({ title, data }) => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter()
  const [countryCode, setCountryCode] = useState<string | undefined>(Country.getAllCountries().find((country) => country.name === data?.country)?.isoCode);
  const [stateCode, setStateCode] = useState<string | undefined>(State.getAllStates().find((state) => state.name === data?.region)?.isoCode);
  const [allCities, setAllCities] = useState<ICity[] | []>(() => {
    if (countryCode && stateCode) {
      return City.getCitiesOfState(countryCode, stateCode);
    }
    return [];
  });

  const form = useForm<z.infer<typeof LeadSchema>>({
    resolver: zodResolver(LeadSchema),
    mode: "all",
    defaultValues: {
      name: data?.name,
      phone: data?.phone,
      address: data?.address || "",
      description: data?.description || "",
      country: data?.country || "",
      region: data?.region || "",
      city: data?.city || "",
      zipcode: data?.zipcode || "",
      email: data?.email || "",
      website: data?.website || "",
      street: data?.street || "",
    }
  });
  const sortedCities = useMemo(() => {
    const cities = City.getAllCities();
    const cityValue = form.getValues("city")?.toLowerCase();
    cities.sort((a, b) => {
      const aExactMatch = a.name.toLowerCase() === cityValue;
      const bExactMatch = b.name.toLowerCase() === cityValue;
      if (aExactMatch && !bExactMatch) return -1;
      if (!aExactMatch && bExactMatch) return 1;
      return b.name.length - a.name.length;
    });
    return cities;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.city]);

  async function onSubmit(values: z.infer<typeof LeadSchema>) {
    startTransition(async () => {
      hotToast.promise(
        upsertLeadDetails({ data: values, leadId: data?.id, }).then((data) => {
          if (data?.success) {
            setSuccess(data.success)
            form.reset()
            router.push(`${pages.leads}`)
          }
          else if (data?.error) {
            setError(data.error)
          }
        }),
        {
          loading: "Updating lead...",
          success: "Lead updated successfully!",
          error: "Could not update lead",
        }
      )
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
    setAllCities((countryCode && StateCodeValue) ? City.getCitiesOfState(countryCode, StateCodeValue) : [])
  }

  return (
    <Card className="bg-white p-6">
      <CardTitle>{title}</CardTitle>
      <CardContent className="mt-8 w-full p-0">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            method="post"
            className="flex flex-col md:grid sm:grid-cols-1 lg:grid-cols-5 items-start md:gap-8 space-y-4 "
          >
            <div className="md:col-span-3 flex w-full flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 gap-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Person Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          size="md"
                          placeholder="Customer Name"
                          classNames={{ inputWrapper: "border" }}
                          startContent={
                            <CircleUserRound className="text-xl w-5 h-5 text-default-400 pointer-events-none flex-shrink-0" />
                          }
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Person Phone</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          size="sm"
                          placeholder="Person Phone"
                          classNames={{ inputWrapper: "border" }}
                          startContent={
                            <Phone className="text-xl w-5 h-5 text-default-400 pointer-events-none flex-shrink-0" />
                          }
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />


                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-card-foreground text-sm" >Country <span className="text-muted-foreground italic">(optional).</span></FormLabel>
                      <FormControl>
                        <Autocomplete
                          defaultItems={Country.getAllCountries()}
                          defaultFilter={autoCompleteFilter}
                          size="md"
                          inputProps={{
                            classNames: { inputWrapper: "border" }
                          }}
                          placeholder="Select Country"
                          defaultSelectedKey={countryCode && Country.getCountryByCode(countryCode)?.name}
                          aria-label="select a Country"
                          startContent={countryCode && <Avatar alt="country logo" className="text-xl !w-5 !h-5 shrink-0" src={`https://flagcdn.com/${Country.getAllCountries().find((c) => c.name === form.getValues("country"))?.isoCode.toLowerCase()}.svg`} />}
                          onKeyDown={(e: any) => e.continuePropagation()}
                          onInputChange={(val) => {
                            if (val === "" || val === null) {
                              form.resetField("country");
                              form.resetField("region");
                            }
                          }}
                          onSelectionChange={(val) => {
                            val ? form.setValue("country", val.toString()) : form.resetField("country"); form.resetField("region")
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
                  name="region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-card-foreground text-sm" >State <span className="text-muted-foreground italic">(optional).</span></FormLabel>
                      <FormControl>
                        <Autocomplete
                          defaultItems={State.getStatesOfCountry(countryCode)}
                          defaultFilter={myFilter}
                          size="sm"
                          isDisabled={!countryCode}
                          placeholder="Select a State"
                          aria-label="Select a State"
                          inputProps={{
                            classNames: { inputWrapper: "border" }
                          }}
                          defaultSelectedKey={stateCode && countryCode && State.getStateByCodeAndCountry(stateCode, countryCode)?.name}
                          onKeyDown={(e: any) => e.continuePropagation()}
                          onSelectionChange={(val) => {
                            val ? form.setValue("region", val.toString()) : form.resetField("region");
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
                      <FormLabel className="text-card-foreground text-sm w-full" >City <span className="text-muted-foreground italic">(optional).</span></FormLabel>
                      <FormControl>
                        <Autocomplete
                          defaultFilter={myFilter}
                          size="sm"
                          defaultItems={allCities}
                          inputProps={{
                            classNames: { inputWrapper: "border" }
                          }}
                          placeholder="Select a City"
                          aria-label="Select a City"
                          defaultSelectedKey={field.value && sortedCities.find((c) => c.name.includes(field.value ?? ""))?.name}
                          isDisabled={!form.getValues("country") || !form.getValues("region")}
                          onKeyDown={(e: any) => e.continuePropagation()}
                          onSelectionChange={(val) => {
                            if (val === null) return
                            val ? form.setValue("city", val.toString()) : form.resetField("city");
                          }}
                          {...field}
                        >
                          {city => (
                            <AutocompleteItem key={city.name} textValue={city.name} aria-label={city.name}>
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
                      <FormLabel className="text-card-foreground text-sm" >Area Zipcode <span className="text-muted-foreground italic">(optional).</span></FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          size="sm"
                          classNames={{ inputWrapper: "border" }}
                          isDisabled={!form.getValues("region")}
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
                  name="street"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel className="text-card-foreground text-sm" >Street <span className="text-muted-foreground italic">(optional).</span></FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          size="sm"
                          classNames={{ inputWrapper: "border" }}
                          placeholder="Street"
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
                    <FormItem >
                      <FormLabel className="text-card-foreground text-xs" >Address (house num, appartment) <span className="text-muted-foreground italic">(optional).</span></FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          size="sm"
                          classNames={{ inputWrapper: "border" }}
                          placeholder="Address"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Person Email <span className="text-muted-foreground italic">(optional).</span></FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          size="sm"
                          placeholder="Person Email"
                          classNames={{ inputWrapper: "border" }}
                          autoComplete="off"
                          startContent={
                            <Icons.MailIcon className="text-xl w-5 h-5 text-default-400 pointer-events-none flex-shrink-0" />
                          }
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Website <span className="text-muted-foreground italic">(optional).</span></FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          size="sm"
                          placeholder="adscrush.com"
                          autoComplete="off"
                          classNames={{ inputWrapper: "border" }}
                          startContent={
                            <div className="pointer-events-none flex items-center">
                              <Globe className="text-xl w-5 h-5 text-default-400 pointer-events-none flex-shrink-0 mr-2" />
                            </div>
                          }
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              </div>

              {/* product description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description Information <span className="text-muted-foreground italic">(optional).</span></FormLabel>
                    <FormControl>
                      <Textarea
                        aria-label="Description"
                        classNames={{ inputWrapper: "border" }}
                        placeholder="Enter description for addtional information"
                        className="col-span-12 md:col-span-6 mb-6 md:mb-0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="w-full sticky top-0 md:col-span-3 lg:col-span-2 md:!mt-0 flex flex-col gap-4 gap-y-6">
              <CardUi shadow="sm" isPressable onPress={() => console.log("item pressed")}>
                <CardBodyUi className="overflow-visible p-0">
                  <Image
                    shadow="sm"
                    radius="lg"
                    width="100%"
                    alt=""
                    className="w-full object-cover"
                    src="https://nextui-docs-v2.vercel.app/images/hero-card-complete.jpeg"
                  />
                </CardBodyUi>
                <CardFooterUi className="flex-col gap-2 justify-between p-4">
                  <div className="w-full flex flex-row  justify-between items-center">
                    <b className="text-base">{data?.campaign?.product?.name}</b>
                    <p className="text-default-500 font-semibold">{formatPrice(data?.campaign?.product?.price || 0)}</p>
                  </div>
                  <div className="w-full text-left">
                    <Chip size="sm">{PRODUCT_CATEGORIES.find((cat) => cat.value === data?.campaign?.product?.category)?.label}</Chip>
                    <p className="mt-2">{toSentenceCase(data?.campaign?.product?.description || "")}</p>
                  </div>
                </CardFooterUi>
              </CardUi>

            </div>
            <FormSuccess message={success} classname="col-span-3 !mt-0" />
            <FormError message={error} classname="col-span-3 !mt-0" />
            <Button type="submit" disabled={isPending} className={cn("w-full col-span-3 !mt-0")} >
              {isPending ? (
                <React.Fragment>
                  <Spinner /> Updating Lead...
                </React.Fragment>
              ) : (
                <React.Fragment>
                  Update Lead Details
                </React.Fragment>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )

}

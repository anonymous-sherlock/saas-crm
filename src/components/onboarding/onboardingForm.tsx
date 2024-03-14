"use client";
import { Icons } from "@/components/Icons";
import { FormError } from "@/components/global/form-error";
import { FormSuccess } from "@/components/global/form-success";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { catchError, cn } from "@/lib/utils";
import { CompanyDetailsSchema } from "@/schema/company.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Autocomplete, AutocompleteItem, Avatar, Input } from "@nextui-org/react";
import { ArrowRight, AtSign, Building, CircleUserRound, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Separator } from "../ui/separator";
import { Country, State, City } from "country-state-city";
import { addCompanyDetails } from "@/lib/actions/onboarding.action";
import { DEFAULT_DASHBOARD_REDIRECT } from "@routes";

type OnboardingFormProps = {
};

export function OnboardingForm({ }: OnboardingFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [countryCode, setCountryCode] = useState<string | undefined>("");
  const [stateCode, setStateCode] = useState<string | undefined>("");
  const [currentStep, setCurrentStep] = useState<number>(0);
  const STEPS_AMOUNT = 2
  const steps = ["Company Details", "Billing Details", "Business Location"]
  const [isPending, startTransition] = React.useTransition()
  const form = useForm<z.infer<typeof CompanyDetailsSchema>>({
    resolver: zodResolver(CompanyDetailsSchema),
    mode: "all",
    shouldUnregister: false,
    shouldFocusError: true,
    defaultValues: {
      name: "",
      phone: "",
      gstNumber: "",
      billingContactPersonEmail: "",
      billingContactPersonName: "",
      billingContactPersonPhone: "",
      address: "",
      contactPersonEmail: "",
      contactPersonName: "",
      country: "",
      state: "",
      city: "",
      landmark: "",
      zipcode: "",
    },
  });

  type FormFieldsName = (keyof z.infer<typeof CompanyDetailsSchema>)[]

  const handleStepCompletion = () => {
    setCurrentStep((cur) => Math.min(cur + 1, STEPS_AMOUNT));
  }
  const handleGoBackToPreviousStep = () => {
    setCurrentStep((cur) => Math.max(cur - 1, 0));
  }

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof CompanyDetailsSchema>) {
    startTransition(async () => {
      setError("");
      setSuccess("");
      try {
        await addCompanyDetails(values).then((data) => {
          if (data?.error) {
            setError(data.error)
            toast.error(data.error)
          }
          else if (data?.success) {
            setSuccess(data.success)
            toast.success(data.success)
            router.push(DEFAULT_DASHBOARD_REDIRECT)
          }
        })
      } catch (err) {
        catchError(err);
      }
    })
  }
  // 3. Custom Filter for Select Field
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
  const gradientColor = `linear-gradient(90deg, blue 0%, blue ${(currentStep / STEPS_AMOUNT) * 100}%, #DDE3EC ${(currentStep / STEPS_AMOUNT) * 100}%, #DDE3EC 100%)`;


  function isFieldTouched(fields: FormFieldsName): boolean {
    const schemaKeys = Object.keys(CompanyDetailsSchema.shape);
    return fields.every(fieldName => schemaKeys.includes(fieldName) && form.formState.touchedFields[fieldName]);
  }

  function isFieldValid(fields: FormFieldsName): boolean {
    const schemaKeys = Object.keys(CompanyDetailsSchema.shape);
    return fields.every(fieldName => schemaKeys.includes(fieldName) && !form.formState.errors[fieldName]);
  }


  const stepOneRequiredField: FormFieldsName = ["name", "phone", "contactPersonName", "contactPersonEmail", "gstNumber"]
  const stepTwwoRequiredField: FormFieldsName = ["billingContactPersonName", "billingContactPersonEmail"]

  return (
    <Card className="p-6 w-full max-w-3xl bg-white mx-auto">
      <CardHeader className="p-0 md:p-6">
        <div>
          <ul className="flex relative justify-between">
            {steps.map((step, index) => (
              <li key={step} className="flex relative z-20 text-center text-xs flex-col items-center gap-4 text-[#536387] md:text-[16px] font-semibold">
                <span className={cn("w-10 h-10 bg-[#DDE3EC] rounded-full shrink-0 flex justify-center text-xl items-center",
                  index <= currentStep && "active")}>{index + 1}
                </span>
                {step}
              </li>
            ))}
            <span className={cn("absolute left-0 right-0 top-[20%] h-2 w-[80%] mx-auto z-0 bg-[#DDE3EC]",)} style={{ background: gradientColor, transition: "background 0.7s ease" }}></span>
          </ul>
        </div>
      </CardHeader>
      <CardContent className="mt-2 w-full p-0">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            method="post"
            className="flex flex-col items-start space-y-4"
          >
            <div className="flex w-full flex-col ">
              <h3 className="text-xl font-semibold"> {steps[currentStep]}</h3>
              <Separator className="my-4" />
              <div className="flex flex-col md:grid grid-cols-2 gap-4 md:gap-6">
                {/* Comapny Details */}
                {currentStep === 0 &&
                  <>
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-card-foreground text-sm" >Company Name <span className="text-muted-foreground italic">(Type N/A if you are individual).</span></FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              size="sm"
                              variant="faded"
                              placeholder="Company Name"
                              startContent={
                                <Building className="text-xl w-5 h-5  text-default-400 pointer-events-none flex-shrink-0" />
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
                          <FormLabel className="text-card-foreground text-sm" >Company Phone Number</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              size="sm"
                              variant="faded"
                              placeholder="Company Phone"
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
                      name="contactPersonName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-card-foreground text-sm" >Contact Person Name</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              size="sm"
                              variant="faded"
                              placeholder="Contact Person Name"
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
                      name="contactPersonEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-card-foreground text-sm" >Contact Person Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              size="sm"
                              placeholder="Contact Person Email"
                              variant="faded"
                              startContent={
                                <AtSign className="text-xl w-5 h-5 text-default-400 pointer-events-none flex-shrink-0" />
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
                      name="gstNumber"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel className="text-card-foreground text-sm" >GST Number <span className="text-muted-foreground italic">(Type N/A if you are individual).</span></FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              size="sm"
                              variant="faded"
                              placeholder="GST Number"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                }

                {/* Billing Details */}
                {currentStep === 1 &&
                  <>
                    <FormField
                      control={form.control}
                      name="billingContactPersonName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-card-foreground text-sm" >Billing Contact Person Name</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              size="sm"
                              variant="faded"
                              placeholder="Billing Contact Person Name"
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
                      name="billingContactPersonEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-card-foreground text-sm" >Billing Contact Person Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              size="sm"
                              variant="faded"
                              placeholder="Billing Contact Person Email"
                              startContent={
                                <AtSign className="text-xl w-5 h-5 text-default-400 pointer-events-none flex-shrink-0" />
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
                      name="billingContactPersonPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-card-foreground text-sm" >Billing Contact Person Phone <span className="text-muted-foreground italic">(optional).</span></FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              size="sm"
                              variant="faded"
                              placeholder="Billing Contact Person Phone"
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
                  </>
                }

                {/* Business Location */}
                {currentStep === 2 &&
                  <>
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
                  </>
                }
              </div>

            </div>
            <FormSuccess message={success} />
            <FormError message={error} />
            <Separator className="my-6 bg-transparent" />
            {
              currentStep < STEPS_AMOUNT ?
                <div className="flex w-full gap-2 mt-4 justify-end">
                  {currentStep > 0 &&
                    <Button
                      type="button"
                      className={cn("ml-auto shrink-0")}
                      disabled={isPending || currentStep === 0}
                      variant="secondary"
                      onClick={handleGoBackToPreviousStep}
                    >Back
                    </Button>
                  }
                  <Button
                    type="button"
                    className={cn("shrink-0 flex items-center")}
                    disabled={
                      isPending ||
                      (currentStep === 0 && !isFieldTouched(stepOneRequiredField)) ||
                      (currentStep === 0 && !isFieldValid(stepOneRequiredField)) ||
                      (currentStep === 1 && !isFieldTouched(stepTwwoRequiredField)) ||
                      (currentStep === 1 && !isFieldValid(stepTwwoRequiredField)) ||
                      (currentStep === 2 && !form.formState.isValid) ||
                      currentStep >= STEPS_AMOUNT
                    }
                    onClick={(e) => {
                      if (currentStep < STEPS_AMOUNT) {
                        e.preventDefault()
                      }
                      handleStepCompletion();
                    }}
                  >Next Step <ArrowRight className="w-5 h-5 ml-1" />
                  </Button>
                </div>
                :
                <div className="flex w-full gap-2 mt-4">
                  <Button
                    type="button"
                    className={cn("ml-auto shrink-0")}
                    disabled={isPending}
                    variant="secondary"
                    onClick={handleGoBackToPreviousStep}
                  >Back
                  </Button>

                  <Button
                    type="submit"
                    autoSave="false"
                    className={cn("shrink-0")}
                    disabled={isPending || currentStep < STEPS_AMOUNT || !form.formState.isValid}
                  >
                    {isPending && (
                      <Icons.spinner
                        className="mr-2 h-4 w-4 animate-spin"
                        aria-hidden="true"
                      />
                    )}
                    Continue
                  </Button>
                </div>
            }
          </form>
        </Form>
      </CardContent>
    </Card>

  );
}

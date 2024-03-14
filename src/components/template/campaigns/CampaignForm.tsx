"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardTitle } from "../../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/form";

import { trpc } from "@/app/_trpc/client";
import { cn } from "@/lib/utils";
import { campaignFormSchema } from "@/schema/campaign.schema";
import { useRouter } from "next/navigation";
import { toast as hotToast } from "react-hot-toast";
import { z } from "zod";
import { Button } from "@/ui/button";
import { Input as NextInput, Select as NextSelect, SelectItem as NextSelectItem, Textarea as NextTextarea } from "@nextui-org/react";
import { Campaign, Gender, Product, TargetRegion, TrafficSource } from "@prisma/client";
import Spinner from "../../ui/spinner";
import AgeFields from "./AgeFields";
import CountryRegion from "./CountryRegion";
import ProductDropdown from "./ProductDropdown";
import WorkingHours from "./WorkingHours";
import { FormSuccess } from "@/components/global/form-success";
import { FormError } from "@/components/global/form-error";
import React, { useState } from "react";
import { upsertCampaignDetails } from "@/lib/actions/campaign.action";

interface CampaignFormProps {
  data?: Partial<Campaign & {
    targetRegion: TargetRegion[]
    product: Product | null
  }>
  title: string,
  description?: string
  type: "create" | "update"
}

const CampaignForm = ({ data, type, title }: CampaignFormProps) => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const router = useRouter()
  const utils = trpc.useUtils();
  const [isPending, startTransition] = React.useTransition()

  // Default Form details
  const defaultTrafficSource = data?.trafficSource ? data.trafficSource : TrafficSource.Social;
  const defaultTargetRegion = data?.targetRegion ? data?.targetRegion.map((reg) => reg.regionName) : []
  const parsedAge = campaignFormSchema.shape.targetAge.safeParse(data?.targetAge)
  const parsedWorkingHours = campaignFormSchema.shape.workingHours.safeParse(data?.workingHours)
  const parsedWorkingDays = campaignFormSchema.shape.workingDays.safeParse(data?.workingDays)
  const form = useForm<z.infer<typeof campaignFormSchema>>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: {
      campaignName: data?.name || "",
      campaignDescription: data?.description || "",
      trafficSource: defaultTrafficSource,
      targetCountry: data?.targetCountry,
      productId: data?.productId || "",
      leadsRequirements: data?.leadsRequirements || "",
      callCenterTeamSize: data?.callCenterTeamSize || "",
      workingDays: parsedWorkingDays.success ? parsedWorkingDays.data : [],
      workingHours: {
        startTime: parsedWorkingHours.success ? parsedWorkingHours.data.startTime : "",
        endTime: parsedWorkingHours.success ? parsedWorkingHours.data.endTime : "",
      },
      targetAge: {
        min: parsedAge.success ? parsedAge.data.min : "",
        max: parsedAge.success ? parsedAge.data.max : "",
      },
      targetRegion: defaultTargetRegion,
      targetGender: data?.targetGender || "Both"
    },
  });

  function getMessagesByType(type: "create" | "update") {
    switch (type) {
      case "create":
        return {
          loading: 'Creating campaign...',
          success: "Campaign created successfully!",
          error: "Could not create campaign.",
        };
      case "update":
        return {
          loading: 'Updating campaign...',
          success: "Campaign updated successfully!",
          error: "Could not update campaign.",
        };
      default:
        throw new Error("Invalid campaign type");
    }
  }

  async function onSubmit(values: z.infer<typeof campaignFormSchema>) {
    const { loading, success, error } = getMessagesByType(type);

    startTransition(async () => {
      hotToast.promise(
        upsertCampaignDetails({ data: values, campaignId: data?.id, type }).then((data) => {
          if (data?.success) {
            setSuccess(data.success)
            utils.campaign.getAll.invalidate()
            form.reset()
            router.push(`/campaigns/${data.campaign.id}`)
          }
          else if (data?.error) {
            setError(data.error)
          }
        }),
        {
          loading,
          success,
          error,
        }
      );
    })
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
                  name="campaignName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campaign Name</FormLabel>
                      <FormControl>
                        <NextInput type="text" aria-label="Campaign Name" size="sm"
                          placeholder="Nutra Bay Campaign" variant="faded"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Daily leads Requirements */}
                <FormField
                  control={form.control}
                  name="leadsRequirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Daily Leads Requirements</FormLabel>
                      <FormControl>
                        <NextInput type="text" aria-label="Daily Leads Requirements" size="sm"
                          placeholder="250" variant="faded"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Call Center Team Size */}
                <FormField
                  control={form.control}
                  name="callCenterTeamSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Call Center Team Size</FormLabel>
                      <FormControl>
                        <NextInput type="text" aria-label="Call Center Team Size" size="sm"
                          placeholder="25" variant="faded"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* traffic source */}
                <FormField
                  control={form.control}
                  name="trafficSource"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Traffic Source</FormLabel>
                      <NextSelect
                        isRequired
                        aria-label="Select a Traffic Source"
                        placeholder="Traffic Source"
                        className="w-full"
                        variant="faded"
                        defaultSelectedKeys={[field.value]}
                        size="sm"
                        {...field}
                      >
                        {Object.entries(TrafficSource).map(([key, value]) => (
                          <NextSelectItem key={value} value={value}>
                            {value}
                          </NextSelectItem>
                        ))}
                      </NextSelect>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* target country  */}
                <CountryRegion />

                {/* target gender */}
                <FormField
                  control={form.control}
                  name="targetGender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Gender</FormLabel>
                      <FormControl>
                        <NextSelect
                          isRequired
                          aria-label="Select a target Gender"
                          placeholder="Select a Target Gender"
                          className="w-full"
                          variant="faded"
                          defaultSelectedKeys={[field.value]}
                          size="sm"
                          {...field}
                        >
                          {Object.entries(Gender).map(([key, value]) => (
                            <NextSelectItem key={value} value={value} >
                              {value}
                            </NextSelectItem>
                          ))}
                        </NextSelect>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* target age field */}

                <AgeFields />

              </div>

              {/* product description */}
              <FormField
                control={form.control}
                name="campaignDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campaign Description</FormLabel>
                    <FormControl>
                      <NextTextarea
                        variant="faded"
                        aria-label="Description"
                        labelPlacement="outside"
                        placeholder="Enter your description"
                        className="col-span-12 md:col-span-6 mb-6 md:mb-0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="w-full md:col-span-3 lg:col-span-2 md:!mt-0 flex flex-col gap-4 gap-y-6">
              {/* Working Hours */}
              <WorkingHours />
              <FormField
                control={form.control}
                name="productId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select a Product</FormLabel>
                    <FormControl>
                      <ProductDropdown />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormSuccess message={success} classname="col-span-3 !mt-0" />
            <FormError message={error} classname="col-span-3 !mt-0" />
            <Button type="submit" disabled={isPending} className={cn("w-full col-span-3 !mt-0")} >
              {isPending ? (
                <React.Fragment>
                  {type === "create" ?
                    <>  <Spinner /> Creating Campaign...</> : <>  <Spinner /> Updating Campaign...</>
                  }
                </React.Fragment>
              ) : (
                <>
                  {type === "create" ? "Create Campaign" : "Update Campaign"}
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CampaignForm;
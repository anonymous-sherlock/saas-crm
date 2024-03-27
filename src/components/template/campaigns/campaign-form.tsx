"use client";
import { trpc } from "@/app/_trpc/client";
import { FormError } from "@/components/global/form-error";
import { FormSuccess } from "@/components/global/form-success";
import { upsertCampaignDetails } from "@/lib/actions/campaign.action";
import { revalidatePage } from "@/lib/actions/revalidate.action";
import { cn } from "@/lib/utils";
import { useModal } from "@/providers/modal-provider";
import { campaignFormSchema } from "@/schema/campaign.schema";
import { Button } from "@/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/ui/form";
import Spinner from "@/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input as NextInput, Select as NextSelect, SelectItem as NextSelectItem, Textarea as NextTextarea } from "@nextui-org/react";
import { Campaign, Gender, Product, TargetRegion, TrafficSource } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast as hotToast } from "react-hot-toast";
import { z } from "zod";
import { AgeFields } from "./AgeFields";
import { CountryRegion } from "./country-region";
import { ProductDropdown } from "./product-dropdown";
import WorkingHours from "./WorkingHours";

interface CampaignFormProps {
  data?: Partial<
    Campaign & {
      targetRegion: TargetRegion[];
      product: Product | null;
    }
  >;
  user: {
    id: string;
    name: string;
  };
  type: "create" | "update";
}

export const CampaignForm = ({ data, type, user }: CampaignFormProps) => {
  const { isOpen: isModalOpen, setClose: setCloseModal } = useModal();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const router = useRouter();
  const utils = trpc.useUtils();
  const [isPending, startTransition] = React.useTransition();
  // Default Form details
  const defaultTrafficSource = data?.trafficSource ? data.trafficSource : TrafficSource.Social;
  const defaultTargetRegion = data?.targetRegion ? data?.targetRegion.map((reg) => reg.regionName) : [];
  const parsedAge = campaignFormSchema.shape.targetAge.safeParse(data?.targetAge);
  const parsedWorkingHours = campaignFormSchema.shape.workingHours.safeParse(data?.workingHours);
  const parsedWorkingDays = campaignFormSchema.shape.workingDays.safeParse(data?.workingDays);
  const defaultFormValues = {
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
    targetGender: data?.targetGender || "Both",
  };
  const form = useForm<z.infer<typeof campaignFormSchema>>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: defaultFormValues,
  });

  function getMessagesByType(type: "create" | "update") {
    switch (type) {
      case "create":
        return {
          loading: "Creating campaign...",
          success: "Campaign created successfully!",
          error: "Could not create campaign.",
        };
      case "update":
        return {
          loading: "Updating campaign...",
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
        upsertCampaignDetails({ data: values, campaignId: data?.id, type, userId: user.id }).then(async (data) => {
          if (data?.success) {
            setSuccess(data.success);
            utils.campaign.getAll.invalidate();
            utils.campaign.get.invalidate();
            await revalidatePage("/");
            form.reset();
            router.refresh();
            setCloseModal();
            if (!isModalOpen) {
              router.push(`/campaigns/${data.campaign.id}`);
            }
          } else if (data?.error) {
            setError(data.error);
          }
        }),
        {
          loading,
          success,
          error,
        },
      );
    });
  }
  const isFormUnchanged = JSON.stringify(defaultFormValues) === JSON.stringify(form.watch());

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} method="post" className="flex flex-col md:grid sm:grid-cols-1 lg:grid-cols-5 items-start md:gap-8 space-y-4 ">
        <div className="md:col-span-3 flex w-full flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 gap-y-6">
            <FormField
              control={form.control}
              name="campaignName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Name</FormLabel>
                  <FormControl>
                    <NextInput type="text" aria-label="Campaign Name" size="sm" placeholder="Nutra Bay Campaign" variant="faded" {...field} />
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
                    <NextInput type="text" aria-label="Daily Leads Requirements" size="sm" placeholder="250" variant="faded" {...field} />
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
                    <NextInput type="text" aria-label="Call Center Team Size" size="sm" placeholder="25" variant="faded" {...field} />
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
                        <NextSelectItem key={value} value={value}>
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
                  <ProductDropdown user={user} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormSuccess message={success} classname="col-span-3 !mt-0" />
        <FormError message={error} classname="col-span-3 !mt-0" />
        <Button type="submit" disabled={isFormUnchanged || isPending} className={cn("w-full col-span-3 !mt-0")}>
          {isPending ? (
            <React.Fragment>
              {type === "create" ? (
                <>
                  <Spinner /> Creating...
                </>
              ) : (
                <>
                  <Spinner /> Updating...
                </>
              )}
            </React.Fragment>
          ) : (
            <>{type === "create" ? "Create Campaign" : "Update Campaign"}</>
          )}
        </Button>
      </form>
    </Form>
  );
};


"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardTitle } from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

import { z } from "zod";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { toast as hotToast } from "react-hot-toast"
import { trpc } from "@/app/_trpc/client";
import { cn } from "@/lib/utils";
import {
  TrafficSourceDefault,
  campaignFormSchema
} from "@/schema/campaignSchema";
import { AxiosError } from "axios";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import Spinner from "../ui/spinner";
import { toast } from "../ui/use-toast";
import AgeFields from "./AgeFields";
import CountryRegion from "./CountryRegion";
import ProductDropdown from "./ProductDropdown";
import WorkingHours from "./WorkingHours";
import { useRouter } from "next/navigation";

const CampaignForm = () => {
  const form = useForm<z.infer<typeof campaignFormSchema>>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: {
      campaignName: "",
      campaignDescription: "",
      trafficSource: TrafficSourceDefault.Social,
      targetCountry: "",
      product: "",
      leadsRequirements: "",
      callCenterTeamSize: "",
      workingDays: {
        start: "",
        end: "",
      },
      workingHours: {
        startTime: "",
        endTime: "",
      },
      targetAge: {
        min: "",
        max: "",
      },
      targetRegion: [],
    },
  });

  const router = useRouter()
  const utils = trpc.useUtils();
  const {
    mutateAsync: createCampaign,
    isLoading,
  } = trpc.campaign.create.useMutation({

    onSuccess: (data) => {
      utils.campaign.getAll.invalidate()
      form.reset()
      router.push(`/campaigns/${data.campaign.id}`)
    },
  });
  async function onSubmit(values: z.infer<typeof campaignFormSchema>) {

    hotToast.promise(
      createCampaign({ campaign: values }),
      {
        loading: 'Creating campaign...',
        success: "Campaign created successfully!",
        error: "Could not create campaign.",
      }
    );
  }

  return (
    <Card className="bg-white p-6">
      <CardTitle>Create a Campaign</CardTitle>
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
                        <Input
                          placeholder="Nutra Bay Campaign"
                          {...field}
                          className="h-11"
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
                        <Input placeholder="250" {...field} className="h-11" />
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
                        <Input placeholder="24" {...field} className="h-11" />
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
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full h-11">
                            <SelectValue placeholder="Select a Traffic Source" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Select a Traffic Source</SelectLabel>
                            <Separator className="my-2" />
                            {Object.entries(TrafficSourceDefault).map(
                              ([key, value]) => (
                                <SelectItem key={key} value={value}>
                                  {value}
                                </SelectItem>
                              )
                            )}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
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
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl className="capitalize">
                          <SelectTrigger className="w-full capitalize h-11">
                            <SelectValue
                              placeholder="Select a target Gender"
                              className="lowercase"
                            />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Target Gender</SelectLabel>
                            <Separator className="my-2" />
                            {["Male", "Female"].map((value) => (
                              <SelectItem
                                key={value}
                                value={value}
                                className="capitalize"
                              >
                                {value}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
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
                      <Textarea
                        placeholder="Campaign Description."
                        {...field}
                        className={cn("h-36")}
                        minRows={5}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className=" w-full md:col-span-3 lg:col-span-2  flex flex-col gap-4 gap-y-6">
              {/* Working Hours */}
              <WorkingHours />
              <FormField
                control={form.control}
                name="product"
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
            <Button
              type="submit"
              disabled={isLoading}
              className={cn("w-full  col-span-3")}
            >
              {isLoading ? (
                <>
                  <Spinner /> Creating Campaign...
                </>
              ) : (
                "Create Campaign"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CampaignForm;
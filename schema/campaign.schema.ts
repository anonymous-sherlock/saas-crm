import { isValidDay } from "@/lib/helpers/date";
import { TrafficSource } from "@prisma/client";
import { z } from "zod";


export const campaignFormSchema = z.object({
  campaignName: z.string().min(1, { message: "Campaign name is required." }).min(3, {
    message: "Campaign name must be at least 3 characters.",
  }),
  campaignDescription: z.string().optional(),
  // Leads Requirement
  leadsRequirements: z
    .string()
    .min(1, { message: "Daily leads requirements are required." })
    .refine((value) => /^\d+$/.test(value), {
      message: "Daily leads requirements must be a valid number.",
    }),

  productId: z.string({ required_error: "Product is required to create a campaign." }).min(1, {
    message: "Product is required to create a campaign.",
  }),
  // working Hours
  workingHours: z.object({
    startTime: z.string().min(1, {
      message: "Start time is required.",
    }),
    endTime: z.string().min(1, {
      message: "End time is required.",
    }),
  }),
  workingDays: z.array(z.string().refine(isValidDay, { message: "Invalid day" })),
  // Call Center Team size
  callCenterTeamSize: z
    .string()
    .min(1, { message: "Call center team size is required." })
    .refine((value) => value !== "0", {
      message: "Call center team size cannot be empty or 0.",
    })
    .refine((value) => /^\d+$/.test(value), {
      message: "Call center team size must be a valid number.",
    }),

  // Country Region
  targetCountry: z.string().min(1, {
    message: "Target country is required.",
  }),
  // target region
  targetRegion: z.string().array()
    .nonempty({
      message: "Target region is required.",
    }),

  // Target Age
  targetAge: z.object({
    min: z
      .string()
      .min(1, { message: "Minimum age is required." })

      .refine(
        (value) => {
          const parsedValue = parseInt(value, 10);
          return !isNaN(parsedValue) && parsedValue >= 18 && parsedValue <= 65;
        },
        { message: "Minimum age must be between 18 and 65." },
      ),
    max: z
      .string()
      .min(1, { message: "Maximum age is required." })
      .refine(
        (value) => {
          const parsedValue = parseInt(value, 10);
          return !isNaN(parsedValue) && parsedValue >= 18 && parsedValue <= 65;
        },
        { message: "Maximum age must be between 18 and 65." },
      ),
  }),
  targetGender: z.enum(["Male", "Female", "Both"], { required_error: "Target gender is required", invalid_type_error: "Target gender can be Male or Female" }),
  trafficSource: z.nativeEnum(TrafficSource),
});

export type CampaignFormPayload = z.infer<typeof campaignFormSchema>;
export type CampaignFormType = z.infer<typeof campaignFormSchema>;

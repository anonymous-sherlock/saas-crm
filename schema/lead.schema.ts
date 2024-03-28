import { z } from "zod";


const phoneSchema = z.string({ required_error: "Phone is required" }).refine(
  (value) => {
    // Enhance the phone number validation pattern
    const phonePattern = /^[\d\+() -]*\d[\d\+() -]*$/;
    // Ensure the phone number has a minimum length (adjust as needed)
    const minLength = 9;
    const maxLength = 15;
    return phonePattern.test(value?.toString() ?? "") && (value?.toString().replace(/[\D]/g, "").length ?? 0) >= minLength && (value?.toString().replace(/[\D]/g, "").length ?? 0) <= maxLength;
  },
  { message: "Phone number is not valid", },
)
export const AddLeadFormSchema = z.object({
  campaignId: z.string(),
  name: z.string().min(3, { message: "Name must be atleat 3 characters" }),
  phone: phoneSchema,
  address: z.string().optional(),
});

export const LeadValidator = z.object({
  campaignCode: z.string().min(1, {
    message: "Campaign Code is required",
  }),
  data: z.object({
    name: z
      .string({
        invalid_type_error: "Invalid type for name, should be a string",
      })
      .min(1, { message: "Name is required" }),
    phone: phoneSchema,
    address: z.string().optional(),
  }),
});

export const LeadSchema = z.object({
  name: z.string(),
  phone: phoneSchema,
  address: z.string().optional(),
  email: z.string().optional(),
  description: z.string().optional(),
  country: z.string().optional(),
  region: z.string().optional(),
  city: z.string().optional(),
  street: z.string().optional(),
  zipcode: z.string().optional(),
  website: z.string().optional(),
});

type CustomCSVLeadType = LeadSchemaType & {
  campaign_code: string;
};
export const CSVLeadsColumnMapping: { label: string; value: keyof CustomCSVLeadType }[] = [
  { label: "Campaign Code", value: "campaign_code" },
  { label: "Name", value: "name" },
  { label: "Phone", value: "phone" },
  { label: "Address", value: "address" },
  { label: "Country", value: "country" },
  { label: "Region", value: "region" },
  { label: "City", value: "city" },
  { label: "Zipcode", value: "zipcode" },
  { label: "Street", value: "street" },
  { label: "Website", value: "website" },
  { label: "Email", value: "email" },
  { label: "Description", value: "description" },
];


export type LeadSchemaType = z.infer<typeof LeadSchema>;
export type LeadsPayload = z.infer<typeof LeadValidator>;
export type AddLeadFormType = z.infer<typeof AddLeadFormSchema>;

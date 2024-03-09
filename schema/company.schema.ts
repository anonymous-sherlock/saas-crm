import { z } from "zod";

export const CompanyDetailsSchema = z.object({
    name: z.string().min(1, "Required"),
    phone: z.string().min(1, "Required"),
    contactPersonName: z.string().min(1, "Required"),
    contactPersonEmail: z.string().min(1, "Required").email("Invalid email"),
    gstNumber: z.string().min(1, "Required").optional(),
    billingContactPersonName: z.string().min(1, "Required"),
    billingContactPersonEmail: z.string().min(1, "Required").email("Invalid email"),
    billingContactPersonPhone: z.string().optional(),
    country: z.string().min(1, "Required"),
    state: z.string().min(1, "Required"),
    city: z.string().min(1, "Required"),
    zipcode: z.string().min(1, "Required").max(6, "Invalid zip code").refine((val) => {
        const isNumber = /^\d+$/.test(val);
        return isNumber;
    }, { message: "Zip code must be a number" }),
    landmark: z.string().min(1, "Required"),
    address: z.string().min(1, "Required"),
})


export type CompanyDetailsType = z.infer<typeof CompanyDetailsSchema>;
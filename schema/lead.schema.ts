import { Lead } from "@prisma/client";
import { z } from "zod";

export const LeadsFormSchema = z.object({
    campaignCode: z.string(),
    name: z.string().min(3, { message: "Name must be atleat 3 characters" }),
    phone: z.string(
        { required_error: "Phone is required", invalid_type_error: "Invalid type for phone, should be a string" }
    ).refine(value => {
        // Enhance the phone number validation pattern
        const phonePattern = /^[\d\+() -]*\d[\d\+() -]*$/;

        // Ensure the phone number has a minimum length (adjust as needed)
        const minLength = 9;
        const maxLength = 13;
        return (
            phonePattern.test(value?.toString() ?? "") &&
            (value?.toString().replace(/[\D]/g, '').length ?? 0) >= minLength &&
            (value?.toString().replace(/[\D]/g, '').length ?? 0) <= maxLength
        )
    }, {
        message: "Phone number is not valid"
    }),
    address: z.string().optional()
})

export const LeadValidator = z.object({
    campaignCode: z.string().min(1, {
        message: "Campaign Code is required"
    }),
    data: z.object({
        name: z.string({
            invalid_type_error: "Invalid type for name, should be a string"
        }).min(1, { message: "Name is required" }),
        phone: LeadsFormSchema.shape.phone,
        address: z.string().optional(),
    })

})

export const LeadSchema = z.object({
    name: z.string(),
    phone: z.string(),
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


export type LeadSchemaType = z.infer<typeof LeadSchema>
export type LeadsPayload = z.infer<typeof LeadValidator>


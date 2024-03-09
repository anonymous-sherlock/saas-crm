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
import { Input } from '@nextui-org/react';
import { Company } from '@prisma/client';
import { AtSign, Building, CircleUserRound, Phone } from 'lucide-react';
import React, { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from "sonner";


interface CompanyDetailsFormProps {
    data?: Pick<Company, "id" | "name" | "phone" | "contactPersonEmail" | "contactPersonName" | "gstNumber">
}

const pickedDetailsSchema = CompanyDetailsSchema.pick({
    name: true,
    phone: true,
    contactPersonName: true,
    contactPersonEmail: true,
    gstNumber: true
});

const CompanyDetailsForm: FC<CompanyDetailsFormProps> = ({ data }) => {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = React.useTransition();

    const form = useForm<z.infer<typeof pickedDetailsSchema>>({
        resolver: zodResolver(pickedDetailsSchema),
        defaultValues: {
            name: data?.name || "",
            phone: data?.phone || "",
            contactPersonName: data?.contactPersonName || "",
            contactPersonEmail: data?.contactPersonEmail || "",
            gstNumber: data?.gstNumber || "",
        },
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
    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} method="post" className="flex flex-col items-start space-y-4 w-full" >
                    <div className="flex flex-col md:grid grid-cols-2 gap-4 md:gap-6 w-full">
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

export default CompanyDetailsForm
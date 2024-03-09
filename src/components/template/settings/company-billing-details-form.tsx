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
import { AtSign, CircleUserRound, Phone } from 'lucide-react';
import React, { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from "sonner";
import { z } from 'zod';


interface CompanyDetailsFormProps {
  data?: Pick<Company, "billingContactPersonName" | "billingContactPersonEmail" | "billingContactPersonPhone">
}

const pickedDetailsSchema = CompanyDetailsSchema.pick({
  billingContactPersonName: true,
  billingContactPersonEmail: true,
  billingContactPersonPhone: true
});

const CompanyBillingDetailsForm: FC<CompanyDetailsFormProps> = ({ data }) => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<z.infer<typeof pickedDetailsSchema>>({
    resolver: zodResolver(pickedDetailsSchema),
    defaultValues: {
      billingContactPersonName: data?.billingContactPersonName,
      billingContactPersonEmail: data?.billingContactPersonEmail,
      billingContactPersonPhone: data?.billingContactPersonPhone || ""
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
        <form onSubmit={form.handleSubmit(onSubmit)} method="post" className="flex flex-col items-start space-y-4 md:space-y-5 w-full" >
          <div className="flex flex-col md:grid grid-cols-2 gap-4 md:gap-6 w-full">
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

export default CompanyBillingDetailsForm
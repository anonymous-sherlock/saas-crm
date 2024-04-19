"use client";
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { FormSuccess } from "../global/form-success";
import { FormError } from "../global/form-error";
import { Button } from "../ui/button";
import { Input, Select, SelectItem, Spinner } from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import { WalletBalanceSchemaType, walletBalanceSchema } from "@/schema/wallet.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { Payment_Type } from "@prisma/client";
import { updateWalletBalance } from "@/lib/actions/wallet.action";
import { toast } from "sonner";

interface AddWalletBalanceFormProps {
  userId: string;
}
export const AddWalletBalanceForm = ({ userId }: AddWalletBalanceFormProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = React.useTransition();

  async function onSubmit(values: WalletBalanceSchemaType) {
    setError("");
    setSuccess("");
    startTransition(async () => {
      await updateWalletBalance({
        ...values,
        userId: userId,
      }).then((data) => {
        if (data?.error) {
          setError(data.error);
          toast.error(data.error);
        } else if (data?.success) {
          setSuccess(data.success);
          toast.success(data.success);
          router.refresh();
        }
      });
    });
  }
  const form = useForm<WalletBalanceSchemaType>({
    resolver: zodResolver(walletBalanceSchema),
    mode: "all",
    defaultValues: {
      amount: "",
      type: "CREDIT",
    },
  });

  return (
    <Card className="bg-white mb-6">
      <CardHeader>
        <CardTitle>Add Wallet Balance</CardTitle>
        <CardDescription>View and manage user wallet.</CardDescription>
        <Separator className="mt-4" />
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            method="post"
            className="flex flex-col md:grid sm:grid-cols-1 lg:grid-cols-5 items-start md:gap-8 space-y-4 "
          >
            <div className="md:col-span-3 flex w-full flex-col gap-6">
              <div className="flex flex-col md:grid grid-cols-1 sm:grid-cols-2 gap-4 gap-y-6">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input type="text" size="sm" placeholder="500" classNames={{ inputWrapper: "border data-[hover=true]:bg-default-100" }} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Type</FormLabel>
                      <FormControl>
                        <Select
                          isRequired
                          aria-label="Select a payment type"
                          placeholder="Select a payment type"
                          className="w-full"
                          defaultSelectedKeys={[field.value]}
                          size="sm"
                          classNames={{
                            trigger: "border data-[hover=true]:bg-default-100",
                          }}
                          {...field}
                        >
                          {Object.values(Payment_Type).map((type) => (
                            <SelectItem key={type} value={type}>
                              {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
                            </SelectItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <FormSuccess message={success} classname="col-span-3 !mt-0" />
            <FormError message={error} classname="col-span-3 !mt-0" />
            <Button type="submit" disabled={isPending} className={cn("w-full col-span-3 !mt-0")}>
              {isPending ? <Spinner size="sm" color="default" /> : "Update Balance"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

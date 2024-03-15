"use client"
import { cn } from '@/lib/utils'
import { UserFormSchema, UserFormSchemaType } from '@/schema/user.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input, Select, SelectItem } from '@nextui-org/react'
import { Role, User } from '@prisma/client'
import { useRouter } from 'next/navigation'
import React, { FC, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FormError } from '../global/form-error'
import { FormSuccess } from '../global/form-success'
import { Button } from '../ui/button'
import { Card, CardContent, CardTitle } from '../ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import Spinner from '../ui/spinner'

interface EditUserDetailsFormProps {
  data?: Partial<User>
  title: string,
  description?: string
}

const EditUserDetailsForm: FC<EditUserDetailsFormProps> = ({ title, data }: EditUserDetailsFormProps) => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()
  const form = useForm<UserFormSchemaType>({
    resolver: zodResolver(UserFormSchema),
    defaultValues: {
      name: data?.name || "",
      email: data?.email || "",
      role: data?.role || "CUSTOMER",
      image: data?.image || "",
      active: data?.active || false,
      
    },
  });

  async function onSubmit(values: UserFormSchemaType) {
    console.log(values)
  }
  return (
    <Card className="bg-white p-6">
      <CardTitle>{title}</CardTitle>
      <CardContent className="mt-8 w-full p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} method="post"
          className="flex flex-col md:grid sm:grid-cols-1 lg:grid-cols-5 items-start md:gap-8 space-y-4 ">
          <div className="md:col-span-3 flex w-full flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 gap-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Name</FormLabel>
                    <FormControl>
                      <Input type="text" aria-label="User Name" size="sm"
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Email</FormLabel>
                    <FormControl>
                      <Input type="email" aria-label="User Email" size="sm"
                        placeholder="250" variant="faded"
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
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Role</FormLabel>
                    <Select
                      isRequired
                      aria-label="Select a User Role"
                      placeholder="User Role"
                      className="w-full"
                      variant="faded"
                      defaultSelectedKeys={[field.value]}
                      size="sm"
                      {...field}
                    >
                      {Object.entries(Role).map(([key, value]) => (
                        <SelectItem key={value} value={value}>
                          {value}
                        </SelectItem>
                      ))}
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />



            </div>

          </div>

          <div className="w-full md:col-span-3 lg:col-span-2 md:!mt-0 flex flex-col gap-4 gap-y-6">


          </div>

          <FormSuccess message={success} classname="col-span-3 !mt-0" />
          <FormError message={error} classname="col-span-3 !mt-0" />
          <Button type="submit" disabled={isPending} className={cn("w-full col-span-3 !mt-0")} >
            {isPending ? (
              <React.Fragment>
                <Spinner /> Updating User...
              </React.Fragment>
            ) : (
              <>
                Update User
              </>
            )}
          </Button>
        </form>
      </Form>
    </CardContent>
    </Card >)
}

export default EditUserDetailsForm
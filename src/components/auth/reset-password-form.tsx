"use client"

import { useRouter } from "next/navigation"
import * as React from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type { z } from "zod"



import { Icons } from "@/components/Icons"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { checkEmailSchema } from "@/schema/authFormSchema"
import { trpc } from "@/app/_trpc/client"
import { toast } from "react-hot-toast"

type Inputs = z.infer<typeof checkEmailSchema>
export function ResetPasswordForm() {
  const router = useRouter()
  const { mutate: sendResetPassword, isLoading } = trpc.auth.resetPassword.useMutation({
    onError(error) {
      toast.error(error.message)
    },
    onSuccess(data) {
      router.refresh()
      toast.success(data.message)
    }
  })
  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(checkEmailSchema),
    defaultValues: {
      email: "",
    },
  })

  function onSubmit(data: Inputs) {
    sendResetPassword(data)
  }

  return (
    <Form {...form}>
      <form
        className="grid gap-4"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="rodneymullen180@gmail.com" {...field} className="mt-2 h-12 w-full rounded-lg border bg-gray-50 px-4 py-3 ring-primary focus:outline-none focus:ring-1" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isLoading} className="text-md h-11 flex w-full items-center justify-center rounded-lg px-4 font-semibold
            text-white hover:bg-indigo-900 focus:bg-indigo-400 bg-[#112164]">
          {isLoading && (
            <Icons.spinner
              className="mr-2 h-4 w-4 animate-spin"
              aria-hidden="true"
            />
          )}
          Continue
          <span className="sr-only">
            Continue to reset password verification
          </span>
        </Button>
      </form>
    </Form>
  )
}
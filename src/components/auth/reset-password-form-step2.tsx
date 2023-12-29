"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import type { z } from "zod"

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
import { Icons } from "@/components/Icons"
import { PasswordInput } from "./password-input"
import { resetPasswordSchema } from "@/schema/authFormSchema"
import { trpc } from "@/app/_trpc/client"

type Inputs = z.infer<typeof resetPasswordSchema>

export function ResetPasswordStep2Form() {
  const router = useRouter()
  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
      code: "",
    },
  })

  const { mutate: changePassword, isLoading } = trpc.auth.changePassword.useMutation({
    onError(error) {
      toast.error(error.message)
    },
    onSuccess(data) {
      form.reset()
      router.push("/login")
      toast.success(data.message)
    }
  })

  function onSubmit(data: Inputs) {
    changePassword(data)
  }

  return (
    <Form {...form}>
      <form
        className="grid gap-4"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="*********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="*********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code</FormLabel>
              <FormControl>
                <Input
                  placeholder="sparo-ndigo-amurt-secan"
                  {...field}
                  onChange={(e) => {
                    e.target.value = e.target.value.trim()
                    field.onChange(e)
                  }}
                />
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
          Reset password
          <span className="sr-only">Reset password</span>
        </Button>
      </form>
    </Form>
  )
}
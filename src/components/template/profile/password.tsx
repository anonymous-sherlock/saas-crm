"use client"
import { PasswordInput } from '@/components/global/password-input'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'

const validationSchema = z.object({
    password: z.string().min(1, { message: 'Password Required' }),
    newPassword: z
        .string()
        .min(8, { message: 'Too Short!' })
        .regex(/^[A-Za-z0-9_-]*$/, {
            message: 'Only Letters & Numbers Allowed',
        }),
    confirmNewPassword: z.string().refine(data => data === data || data === '', {
        message: 'Password not match',
        path: ["confirmNewPassword"]
    }),
});

const Password = () => {
    const form = useForm<z.infer<typeof validationSchema>>({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            password: "", newPassword: "", confirmNewPassword: ""
        }
    })

    // 2. Define a submit handler.
    const onSubmit = async (data: z.infer<typeof validationSchema>) => {
        console.log(data)
    };

    return (
        <>
            <Form  {...form} >
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {/* Password */}
                    <div className="grid md:grid-cols-3 gap-4 md:!mt-0 py-8 border-b border-gray-200 dark:border-gray-600 items-center">
                        <div className="text-muted-foreground text-base font-semibold">Current Password</div>
                        <div className="col-span-2">
                            <div className="form-item vertical mb-0 max-w-[700px]">
                                <div className="relative ">
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem className="relative">
                                                <FormControl>
                                                    <Input type='password' placeholder="Current Password" {...field} className={cn('h-11 text-[16px]', form.getFieldState(field.name).error && "focus-visible:ring-[#ef4444]")} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* New Password */}
                    <div className="grid md:grid-cols-3 gap-4 md:!mt-0 py-8 border-b border-gray-200 dark:border-gray-600 items-center">
                        <div className="text-muted-foreground text-base font-semibold">New Password</div>
                        <div className="col-span-2">
                            <div className="form-item vertical mb-0 max-w-[700px]">
                                <div className="relative ">
                                    <FormField
                                        control={form.control}
                                        name="newPassword"
                                        render={({ field }) => (
                                            <FormItem className="relative">
                                                <FormControl>
                                                    <PasswordInput placeholder="New Password" {...field} className={cn('h-11 text-[16px]', form.getFieldState(field.name).error && "focus-visible:ring-[#ef4444]")} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Confirm Password */}
                    <div className="grid md:grid-cols-3 gap-4 md:!mt-0 py-8 border-b border-gray-200 dark:border-gray-600 items-center">
                        <div className="text-muted-foreground text-base font-semibold">Confirm Password</div>
                        <div className="col-span-2">
                            <div className="form-item vertical mb-0 max-w-[700px]">
                                <div className="relative">
                                    <FormField
                                        control={form.control}
                                        name="confirmNewPassword"
                                        render={({ field }) => (
                                            <FormItem className="relative">
                                                <FormControl>
                                                    <PasswordInput placeholder="Confirm Password" {...field} className={cn('h-11 text-[16px]', form.getFieldState(field.name).error && "focus-visible:ring-[#ef4444]")} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*Submit Password */}
                    <div className="flex justify-end gap-2">
                        <div className="">
                            <Button
                                className=" bg-white border border-gray-300 dark:bg-gray-700 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 active:bg-gray-100 dark:active:bg-gray-500 dark:active:border-gray-500 text-gray-600 dark:text-gray-100 radius-round h-11 px-8 py-2 mr-2"
                                type="button"
                                onClick={() => form.reset()}
                            >
                                Reset
                            </Button>
                            <Button
                                className="bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white radius-round h-11 px-8 py-2"
                                type="submit"
                            >
                                Update Password
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </>
    )
}

export default Password

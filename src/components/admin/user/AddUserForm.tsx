"use client"
import { trpc } from '@/app/_trpc/client'
import { USER_ROLE } from '@/constants/index'
import { newUserSchema } from '@/schema/user.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { FC, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '../../ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../ui/form'
import { Input } from '../../ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../../ui/select'
import { toast as hotToast } from "react-hot-toast"
import { useSession } from 'next-auth/react'

interface AddUserFormProps {

}

const AddUserForm: FC<AddUserFormProps> = () => {
  const [userModalOpen, setUserModalOpen] = useState<boolean>(false)
  const { data: session, status } = useSession()
  const form = useForm<z.infer<typeof newUserSchema>>({
    resolver: zodResolver(newUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "CUSTOMER"
    },
  });
  const utils = trpc.useUtils();

  const { mutateAsync: addNewUser, isLoading } = trpc.admin.addUser.useMutation({
    onSuccess: () => {
      setUserModalOpen(false)
      form.reset()
      utils.admin.getAllUser.invalidate()
    }
  })

  async function onSubmit(values: z.infer<typeof newUserSchema>) {
    hotToast.promise(
      addNewUser(values),
      {
        loading: 'Adding user...',
        success: "User added successfully!",
        error: "Could not add user.",
      }
    );
  }
  return (

    <Dialog open={userModalOpen} onOpenChange={setUserModalOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size={'sm'} >Add a User</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            method="post">
            <DialogHeader>
              <DialogTitle>Add a User</DialogTitle>
              <DialogDescription>
                Fill the Below information to add a new user manually
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">

              {/* name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className='items-center gap-x-4 gap-y-2 w-full'>
                    <FormLabel className="text-right">Name</FormLabel>
                    <FormControl className='col-span-3'>
                      <Input
                        placeholder="Enter name"
                        {...field}
                        className=""
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-2 mt-0' />
                  </FormItem>
                )}
              />
              {/* email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className='items-center gap-x-4 gap-y-2 w-full'>
                    <FormLabel className="text-right">Email</FormLabel>
                    <FormControl className='col-span-3'>
                      <Input
                        placeholder="Enter Email"
                        {...field}
                        className=""
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-2 mt-0' />
                  </FormItem>
                )}
              />

              {/* userrole */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full h-11">
                          <SelectValue placeholder="Select a User Role" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        <SelectGroup>
                          {USER_ROLE.filter(role => !(session?.user.role === "ADMIN" && role.value === "SUPER_ADMIN" || role.value === "ADMIN")).map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                              {role.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className='items-center gap-x-4 gap-y-2 w-full'>
                    <FormLabel className="text-right">Password</FormLabel>
                    <FormControl className='col-span-3'>
                      <Input
                        placeholder="Enter Password"
                        {...field}
                        className=""
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-2 mt-0' />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isLoading}>Add User</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>

  )
}

export default AddUserForm
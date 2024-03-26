"use client";
import { Icons } from "@/components/Icons";
import { CustomModal } from "@/components/global/custom-modal";
import { USER_ROLE } from "@/constants/index";
import { addNewUser } from "@/lib/actions/user.action";
import { cn } from "@/lib/utils";
import { useModal } from "@/providers/modal-provider";
import { newUserSchema } from "@/schema/user.schema";
import { Button } from "@/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectItem, Spinner, Switch, Input } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FC, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast as hotToast } from "react-hot-toast";
import { z } from "zod";

interface AddUserFormProps {}

const AddUserForm: FC<AddUserFormProps> = () => {
  const { setOpen } = useModal();

  return (
    <>
      <Button
        variant="default"
        size={"sm"}
        onClick={() => {
          setOpen(
            <CustomModal size="md" title={`Add a User`} subheading={`Fill the Below information to add a new user manually`}>
              <FormContainer />
            </CustomModal>,
          );
        }}
      >
        Add a User
      </Button>
    </>
  );
};

const FormContainer = () => {
  const { setClose } = useModal();
  const { data: session, status } = useSession();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<z.infer<typeof newUserSchema>>({
    resolver: zodResolver(newUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "CUSTOMER",
      active: false,
      emailVerified: false,
    },
  });

  async function onSubmit(values: z.infer<typeof newUserSchema>) {
    startTransition(() => {
      hotToast.promise(
        addNewUser(values).then((data) => {
          if (data.success) {
            form.reset();
            router.refresh();
            setClose();
          }
        }),
        {
          loading: "Adding user...",
          success: "User added successfully!",
          error: "Could not add user.",
        },
      );
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} method="post" className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Person Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    size="sm"
                    placeholder="Enter name"
                    classNames={{ inputWrapper: "border data-[hover=true]:bg-default-100" }}
                    startContent={<Icons.ImpersonateUserIcon className="text-xl w-5 h-5 text-default-400 pointer-events-none flex-shrink-0" />}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className={cn("")}>
                <FormLabel>Person Email</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    size="sm"
                    placeholder="Person Email"
                    classNames={{ inputWrapper: "border data-[hover=true]:bg-default-100" }}
                    startContent={<Icons.MailIcon className="text-xl w-5 h-5 text-default-400 pointer-events-none flex-shrink-0" />}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User Role</FormLabel>
                <FormControl>
                  <Select
                    isRequired
                    aria-label="Select a User Role"
                    placeholder="Select a User Role"
                    className="w-full"
                    defaultSelectedKeys={[field.value]}
                    size="sm"
                    classNames={{
                      trigger: "border data-[hover=true]:bg-default-100",
                    }}
                    {...field}
                  >
                    {USER_ROLE.filter((role) => !((session?.user.role === "ADMIN" && role.value === "SUPER_ADMIN") || role.value === "ADMIN")).map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="items-center gap-x-4 gap-y-2 w-full">
                <FormLabel className="text-right">Password</FormLabel>
                <FormControl className="col-span-3">
                  <Input placeholder="Enter Password" {...field} type="text" size="sm" classNames={{ inputWrapper: "border data-[hover=true]:bg-default-100" }} />
                </FormControl>
                <FormMessage className="col-span-4 col-start-2 mt-0" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="active"
            render={({ field }) => (
              <FormItem className="flex col-span-2 flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-default-100">
                <div className="space-y-0.5">
                  <FormLabel onClick={field.onChange}>Activate User Account</FormLabel>
                  <FormDescription>Mark user account as active.</FormDescription>
                </div>
                <FormControl>
                  <Switch size="sm" disabled={isPending} isSelected={field.value} onValueChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="emailVerified"
            render={({ field }) => (
              <FormItem className="flex col-span-2 flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-default-100">
                <div className="space-y-0.5">
                  <FormLabel onClick={field.onChange}>Verify User Email</FormLabel>
                  <FormDescription>Mark user email as verified.</FormDescription>
                </div>
                <FormControl>
                  <Switch size="sm" disabled={isPending} isSelected={field.value} onValueChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending ? <Spinner size="sm" color="default" /> : "Add User"}
        </Button>
      </form>
    </Form>
  );
};

export default AddUserForm;

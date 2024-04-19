"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NOTIFICATION_ICON } from "@/constants/index";
import { catchError, cn } from "@/lib/utils";
import { AssignNotificationType, assignNotificationSchema } from "@/schema/notification.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebouncedValue } from "@mantine/hooks";
import { Avatar, Popover, PopoverContent, PopoverTrigger, Select, SelectItem, Textarea } from "@nextui-org/react";
import { User } from "@prisma/client";
import { Check, ChevronsUpDown, Search, X } from "lucide-react";
import React, { FC, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FormError } from "../global/form-error";
import { FormSuccess } from "../global/form-success";
import { Button } from "@/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/ui/command";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/ui/form";
import { Input } from "@/ui/input";
import Spinner from "@/ui/spinner";
import { ScrollArea } from "../ui/scroll-area";
import { Icons } from "../Icons";
import { assingNotificationToUsers } from "@/lib/actions/notification.action";
import { toast } from "sonner";
import { trpc } from "@/app/_trpc/client";

interface AddNotificationFormProps {
  users: User[];
}

export const AddNotificationForm: FC<AddNotificationFormProps> = ({ users }) => {
  const [error, setError] = useState<string | undefined>("");
  const [open, setOpen] = useState<boolean>(false);
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = React.useTransition();
  const [searchText, setSearchText] = useState<string | null>("");
  const [debouncedValue, cancel] = useDebouncedValue(searchText, 200);
  const utils = trpc.useUtils();
  const form = useForm<AssignNotificationType>({
    resolver: zodResolver(assignNotificationSchema),
    defaultValues: {
      assignToId: [],
      message: "",
      type: "none",
    },
  });

  const selectedUsersRef = useRef<Array<string>>(form.getValues("assignToId"));

  async function onSubmit(values: AssignNotificationType) {
    startTransition(async () => {
      setError("");
      setSuccess("");
      try {
        await assingNotificationToUsers(values).then((data) => {
          if (data.success) {
            form.reset();
            selectedUsersRef.current = [];
            toast.success(data.success);
            utils.notification.getNotifictions.invalidate();
            setSuccess(data.success);
          } else if (data?.error) {
            toast.error("Error", { description: data.error });
            setError(data.error);
          }
        });
      } catch (err) {
        catchError(err);
      }
    });
  }

  const handleUserSelect = (id: string) => {
    const selected = (selectedUsersRef.current = selectedUsersRef.current.includes(id) ? selectedUsersRef.current.filter((r) => r !== id) : [...selectedUsersRef.current, id]);
    const selectedForValidation: [string, ...string[]] = [selected[0], ...selected.slice(1)];
    form.setValue("assignToId", selectedForValidation);

    if (selectedUsersRef.current.length === 0) {
      form.setError("assignToId", {
        type: "required",
        message: "Please select at least one user.",
      });
    } else {
      form.clearErrors("assignToId");
    }
  };

  const filteredUsers = useMemo(() => {
    if (!debouncedValue) return users;
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(debouncedValue.toLowerCase()) ||
        user.id.toLowerCase().includes(debouncedValue.toLowerCase()) ||
        user.email?.toLowerCase().includes(debouncedValue.toLowerCase()),
    );
  }, [users, debouncedValue]);

  const NotifyIcon = NOTIFICATION_ICON.find((n) => n.key === form.watch("type"));
  const buttonLabel = isPending ? <Spinner /> : "Assign Notification";

  return (
    <Card className="p-6 w-full bg-white mx-auto">
      <CardHeader className="p-0 py-4">
        <CardTitle>Add Notification</CardTitle>
        <CardDescription>Assign a notification to a user</CardDescription>
      </CardHeader>
      <CardContent className="mt-2 w-full p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} method="post" className="flex flex-col md:grid sm:grid-cols-1 lg:grid-cols-5 items-start md:gap-8 space-y-4 ">
            <div className="md:col-span-3 flex w-full flex-col gap-6">
              <div className="flex flex-col md:grid grid-cols-1 sm:grid-cols-2 gap-4 gap-y-6">
                <FormField
                  control={form.control}
                  name="assignToId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assigned To User</FormLabel>
                      <FormControl>
                        <Popover isOpen={open} onOpenChange={setOpen}>
                          <PopoverTrigger>
                            <Button
                              data-slot="input-wrapper"
                              variant="outline"
                              role="combobox"
                              aria-expanded={open}
                              className={cn(
                                "relative items-center justify-between w-full flex tap-highlight-transparent shadow-sm border-2  border-default-200 bg-default-100 hover:bg-default-100 text-foreground-500 hover:text-foreground-500 font-normal hover:font-normal focus-visible:bg-default-100 hover:border-default-400 min-h-unit-8 rounded-small gap-0 transition-background !duration-150 transition-colors motion-reduce:transition-none outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background h-12 px-3 py-1 is-filled",
                              )}
                            >
                              {selectedUsersRef.current.length > 0 ? `${selectedUsersRef.current.length}${" "}Users selected` : "Select a User"}
                              <ChevronsUpDown className=" h-3 w-3 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="p-0 gap-0 divide-y divide-default-300/50 dark:divide-default-100/80 bg-content1 max-w-[300px] overflow-hidden shadow-small rounded-medium">
                            <Command className="m-0 h-full w-full p-0">
                              <div className="flex items-center border-b px-3">
                                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                                <Input
                                  type="text"
                                  placeholder="Search here..."
                                  className={cn(
                                    "flex w-full bg-transparent py-2 text-sm outline-none border-none ring-offset-0 placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
                                    "focus-visible:ring-0 focus-visible:outline-none  focus-visible:border-none focus-visible:ring-offset-0 focus-visible:bg-transparent",
                                  )}
                                  onChange={(e) => setSearchText(e.currentTarget.value)}
                                />
                              </div>
                              <CommandList>
                                <CommandEmpty>No User found.</CommandEmpty>
                                <CommandGroup heading="Active Users">
                                  {filteredUsers
                                    .filter((u) => u.active)
                                    .map((user, index) => (
                                      <CommandItem
                                        key={user.name}
                                        value={user.id}
                                        className={cn("capitalize my-1 aria-selected:bg-default-200", selectedUsersRef.current.includes(user.id) && "bg-default-100")}
                                        onSelect={() => {
                                          handleUserSelect(user.id);
                                        }}
                                      >
                                        <RenderUser user={user} isSelected={selectedUsersRef.current.includes(user.id)} />
                                      </CommandItem>
                                    ))}
                                </CommandGroup>
                                <CommandGroup heading="Inactive Users">
                                  {filteredUsers
                                    .filter((u) => !u.active)
                                    .map((user, index) => (
                                      <CommandItem
                                        key={user.name}
                                        value={user.id}
                                        className={cn("capitalize my-1 aria-selected:bg-default-200", selectedUsersRef.current.includes(user.id) && "bg-default-100")}
                                        onSelect={() => {
                                          handleUserSelect(user.id);
                                        }}
                                      >
                                        <RenderUser user={user} isSelected={selectedUsersRef.current.includes(user.id)} />
                                      </CommandItem>
                                    ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
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
                      <FormLabel className="text-card-foreground text-sm">
                        Notification Type <span className="text-muted-foreground italic">(optional).</span>
                      </FormLabel>
                      <FormControl>
                        <Select
                          placeholder="Select a notification type"
                          size="sm"
                          variant="faded"
                          aria-label="Select user to assign notification"
                          classNames={{
                            base: "col-span-2",
                          }}
                          startContent={
                            NotifyIcon ? (
                              <div
                                className={cn(
                                  "size-8 rounded-full flex justify-center items-center",
                                  NotifyIcon?.color?.bgColor,
                                  NotifyIcon?.color?.textColor,
                                  NotifyIcon?.color?.ringColor,
                                )}
                              >
                                <NotifyIcon.icon className={cn("w-5 h-5")} />
                              </div>
                            ) : null
                          }
                          onChange={(e) => {
                            if (e.target.value !== "") {
                              return field.onChange(e);
                            }
                            form.setValue("type", "none");
                          }}
                        >
                          {NOTIFICATION_ICON.map((item) => (
                            <SelectItem
                              key={item.key}
                              textValue={item.key}
                              value={item.key}
                              startContent={
                                item.icon && (
                                  <div className={cn("size-8 rounded-full flex justify-center items-center", item?.color?.bgColor, item?.color?.textColor, item?.color?.ringColor)}>
                                    <item.icon className={cn("w-5 h-5")} />
                                  </div>
                                )
                              }
                            >
                              {item.key}
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
                  name="message"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Notification Message</FormLabel>
                      <FormControl>
                        <Textarea
                          variant="faded"
                          label="Description"
                          placeholder="Enter your description"
                          description="Enter a concise description of your notification."
                          className=""
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <ScrollArea className="md:col-span-2 h-[235px] flex flex-col justify-start row-span-1">
              <div className="flex flex-col gap-3">
                {users
                  .filter((u) => selectedUsersRef.current.includes(u.id))
                  .map((user) => (
                    <div key={user.id} className="flex gap-2 items-center border  bg-default-100 rounded-full py-2 px-4 shadow-sm">
                      <Avatar
                        alt={user.name}
                        className="flex-shrink-0"
                        size="sm"
                        src={user.image ?? ""}
                        classNames={{
                          icon: "text-black/50",
                        }}
                        fallback={<Icons.user className="h-4 w-4 text-zinc-900" />}
                      />
                      <div className="flex flex-col">
                        <span className="text-small">{user.name}</span>
                        <span className="text-tiny text-default-400 lowercase">{user.email}</span>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="flex justify-center items-center w-6 h-6 ml-auto rounded-full hover:bg-secondary"
                        title="remove selected user"
                        onClick={() => handleUserSelect(user.id)}
                      >
                        <X className={cn("h-4 w-4 opacity-100")} />
                      </Button>
                    </div>
                  ))}
              </div>
            </ScrollArea>
            <FormSuccess message={success} classname="col-span-3 !mt-0" />
            <FormError message={error} classname="col-span-3 !mt-0" />
            <Button type="submit" disabled={isPending} className={cn("w-full col-span-3 !mt-0")}>
              {buttonLabel}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

interface RenderUserProps {
  user: User;
  isSelected: boolean;
}
const RenderUser = React.memo(({ user, isSelected }: RenderUserProps) => {
  return (
    <>
      <div className="flex gap-2 items-center">
        <Avatar
          alt={user.name}
          className="flex-shrink-0"
          size="sm"
          src={user.image ?? ""}
          classNames={{
            icon: "text-black/50",
          }}
        />
        <div className="flex flex-col">
          <span className="text-small">{user.name}</span>
          <span className="text-tiny text-default-400 lowercase">{user.email}</span>
        </div>
      </div>
      <Check className={cn("ml-auto mr-1 h-4 w-4", isSelected ? "opacity-100" : "opacity-0")} />
    </>
  );
});

RenderUser.displayName = "RenderUser";

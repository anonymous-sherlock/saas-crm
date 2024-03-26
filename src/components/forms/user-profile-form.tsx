"use client";
import { trpc } from "@/app/_trpc/client";
import { Icons } from "@/components/Icons";
import { FormError } from "@/components/global/form-error";
import { FormSuccess } from "@/components/global/form-success";
import { MediaDialog } from "@/components/template/media-modal/media-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import Spinner from "@/components/ui/spinner";
import { USER_ROLE } from "@/constants/index";
import { getUserProfile, updateUserProfile } from "@/lib/actions/user.action";
import { allowedAdminRoles } from "@/lib/auth.permission";
import { catchError, cn } from "@/lib/utils";
import defaultProfileCover from "@/public/default-profile-cover.png";
import { UserProfileFormSchema, UserProfileFormSchemaType } from "@/schema/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, Input, Select, SelectItem, Switch } from "@nextui-org/react";
import { Media } from "@prisma/client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface UserProfileFormProps {
  user: Awaited<ReturnType<typeof getUserProfile>>;
}

export const UserProfileForm: FC<UserProfileFormProps> = ({ user }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [selectedFile, setSelectedFile] = useState<Media[]>([]);
  const [isPending, startTransition] = React.useTransition();
  const { data: session, status } = useSession();
  const { data: fileData, fetchNextPage, isFetchingNextPage, isLoading } = trpc.media.getUserMedia.useInfiniteQuery({ limit: 12 }, { getNextPageParam: (lastPage) => lastPage.nextCursor });
  const images = fileData ? fileData.pages.flatMap((data) => data.mediafiles) : [];
  const isAdmin = allowedAdminRoles.some((role) => role === session?.user?.role);
  const isVisible = allowedAdminRoles.some((role) => role === session?.user?.role) && !pathname.startsWith("/user/profile");
  const AvatarFile = selectedFile.length && selectedFile[0];
  const defaultValues: UserProfileFormSchemaType = {
    name: user?.name ?? "",
    active: user?.active ?? false,
    email: user?.email ?? "",
    role: user?.role ?? "CLIENT",
    image: user?.image ?? "",
    emailVerified: user?.emailVerified ? true : false,
  };

  const form = useForm<UserProfileFormSchemaType>({
    resolver: zodResolver(UserProfileFormSchema),
    mode: "all",
    defaultValues: defaultValues,
  });
  async function onSubmit(values: UserProfileFormSchemaType) {
    setError("");
    setSuccess("");
    startTransition(async () => {
      if (!user?.id) {
        toast.error("User id Not Provided");
        return;
      }
      try {
        await updateUserProfile({ data: values, userId: user?.id }).then((data) => {
          if (data.error) {
            setError(data.error);
            toast.error(data.error);
          } else if (data?.success) {
            setSuccess(data.success);
            toast.success(data.success);
            router.refresh();
          }
        });
      } catch (err) {
        catchError(err);
      }
    });
  }
  useEffect(() => {
    if (AvatarFile) {
      form.setValue("image", AvatarFile.url);
    } else {
      form.resetField("image");
    }
  }, [form, AvatarFile]);

  useEffect(() => {
    const image = images.find((img) => img.url === user?.image);
    if (image) {
      setSelectedFile([image]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isFormUnchanged = JSON.stringify(defaultValues) === JSON.stringify(form.watch());
  return (
    <Card className="bg-white">
      <div className="min-h-[200px] w-full relative">
        <Image src={defaultProfileCover.src} blurDataURL={defaultProfileCover.blurDataURL} fill alt="" priority quality={90} />
        <div className="absolute -bottom-1/2 -translate-y-1/2 border-white border-4 left-4 w-[120px] h-[120px] rounded-full bg-gray-200">
          <Label htmlFor="profile-avatar" className="bg-transparent w-full h-full">
            <MediaDialog
              images={images ?? null}
              fetchNextPage={fetchNextPage}
              isFetchingNextPage={isFetchingNextPage || isLoading}
              maxFiles={1}
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              triggerStyle="Button"
            >
              <Avatar
                isBordered
                className="w-full h-full cursor-pointer"
                src={AvatarFile ? AvatarFile.url : user?.image ? user.image : ""}
                fallback={<Icons.user className="h-12 w-12 text-zinc-600" />}
              />
            </MediaDialog>
          </Label>
        </div>
      </div>
      <CardContent className="mt-16 w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} method="post" className="flex flex-col md:grid sm:grid-cols-1 lg:grid-cols-5 items-start md:gap-8 space-y-4 ">
            <div className="md:col-span-3 flex w-full flex-col gap-6">
              <div className="flex flex-col md:grid grid-cols-1 sm:grid-cols-2 gap-4 gap-y-6">
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
                          placeholder="Person Name"
                          classNames={{ inputWrapper: "border data-[hover=true]:bg-default-100" }}
                          startContent={<Icons.ImpersonateUserIcon className="text-xl w-5 h-5 text-default-400 pointer-events-none flex-shrink-0" />}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <MediaDialog
                  images={images ?? null}
                  fetchNextPage={fetchNextPage}
                  isFetchingNextPage={isFetchingNextPage || isLoading}
                  maxFiles={1}
                  selectedFile={selectedFile}
                  setSelectedFile={setSelectedFile}
                  triggerStyle="Button"
                >
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profile Image</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            size="sm"
                            isDisabled
                            placeholder="Profle Image"
                            classNames={{ inputWrapper: "border data-[hover=true]:bg-default-100" }}
                            startContent={<Icons.CameraIcon className="text-xl w-5 h-5 text-default-400 pointer-events-none flex-shrink-0" />}
                            value={AvatarFile ? AvatarFile.name : "Choose a Profile Picture"}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </MediaDialog>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className={cn("", !isVisible && "col-span-2")}>
                      <FormLabel>Person Email</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          size="sm"
                          readOnly
                          isDisabled={!isAdmin}
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
                {isVisible ? (
                  <>
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
                      name="active"
                      render={({ field }) => (
                        <FormItem className="flex col-span-2 flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-default-100">
                          <div className="space-y-0.5">
                            <FormLabel onClick={field.onChange}>Activate User Account</FormLabel>
                            <FormDescription>Mark user account as active.</FormDescription>
                          </div>
                          <FormControl>
                            <Switch size="sm" disabled={defaultValues.active || isPending} isSelected={field.value} onValueChange={field.onChange} />
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
                            <Switch size="sm" disabled={defaultValues.emailVerified || isPending} isSelected={field.value} onValueChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </>
                ) : null}
              </div>
            </div>
            <FormSuccess message={success} classname="col-span-3 !mt-0" />
            <FormError message={error} classname="col-span-3 !mt-0" />
            <Button type="submit" disabled={isFormUnchanged || isPending} className={cn("w-full col-span-3 !mt-0")}>
              {isPending ? (
                <React.Fragment>
                  <Spinner /> Updating User...
                </React.Fragment>
              ) : (
                <React.Fragment>Update User Details</React.Fragment>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

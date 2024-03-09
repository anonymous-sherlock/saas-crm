"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NOTIFICATION_ICON } from "@/constants/index";
import { catchError, cn } from '@/lib/utils';
import { AssignNotificationType, assignNotificationSchema } from '@/schema/notification.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Avatar, Select, SelectItem, SelectedItems, Textarea } from '@nextui-org/react';
import { Icon, User } from "@prisma/client";
import React, { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Icons } from '../Icons';
import { FormError } from '../global/form-error';
import { FormSuccess } from '../global/form-success';
import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";


interface AddNotificationFormProps {
	users: User[]
}

const AddNotificationForm: FC<AddNotificationFormProps> = ({ users }) => {
	const [error, setError] = useState<string | undefined>("");
	const [success, setSuccess] = useState<string | undefined>("");
	const [isPending, startTransition] = React.useTransition()
	const form = useForm<AssignNotificationType>({
		resolver: zodResolver(assignNotificationSchema),
		defaultValues: {
			assignToId: "",
			message: "",
		},
	});

	async function onSubmit(values: AssignNotificationType) {
		startTransition(async () => {
			setError("");
			setSuccess("");
			try {
				console.log(values)
			} catch (err) {
				catchError(err);
			}
		})
	}

	return (
		<Card className="p-6 w-full bg-white mx-auto">
			<CardHeader className="p-0 py-4">
				<CardTitle>Add Notification</CardTitle>
				<CardDescription>Assign a notification to a user</CardDescription>
			</CardHeader>
			<CardContent className="mt-2 w-full p-0">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						method="post"
						className="flex flex-col items-start space-y-4"
					>
						<div className="flex w-full flex-col ">
							<div className="flex flex-col md:grid grid-cols-2 gap-4 md:gap-6">
								<FormField
									control={form.control}
									name="assignToId"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<Select
													items={users}
													placeholder="Select users"
													isMultiline={true}
													isRequired
													selectionMode="multiple"
													aria-label="Select user to assign notification"
													classNames={{
														base: "col-span-2",
													}}
													renderValue={(items: SelectedItems<User>) => {
														return items.map((item) => (
															<div key={item.key} className="inline-flex items-center gap-2 max-w-sm border p-2 mt-1 mr-1 rounded-full bg-white">
																<Avatar
																	alt={item.data?.name}
																	className="flex-shrink-0"
																	classNames={{
																		icon: "text-black/50",
																	}}
																	size="sm"
																	src={item.data?.image ?? ""}
																/>
																<div className="flex flex-col">
																	<span>{item.data?.name}</span>
																	<span className="text-default-500 text-tiny">({item.data?.email})</span>
																</div>
															</div>
														));
													}}
													{...field}
												>
													{(user) => (
														<SelectItem key={user.id} textValue={user.name}>
															<div className="flex gap-2 items-center">
																<Avatar alt={user.name} className="flex-shrink-0" size="sm" src={user.image ?? ""}
																	classNames={{
																		icon: "text-black/50",
																	}}
																/>
																<div className="flex flex-col">
																	<span className="text-small">{user.name}</span>
																	<span className="text-tiny text-default-400">{user.email}</span>
																</div>
															</div>
														</SelectItem>
													)}
												</Select>
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
											<FormControl>
												<Select
													placeholder="Select a notification type"
													isRequired

													aria-label="Select user to assign notification"
													classNames={{
														base: "col-span-2",
													}}

													onChange={field.onChange}
												>
													{NOTIFICATION_ICON.map((item) => (
														<SelectItem key={item.key} textValue={item.key} value={item.key} >
															<div key={item.key} className="flex w-full items-center gap-2 border p-2 mt-1 mr-1 rounded-full bg-white">
																<div className={cn("ring-1 w-[36px] h-[36px] rounded-full flex justify-center items-center",
																	item?.color?.bgColor,
																	item?.color?.textColor,
																	item?.color?.ringColor
																)}>
																	{item.icon && <item.icon className="w-5 h-5" />}
																</div>
																<div className="flex flex-col">
																	<span>{item.key}</span>
																</div>
															</div>
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
						<FormSuccess message={success} />
						<FormError message={error} />

						<Button type="submit" autoSave="false" className={cn("shrink-0")}
							disabled={isPending || !form.formState.isValid} >
							{isPending && (
								<Icons.spinner
									className="mr-2 h-4 w-4 animate-spin"
									aria-hidden="true"
								/>
							)}
							Assign Notification
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card >
	)
}

export default AddNotificationForm
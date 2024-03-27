"use server"
import { db } from "@/db";
import { z } from "zod"
import { getActorUser, getCurrentUser } from "../auth";
import { AssignNotificationType, assignNotificationSchema } from "@/schema/notification.schema";
import { allowedAdminRoles } from "../auth.permission";
import { revalidatePath } from "next/cache";


export async function assingNotificationToUsers(rawdata: AssignNotificationType) {
  try {

    const loggedInUser = await getCurrentUser()
    if (!loggedInUser) return { error: "Unauthorized: Please log in to your account" };
    const isAdmin = allowedAdminRoles.some((role) => role === loggedInUser.role);
    if (!isAdmin) return { error: "Unauthorized: You don't have permission to add a new user" };

    const parsedData = assignNotificationSchema.safeParse(rawdata)
    if (!parsedData.success) return { error: parsedData.error.message ?? "Invalid data passed. Please check the provided information." };
    let { type, assignToId, message } = parsedData.data
    const users = await db.user.findMany({ where: { id: { in: [...assignToId, "fasdfasdfasd"] } } })
    if (!users) return { error: "User not found" };
    const notificationPromises = users.map(async (user) => {
      await db.notification.create({
        data: {
          message: message,
          icon: type !== "none" ? type : undefined,
          userId: user.id,
          companyId: user.companyId
        }
      });
    });
    await Promise.all(notificationPromises);
    revalidatePath("/")
    return { success: "Notification assigned successfully" };
  } catch (error) {
    return { error: "Uh oh! Something went wrong." };
  }
}
const UpdateNotificationReadStatusSchema = z.object({
  id: z.string(),
});

type UpdateNotificationReadStatusParams = z.infer<typeof UpdateNotificationReadStatusSchema>;

export async function updateNotificationReadStatus(data: UpdateNotificationReadStatusParams) {
  try {
    const parsedData = UpdateNotificationReadStatusSchema.safeParse(data);
    if (!parsedData.success) return { error: "Notification id not provided." };
    await db.notification.update({
      where: { id: parsedData.data.id },
      data: { isRead: true }
    })
    return { success: true, message: "Notification read status updated successfully" };
  } catch (error) {
    return { error: "Uh oh! Something went wrong." }
  }
}

export async function updateUnReadNotificationsToArchieved() {
  try {
    const user = await getCurrentUser()
    const actor = await getActorUser(user)
    await db.notification.updateMany({
      where: { userId: actor ? actor.userId : user?.id, archived: false, isRead: false },
      data: { archived: true }
    })
    return { success: "Notification updated successfully", };
  } catch (error) {
    return { error: "Uh oh! Something went wrong." }
  }
}

const removedNotificationFromArchiveSchema = z.object({
  id: z.string(),
});
type RemovedNotificationFromArchiveType = z.infer<typeof removedNotificationFromArchiveSchema>;

export async function removedNotificationFromArchive(data: RemovedNotificationFromArchiveType) {
  try {
    const parsedData = UpdateNotificationReadStatusSchema.safeParse(data);
    if (!parsedData.success) return { error: "Notification id not provided." };
    await db.notification.update({
      where: { id: parsedData.data.id, archived: true },
      data: { archived: false }
    })
    return { success: "Notification updated successfully", };
  } catch (error) {
    return { error: "Uh oh! Something went wrong." }
  }
}
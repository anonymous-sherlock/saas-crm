"use server"
import { db } from "@/db";
import { z } from "zod"
import { getActorUser, getCurrentUser } from "../auth";


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
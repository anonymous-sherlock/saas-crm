import { privateProcedure, router } from "@/server/trpc";
import { z } from "zod";
import { Notification, User } from "@prisma/client";
import { db } from "@/db";

interface NotificationwithUser extends Notification {
  user: User;
}

const getNotifictionsOutputSchema = z.object({
  unReadNotifications: z.custom<NotificationwithUser>().array(),
  archievedNotifications: z.custom<NotificationwithUser>().array(),
});

export const notificationRouter = router({
  getNotifictions: privateProcedure.output(getNotifictionsOutputSchema).query(async ({ ctx }) => {
    const actor = ctx.actor;
    const userId = actor ? actor.userId : ctx.userId;
    const unReadNotificationsPromise = db.notification.findMany({
      orderBy: { createdAt: "desc" },
      where: { userId: userId, isRead: false, archived: false },
      include: { user: true },
    });

    const archievedNotificationsPromise = db.notification.findMany({
      orderBy: { createdAt: "desc" },
      where: { userId: userId, archived: true },
      include: { user: true },
    });

    const [unReadNotifications, archievedNotifications] = await Promise.all([unReadNotificationsPromise, archievedNotificationsPromise]);
    return {
      unReadNotifications,
      archievedNotifications,
    };
  }),
});

export type NotificationRouter = typeof notificationRouter;

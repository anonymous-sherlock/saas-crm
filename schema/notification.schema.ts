import { Icon } from "@prisma/client";
import { z } from "zod";

export const assignNotificationSchema = z.object({
    assignToId: z.string().array(),
    message: z.string().min(30, "Message required min 30 characters"),
    type: z.enum(["none", ...Object.values(Icon)]).default("none")
});

export type AssignNotificationType = z.infer<typeof assignNotificationSchema>
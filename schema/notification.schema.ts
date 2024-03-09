import { Icon } from "@prisma/client";
import { z } from "zod";

export const assignNotificationSchema = z.object({
    assignToId: z.string(),
    message: z.string(),
    type: z.nativeEnum(Icon).nullable().optional(),
});

export type AssignNotificationType = z.infer<typeof assignNotificationSchema>
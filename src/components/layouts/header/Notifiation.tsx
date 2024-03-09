"use client"
import { trpc } from "@/app/_trpc/client";
import { NotificationsTabs } from "@/components/tabs/notifications-tabs";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Spinner from "@/components/ui/spinner";
import { NOTIFICATION_ICON } from "@/constants/index";
import { removedNotificationFromArchive, updateNotificationReadStatus, updateUnReadNotificationsToArchieved } from "@/lib/actions/notification.action";
import { cn } from "@/lib/utils";
import { RouterOutputs } from "@/server";
import { Avatar } from "@nextui-org/react";
import { Bell, Inbox, Undo2 } from 'lucide-react';
import { useRouter, useSearchParams } from "next/navigation";
import { FC, useTransition } from 'react';
import { toast } from "sonner";


interface NotifiationProps {
  notifications: RouterOutputs["notification"]["getNotifictions"]
}

const Notifiation: FC<NotifiationProps> = ({ notifications }: NotifiationProps) => {
  const searchParams = useSearchParams()
  const notificationType = searchParams.get('notification') === "archive" ? "archive" : "inbox"
  const { data: allNotifications } = trpc.notification.getNotifictions.useQuery(undefined, {
    initialData: notifications
  })
  const [isArchieving, startArchieveTransition] = useTransition()

  const utils = trpc.useUtils()
  async function handleMarkAsRead(id: string) {
    if (!id) { toast.info("Notification cannot mark as read") }
    await updateNotificationReadStatus({ id }).then(() => {
      utils.notification.getNotifictions.invalidate()
    })
  }

  async function handleArchievedRemoved(id: string) {
    if (!id) { toast.info("Notification cannot mark as read") }
    await removedNotificationFromArchive({ id }).then(() => {
      utils.notification.getNotifictions.invalidate()
    })
  }
  async function handleArchievedAll() {
    startArchieveTransition(async () => {
      await updateUnReadNotificationsToArchieved().then(() => {
        utils.notification.getNotifictions.invalidate()
      })
    })
  }
  return (
    <Popover>
      <PopoverTrigger>
        <div className="relative rounded-full w-8 h-8 bg-primary flex items-center justify-center text-white">
          <Bell size={16} />
          {allNotifications.unReadNotifications.length > 0 && <span className='-top-1 animate-custom-ping right-0 absolute z-50 w-[10px] h-[10px] bg-red-500 rounded-full' />}
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-0 max-w-[400px] min-w-[400px] overflow-hidden" side="bottom" align="end" alignOffset={5} >
        <div>
          <NotificationsTabs />
          <ScrollArea orientation="vertical" className="h-[400px]" >
            {notificationType === "inbox" ?
              <>
                {allNotifications.unReadNotifications?.map((notification) => {
                  const NOTIFY = NOTIFICATION_ICON.find((val) => val.key === notification.icon)
                  return (
                    <div key={notification.id} className="w-full hover:bg-[#FAFAFA] border-b flex py-4 group group-hover/notification-card relative">
                      <div className="w-[60px]  shrink-0 flex justify-center items-start">
                        {notification.icon ?

                          <div className={cn("ring-1 w-[36px] h-[36px] rounded-full flex justify-center items-center",
                            NOTIFY?.color?.bgColor,
                            NOTIFY?.color?.textColor,
                            NOTIFY?.color?.ringColor
                          )}>
                            {NOTIFY?.icon && <NOTIFY.icon className="w-5 h-5" />}
                          </div> :
                          <Avatar isBordered src={String(notification.user.image)} size="sm" />
                        }
                      </div>
                      <div className="w-[80%] line-clamp-3 pr-4">
                        <p className="text-[14px] ">{notification.message}</p>
                      </div>
                      <div className="invisible group-hover:visible absolute top-1/2 transform -translate-y-1/2 right-4">
                        <Button size="icon" variant="ghost" className="w-8 h-8 rounded-full" title="mark as read" onClick={() => handleMarkAsRead(notification.id)}>
                          <Inbox className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </div>
                  )
                }

                )}
                {allNotifications.unReadNotifications?.length === 0 && (
                  <div className="flex items-center justify-center text-muted-foreground mt-4 mb-4">
                    You have no notifications
                  </div>
                )}
              </>
              :
              <>
                {allNotifications.archievedNotifications?.map((notification) => {
                  const NOTIFY = NOTIFICATION_ICON.find((val) => val.key === notification.icon)
                  return (
                    <div key={notification.id} className="w-full hover:bg-[#FAFAFA] border-b flex py-4 group group-hover/notification-card relative">
                      <div className="w-[60px]  shrink-0 flex justify-center items-start">
                        {notification.icon ?

                          <div className={cn("ring-1 w-[36px] h-[36px] rounded-full flex justify-center items-center",
                            NOTIFY?.color?.bgColor,
                            NOTIFY?.color?.textColor,
                            NOTIFY?.color?.ringColor
                          )}>
                            {NOTIFY?.icon && <NOTIFY.icon className="w-5 h-5" />}
                          </div> :
                          <Avatar isBordered src={String(notification.user.image)} size="sm" />
                        }
                      </div>
                      <div className="w-[80%] line-clamp-3 pr-4">
                        <p className="text-[14px] ">{notification.message}</p>
                      </div>
                      <div className="invisible group-hover:visible absolute top-1/2 transform -translate-y-1/2 right-4">
                        <Button size="icon" variant="ghost" className="w-8 h-8 rounded-full" title="remove from archieve" onClick={() => handleArchievedRemoved(notification.id)}>
                          <Undo2 className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </div>
                  )
                }

                )}
                {allNotifications.archievedNotifications?.length === 0 && (
                  <div className="flex items-center justify-center text-muted-foreground mt-4 mb-4">
                    You have no archieved notifications
                  </div>
                )}
              </>
            }
          </ScrollArea>
          {notificationType !== "archive" ?
            <>
              <Separator />
              <div className="w-full flex gap-2 justify-center items-center p-2">
                <Button variant="ghost" size="sm" disabled={isArchieving} onClick={handleArchievedAll}>
                  {isArchieving ? <Spinner /> : "Archive All"}
                </Button>
              </div>
            </>
            : null}
        </div>
      </PopoverContent>
    </Popover >
  )
}

export default Notifiation
"use client"

import { Tabs, TabsList, TabsTrigger } from "@radix-ui/react-tabs"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface SettingsTabsProps {

}

export function NotificationsTabs({ }: SettingsTabsProps) {
    const router = useRouter()
    const pathname = usePathname()
    const notificationSearchParams = useSearchParams().get("notification")

    const tabs = [
        {
            title: "Inbox",
            href: `${pathname}?notification=inbox`,
            isActive: notificationSearchParams ? notificationSearchParams === "inbox" : true,
        },
        {
            title: "Archive",
            href: `${pathname}?notification=archive`,
            isActive: notificationSearchParams === "archive",
        },
    ]

    return (
        <Tabs
            defaultValue={tabs.find((tab) => tab.isActive)?.href ?? tabs[0]?.href}
            className="sticky top-0 z-30 h-full w-full bg-background"
            onValueChange={(value) => router.push(value)}
        >
            <ScrollArea
                orientation="horizontal"
                scrollBarClassName="h-2"
            >

                <TabsList className="inline-flex px-2 items-center justify-center space-x-1.5 text-muted-foreground">
                    {tabs.map((tab) => (
                        <div
                            role="none"
                            key={tab.href}
                            className={cn(
                                "border-b-2 border-transparent py-1.5",
                                tab.isActive && "border-foreground"
                            )}
                        >
                            <TabsTrigger
                                value={tab.href}
                                className={cn(
                                    "inline-flex items-center justify-center rounded-sm px-3 py-1.5 text-sm font-medium text-muted-foreground ring-offset-background transition-all hover:bg-muted hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                                    tab.isActive && "text-foreground"
                                )}
                                asChild
                            >
                                <Link href={tab.href}>{tab.title}</Link>
                            </TabsTrigger>
                        </div>
                    ))}
                </TabsList>
                {/* <Icons.settings className="inline-flex w-4 h-4 mr-2 text-muted-foreground" /> */}
                <Separator />
            </ScrollArea>
        </Tabs>
    )
}

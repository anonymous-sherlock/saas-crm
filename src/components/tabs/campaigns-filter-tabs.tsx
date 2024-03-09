"use client"
import {
    Tabs,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs"
import { CampaignsFilterValues } from "@/schema/filter.schema"
import { usePathname, useRouter } from "next/navigation"
import { FC } from 'react'
interface UserFilterTabsProps {
    defaultValues: CampaignsFilterValues
}

const UserCampaginsFilterTabs: FC<UserFilterTabsProps> = ({ defaultValues }) => {
    const { q, status } = defaultValues
    const router = useRouter()
    const pathname = usePathname()

    function handleUsersFilter(value: CampaignsFilterValues["status"]) {
        const searchParams = new URLSearchParams({
            ...(q && { q }),
            ...(value && { status: value }),
        });
        const url = `${pathname}?${searchParams}`
        router.push(url)
    }

    return (
        <Tabs defaultValue={defaultValues.status || "All"} onValueChange={(value) => handleUsersFilter(value as CampaignsFilterValues["status"])}>
            <TabsList className="bg-secondary border">
                <TabsTrigger value="All">All</TabsTrigger>
                <TabsTrigger value="OnHold">On Hold</TabsTrigger>
                <TabsTrigger value="InProgress">In Progress</TabsTrigger>
                <TabsTrigger value="Canceled">Canceled</TabsTrigger>
                <TabsTrigger value="Done">Done</TabsTrigger>
            </TabsList>
        </Tabs>
    )
}

export default UserCampaginsFilterTabs
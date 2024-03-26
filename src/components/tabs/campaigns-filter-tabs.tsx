"use client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CampaignsFilterValues } from "@/schema/filter.schema";
import { usePathname, useRouter } from "next/navigation";
import { FC } from "react";
import { ScrollArea } from "../ui/scroll-area";
interface UserFilterTabsProps {
  defaultValues: CampaignsFilterValues;
}

const UserCampaginsFilterTabs: FC<UserFilterTabsProps> = ({ defaultValues }) => {
  const { q, status } = defaultValues;
  const router = useRouter();
  const pathname = usePathname();

  function handleUsersFilter(value: CampaignsFilterValues["status"]) {
    const searchParams = new URLSearchParams({
      ...(q && { q }),
      ...(value && { status: value }),
    });
    const url = `${pathname}?${searchParams}`;
    router.push(url);
  }

  return (
    <Tabs className="w-full" defaultValue={defaultValues.status || "All"} onValueChange={(value) => handleUsersFilter(value as CampaignsFilterValues["status"])}>
      <ScrollArea orientation="horizontal" className="pb-2.5 w-full" scrollBarClassName="h-2">
        <TabsList className="bg-secondary border !inline-flex w-max items-center justify-center md:w-full">
          <TabsTrigger value="All" className="inline-flex w-max shrink-0">All</TabsTrigger>
          <TabsTrigger value="OnHold" className="inline-flex w-max shrink-0">On Hold</TabsTrigger>
          <TabsTrigger value="InProgress" className="inline-flex w-max shrink-0">In Progress</TabsTrigger>
          <TabsTrigger value="Canceled" className="inline-flex w-max shrink-0">Canceled</TabsTrigger>
          <TabsTrigger value="Done" className="inline-flex w-max shrink-0">Done</TabsTrigger>
        </TabsList>
      </ScrollArea>
    </Tabs>
  );
};

export default UserCampaginsFilterTabs;

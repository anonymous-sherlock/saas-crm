"use client";
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/global/page-header";
import { Shell } from "@/components/shells/shell";
import { CustomTabsList } from "@/components/tabs/tab-list";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { useParams, usePathname, useRouter, useSelectedLayoutSegment, useSelectedLayoutSegments } from "next/navigation";
import { FC } from "react";
interface AdminUserHeaderSectionProps {}

const AdminUserHeaderSection: FC<AdminUserHeaderSectionProps> = ({}) => {
  const router = useRouter();
  const { userId } = useParams<{ userId: string }>();
  const segment = useSelectedLayoutSegment();
  const segments = useSelectedLayoutSegments();
  const activeSubTab = segments[segments.length - 1];
  const tabs = [
    {
      title: "User Profile",
      description: "Manage user profile",
      href: `/admin/users/${userId}`,
      isActive: segment === null || segment === "wallet",
      nav: [
        {
          title: "Overview",
          href: `/admin/users/${userId}`,
          isActive: segment === null,
        },
        {
          title: "Wallet",
          href: `/admin/users/${userId}/wallet`,
          isActive: activeSubTab === "wallet",
        },
      ],
    },
    {
      title: "Company Details",
      href: `/admin/users/${userId}/company`,
      description: "Manage company details",
      isActive: segment === "company",
      nav: [
        {
          title: "Company Details",
          href: `/admin/users/${userId}/company`,
          isActive: activeSubTab === "company",
        },
        {
          title: "Billing Details",
          href: `/admin/users/${userId}/company/billing`,
          isActive: activeSubTab === "billing",
        },
        {
          title: "Business Location",
          href: `/admin/users/${userId}/company/business-location`,
          isActive: activeSubTab === "business-location",
        },
      ],
    },
  ];

  return (
    <>
      <Shell className="!p-0 gap-2">
        <PageHeader separated>
          <div className="flex flex-col md:flex-row justify-between md:items-center">
            <div>
              <PageHeaderHeading size="sm">{tabs.find((tab) => tab.isActive)?.title}</PageHeaderHeading>
              <PageHeaderDescription size="sm">{tabs.find((tab) => tab.isActive)?.description}</PageHeaderDescription>
            </div>
            <Tabs defaultValue={tabs.find((tab) => tab.isActive)?.href ?? tabs[0]?.href} onValueChange={(value) => router.push(value)}>
              <TabsList className="bg-secondary border">
                {tabs.map((tab) => (
                  <TabsTrigger key={tab.href} value={tab.href}>
                    <Link href={tab.href}>{tab.title}</Link>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </PageHeader>
        <CustomTabsList nav={tabs.find((tab) => tab.isActive)?.nav} />
      </Shell>
    </>
  );
};

export default AdminUserHeaderSection;

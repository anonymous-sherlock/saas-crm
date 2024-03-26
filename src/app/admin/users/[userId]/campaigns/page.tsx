import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/global/page-header";
import { CampaignSearchInput } from "@/components/search/campaign-search-input";
import UserCampaginsFilterTabs from "@/components/tabs/campaigns-filter-tabs";
import CampaignsResults from "@/components/template/campaigns/CampaignListResult";
import { UploadCampaignButton } from "@/components/template/campaigns/upload-campaign-button";
import { db } from "@/db";
import { getAllCampaigns } from "@/lib/actions/campaign.action";
import { CampaignsFilterValues } from "@/schema/filter.schema";
import { notFound } from "next/navigation";

interface CampaignsPageProps {
  searchParams: {
    q?: string;
    page?: string;
    status?: CampaignsFilterValues["status"];
  };
  params: {
    userId: string;
  };
}
async function UserCampaignsPage({ searchParams: { page, q, status }, params: { userId } }: CampaignsPageProps) {
  const filterValues: CampaignsFilterValues = { q, status };
  const user = await db.user.findFirst({ where: { id: userId } });
  if (!user) notFound();
  const pageNumber = page && page ? parseInt(page) : undefined;
  const data = await getAllCampaigns({ filterValues, page: pageNumber,userId: user.id });

  return (
    <div className="flex flex-col gap-4">
      <PageHeader separated>
        <div className="flex flex-col md:flex-row justify-between md:items-center">
          <div>
            <PageHeaderHeading size="sm" className="flex-1 capitalize">
              {user.name}&apos;s <span className="text-green-600">Campaigns</span>
            </PageHeaderHeading>
            <PageHeaderDescription size="sm">Manage Campaigns</PageHeaderDescription>
          </div>
          <div className="flex gap-2 justify-self-end">
            <UserCampaginsFilterTabs defaultValues={filterValues} />
            <UploadCampaignButton
              user={{
                id: user.id,
                name: user.name,
              }}
            />
          </div>
        </div>
      </PageHeader>
      <CampaignSearchInput baseUrl={`/admin/users/${userId}/campaigns`} placeholder="Search campaigns" className="bg-white h-11" defaultValues={filterValues} />
      <CampaignsResults data={data} />
    </div>
  );
}
export default UserCampaignsPage;

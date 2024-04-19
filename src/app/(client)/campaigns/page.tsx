import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/global/page-header";
import { CampaignSearchInput } from "@/components/search/campaign-search-input";
import UserCampaginsFilterTabs from "@/components/tabs/campaigns-filter-tabs";
import CampaignsResults from "@/components/template/campaigns/CampaignListResult";
import { UploadCampaignButton } from "@/components/template/campaigns/upload-campaign-button";
import { getAllCampaigns } from "@/lib/actions/campaign.action";
import { getAuthUser } from "@/lib/auth";
import { CampaignsFilterValues } from "@/schema/filter.schema";
import { authPages } from "@routes";
import { redirect } from "next/navigation";
export const dynamic = 'force-dynamic';

interface CampaignsPageProps {
  searchParams: {
    q?: string;
    page?: string;
    status?: CampaignsFilterValues["status"];
  };
}
async function CampaignsPage({ searchParams: { page, q, status } }: CampaignsPageProps) {
  const filterValues: CampaignsFilterValues = { q, status };
  const { authUserId, authUserName } = await getAuthUser();
  if (!authUserId) redirect(authPages.login);
  const pageNumber = page && page ? parseInt(page) : undefined;
  const data = await getAllCampaigns({ filterValues, page: pageNumber, userId: authUserId });

  return (
    <div className="flex flex-col gap-4">
      <PageHeader separated className="block md:grid">
        <div className="flex flex-col md:flex-row justify-between md:items-center">
          <div className="">
            <PageHeaderHeading size="sm" className="flex-1 capitalize">
              My Campaigns
            </PageHeaderHeading>
            <PageHeaderDescription size="sm">Manage Campaigns</PageHeaderDescription>
          </div>
          <div className="flex gap-2 justify-self-end flex-wrap md:flex-nowrap">
            <UserCampaginsFilterTabs defaultValues={filterValues} />
            <UploadCampaignButton
              user={{
                id: authUserId,
                name: authUserName,
              }}
            />
          </div>
        </div>
      </PageHeader>
      <CampaignSearchInput baseUrl="/campaigns" placeholder="Search campaigns" className="bg-white h-11" defaultValues={filterValues} />
      <CampaignsResults data={data} />
    </div>
  );
}
export default CampaignsPage;

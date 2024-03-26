import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/global/page-header";
import { CampaignSearchInput } from "@/components/search/campaign-search-input";
import UserCampaginsFilterTabs from "@/components/tabs/campaigns-filter-tabs";
import CampaignsResults from "@/components/template/campaigns/CampaignListResult";
import { getAllCampaigns } from "@/lib/actions/campaign.action";
import { CampaignsFilterValues } from "@/schema/filter.schema";

interface AdminCampaignsPageProps {
  searchParams: {
    q?: string;
    page?: string;
    status?: CampaignsFilterValues["status"];
  };
}

async function AdminCampaignsPage({ searchParams: { q, page, status } }: AdminCampaignsPageProps) {
  const filterValues: CampaignsFilterValues = { q, status };
  const pageNumber = page && page ? parseInt(page) : undefined;
  const data = await getAllCampaigns({ filterValues, page: pageNumber });
  return (
    <div className="flex flex-col gap-4">
      <PageHeader separated className="block md:grid">
        <div className="flex flex-col md:flex-row justify-between md:items-center">
          <div className="">
            <PageHeaderHeading size="sm" className="flex-1 capitalize">
              All Campaigns
            </PageHeaderHeading>
            <PageHeaderDescription size="sm">Manage Users Campaigns</PageHeaderDescription>
          </div>
          <div className="flex gap-2 justify-self-end flex-wrap md:flex-nowrap">
            <UserCampaginsFilterTabs defaultValues={filterValues} />
          </div>
        </div>
      </PageHeader>
      <CampaignSearchInput baseUrl="/admin/users-campaigns" placeholder="Search campaigns" className="bg-white h-11" defaultValues={filterValues} />
      <CampaignsResults data={data} />
    </div>
  );
}

export default AdminCampaignsPage;

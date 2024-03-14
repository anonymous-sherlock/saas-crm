import CampaignsResults from '@/components/admin/campaign/CampaignListResult';
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '@/components/global/page-header';
import { CampaignSearchInput } from '@/components/search/campaign-search-input';
import UserCampaginsFilterTabs from '@/components/tabs/campaigns-filter-tabs';
import { getAllCampaigns } from '@/lib/actions/campaign.action';
import { getActorUser, getCurrentUser } from '@/lib/auth';
import { CampaignsFilterValues } from '@/schema/filter.schema';

interface CampaignsPageProps {
  searchParams: {
    q?: string;
    page?: string;
    status?: CampaignsFilterValues["status"]
  };
}
async function CampaignsPage({ searchParams: { page, q, status } }: CampaignsPageProps) {
  const filterValues: CampaignsFilterValues = { q, status };
  const user = await getCurrentUser();
  const actor = await getActorUser(user)
  const userId = actor ? actor.userId : user?.id
  const pageNumber = page && page ? parseInt(page) : undefined
  const data = await getAllCampaigns({ filterValues, page: pageNumber, userId })
  
  return (
    <div className='flex flex-col gap-4'>
      <PageHeader className="flex flex-col md:flex-row justify-between md:items-center">
        <div>
          <div className="flex space-x-4">
            <PageHeaderHeading size="sm" className="flex-1">
              My Campaigns
            </PageHeaderHeading>
          </div>
          <PageHeaderDescription size="sm">
            Manage Campaigns
          </PageHeaderDescription>
        </div>
        <UserCampaginsFilterTabs defaultValues={filterValues} />
      </PageHeader>
      <CampaignSearchInput baseUrl='/campaigns' placeholder='Search campaigns' className="bg-white h-11" defaultValues={filterValues} />
      <CampaignsResults
        data={data}
        baseUrl='/campaigns'
      />
    </div>
  )
}
export default CampaignsPage
import CampaignsResults from '@/components/admin/campaign/CampaignListResult';
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '@/components/global/page-header';
import { CampaignSearchInput } from '@/components/search/campaign-search-input';
import UserCampaginsFilterTabs from '@/components/tabs/campaigns-filter-tabs';
import { getAllCampaigns } from '@/lib/actions/campaign.action';
import { CampaignsFilterValues } from '@/schema/filter.schema';


interface AdminCampaignsPageProps {
    searchParams: {
        q?: string;
        page?: string;
        status?: CampaignsFilterValues["status"]
    };
}


async function AdminCampaignsPage({ searchParams: { q, page, status } }: AdminCampaignsPageProps) {
    const filterValues: CampaignsFilterValues = { q, status };
    const pageNumber = page && page ? parseInt(page) : undefined
    const data = await getAllCampaigns({ filterValues, page: pageNumber, })
    return (
        <div className='flex flex-col gap-4'>
            <PageHeader className="flex flex-col md:flex-row justify-between md:items-center">
                <div>
                    <div className="flex space-x-4">
                        <PageHeaderHeading size="sm" className="flex-1">
                            Campaigns
                        </PageHeaderHeading>
                    </div>
                    <PageHeaderDescription size="sm">
                        Manage Users Campaigns
                    </PageHeaderDescription>
                </div>
                <UserCampaginsFilterTabs defaultValues={filterValues} />
            </PageHeader>
            <CampaignSearchInput baseUrl='/admin/user-campaigns' placeholder='Search campaigns' className="bg-white h-11" defaultValues={filterValues} />
            <CampaignsResults
                data={data}
                baseUrl='/campaigns'
            />
        </div>

    )
}

export default AdminCampaignsPage
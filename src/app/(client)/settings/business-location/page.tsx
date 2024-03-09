import CompanyBillingDetailsForm from "@/components/template/settings/company-billing-details-form";
import CompanyBusinessLocation from "@/components/template/settings/company-business-location-form";
import { getCurrentUser } from "@/lib/auth";
import { getCompanyDetails } from "@/lib/data/company.data";
import { notFound } from "next/navigation";

interface BunisessLocationPageProps { }
const BunisessLocationPage = async ({ }: BunisessLocationPageProps) => {
    const user = await getCurrentUser()
    if (!user) notFound()
    const company = await getCompanyDetails(user.isImpersonating ? user.actor.company.id : user?.company.id, { pick: ["country", "state", "city", "zipcode", "landmark", "address"] })
    if (!company) notFound()
    return (
        <main className="flex bg-white border rounded-sm p-8">
            <CompanyBusinessLocation data={company} />
        </main>
    )
}

export default BunisessLocationPage;
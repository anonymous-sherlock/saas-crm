import CompanyBillingDetailsForm from "@/components/template/settings/company-billing-details-form";
import { getCurrentUser } from "@/lib/auth";
import { getCompanyDetails } from "@/lib/data/company.data";
import { notFound } from "next/navigation";

interface BillingPageProps {}
const BillingPage = async ({}: BillingPageProps) => {
  const user = await getCurrentUser();
  if (!user) notFound();
  const companyId = user.isImpersonating ? user.actor.company.id : user?.company.id;
  const company = await getCompanyDetails(companyId, { pick: ["id", "billingContactPersonName", "billingContactPersonEmail", "billingContactPersonPhone"] });
  if (!company) notFound();
  return (
    <main className="flex bg-white border rounded-sm p-8">
      <CompanyBillingDetailsForm data={company} companyId={company.id} />
    </main>
  );
};

export default BillingPage;

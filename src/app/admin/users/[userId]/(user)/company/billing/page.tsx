import { OnboardingForm } from "@/components/forms/onboarding-form";
import CompanyBillingDetailsForm from "@/components/template/settings/company-billing-details-form";
import { db } from "@/db";
import { getCompanyDetails } from "@/lib/data/company.data";
import { notFound } from "next/navigation";

interface CompanyBillingPageProps {
  params: {
    userId: string;
  };
}
const CompanyBillingPage = async ({ params: { userId } }: CompanyBillingPageProps) => {
  const user = await db.user.findFirst({ where: { id: userId } });
  if (!user) notFound();
  if (!user.companyId) return <OnboardingForm className="max-w-full md:px-20" userId={user.id} />;
  const company = await getCompanyDetails(user.companyId, { pick: ["id", "billingContactPersonName", "billingContactPersonEmail", "billingContactPersonPhone"] });
  if (!company) return <OnboardingForm className="max-w-full md:px-20" userId={user.id} />;

  return (
    <main className="flex bg-white border rounded-sm p-8">
      <CompanyBillingDetailsForm data={company} companyId={company.id} />
    </main>
  );
};

export default CompanyBillingPage;

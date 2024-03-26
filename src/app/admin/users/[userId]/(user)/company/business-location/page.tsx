import { OnboardingForm } from "@/components/forms/onboarding-form";
import CompanyBillingDetailsForm from "@/components/template/settings/company-billing-details-form";
import CompanyBusinessLocation from "@/components/template/settings/company-business-location-form";
import { db } from "@/db";
import { getCurrentUser } from "@/lib/auth";
import { getCompanyDetails } from "@/lib/data/company.data";
import { notFound } from "next/navigation";

interface CompanyBunisessLocationPageProps {
  params: {
    userId: string;
  };
}
const CompanyBunisessLocationPage = async ({ params: { userId } }: CompanyBunisessLocationPageProps) => {
  const user = await db.user.findFirst({ where: { id: userId } });
  if (!user) notFound();
  if (!user.companyId) return <OnboardingForm className="max-w-full md:px-20" userId={user.id} />;
  const company = await getCompanyDetails(user.companyId, { pick: ["id", "country", "state", "city", "zipcode", "landmark", "address"] });
  if (!company) return <OnboardingForm className="max-w-full md:px-20" userId={user.id} />;
  return (
    <main className="flex bg-white border rounded-sm p-8">
      <CompanyBusinessLocation data={company} companyId={company.id} />
    </main>
  );
};

export default CompanyBunisessLocationPage;

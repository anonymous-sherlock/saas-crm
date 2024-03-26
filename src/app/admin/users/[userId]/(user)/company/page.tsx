import { OnboardingForm } from "@/components/forms/onboarding-form";
import CompanyDetailsForm from "@/components/template/settings/company-details-form";
import { db } from "@/db";
import { getCompanyDetails } from "@/lib/data/company.data";
import { notFound } from "next/navigation";

interface CompanyDetailsPageProps {
  params: {
    userId: string;
  };
}
export default async function CompanyDetailsPage({ params: { userId } }: CompanyDetailsPageProps) {
  const user = await db.user.findFirst({ where: { id: userId } });
  if (!user) notFound();
  if (!user.companyId) return <OnboardingForm className="max-w-full md:px-20" userId={user.id} />;
  const company = await getCompanyDetails(user?.companyId, { pick: ["id", "name", "phone", "contactPersonName", "contactPersonEmail", "gstNumber"] });
  if (!company) return <OnboardingForm className="max-w-full md:px-20" userId={user.id} />;

  return (
    <main className="flex bg-white border rounded-sm p-8 w-full">
      <CompanyDetailsForm data={company} companyId={company.id} />
    </main>
  );
}

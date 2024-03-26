import { OnboardingForm } from "@/components/forms/onboarding-form";
import CompanyDetailsForm from "@/components/template/settings/company-details-form";
import { getActorUser, getCurrentUser } from "@/lib/auth";
import { getCompanyDetails } from "@/lib/data/company.data";
import { notFound } from "next/navigation";

interface SettingsPageProps {}
const SettingsPage = async ({}: SettingsPageProps) => {
  const user = await getCurrentUser();
  if (!user) notFound();
  const actor = await getActorUser(user);
  const companyId = actor ? actor.company.id : user?.company.id;
  const company = await getCompanyDetails(companyId, { pick: ["id", "name", "phone", "contactPersonName", "contactPersonEmail", "gstNumber"] });
  if (!company) return <OnboardingForm />;

  return (
    <main className="flex bg-white border rounded-sm p-8 w-full">
      <CompanyDetailsForm data={company} companyId={company.id} />
    </main>
  );
};

export default SettingsPage;

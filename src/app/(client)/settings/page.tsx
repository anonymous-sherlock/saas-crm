import { OnboardingForm } from "@/components/onboarding/onboardingForm";
import CompanyDetailsForm from "@/components/template/settings/company-details-form";
import { getActorUser, getCurrentUser } from "@/lib/auth";
import { getCompanyDetails } from "@/lib/data/company.data";
import { notFound } from "next/navigation";

interface SettingsPageProps { }
const SettingsPage = async ({ }: SettingsPageProps) => {
	const user = await getCurrentUser()
	if (!user) notFound()
	const actor = await getActorUser(user)
	const company = await getCompanyDetails(actor ? actor.company.id : user?.company.id, { pick: ["id", "name", "phone", "contactPersonName", "contactPersonEmail", "gstNumber"] })
	if (!company) return <OnboardingForm />

	return (
		<main className="flex bg-white border rounded-sm p-8 w-full">
			<CompanyDetailsForm data={company} />
		</main>
	)
}

export default SettingsPage;
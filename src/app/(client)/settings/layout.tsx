import {
	PageHeader,
	PageHeaderDescription,
	PageHeaderHeading,
} from "@/components/global/page-header"
import { OnboardingForm } from "@/components/onboarding/onboardingForm"

import { Shell } from "@/components/shells/shell"
import { ComanySettingsTabs } from "@/components/tabs/comany-settings-tabs"
import { ProfileTabs } from "@/components/tabs/profile-tabs"
import { getCurrentUser } from "@/lib/auth"

interface SettingsLayoutProps extends React.PropsWithChildren {
}

export default async function SettingsLayout({
	children,
}: SettingsLayoutProps) {
	return (
		<Shell className="!p-0">
			<div>
				<ComanySettingsTabs />
				<div className="overflow-hidden mt-4">{children}</div>
			</div>
		</Shell>
	)
}

import {
	PageHeader,
	PageHeaderDescription,
	PageHeaderHeading,
} from "@/components/global/page-header"
import { Shell } from "@/components/shells/shell"
import { ComanySettingsTabs } from "@/components/tabs/comany-settings-tabs"

interface SettingsLayoutProps extends React.PropsWithChildren {
}

export default async function SettingsLayout({
	children,
}: SettingsLayoutProps) {
	return (
		<Shell className="!p-0">
			<PageHeader className="flex flex-col mb-4 md:mb-0 md:flex-row justify-between md:items-center">
				<div>
					<div className="flex space-x-4">
						<PageHeaderHeading size="sm" className="flex-1">
							Company Details
						</PageHeaderHeading>
					</div>
					<PageHeaderDescription size="sm">
						Manage your company details
					</PageHeaderDescription>
				</div>
			</PageHeader>
			<div>
				<ComanySettingsTabs />
				<div className="overflow-hidden mt-4">{children}</div>
			</div>
		</Shell>
	)
}

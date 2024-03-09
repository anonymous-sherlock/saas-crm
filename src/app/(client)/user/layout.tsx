
import {
    PageHeader,
    PageHeaderDescription,
    PageHeaderHeading,
} from "@/components/global/page-header"

import { Shell } from "@/components/shells/shell"
import {ProfileTabs} from "@/components/tabs/profile-tabs"

interface ProfileLayoutProps extends React.PropsWithChildren {
}

export default async function ProfileLayout({
    children,
}: ProfileLayoutProps) {
    return (
        <Shell className="!p-0">
            <div className="flex flex-col gap-2 pr-1 xxs:flex-row">
                <PageHeader className="flex-1">
                    <PageHeaderHeading size="sm" className="!text-[1.6rem]">Profile Settings</PageHeaderHeading>
                    <PageHeaderDescription size="sm">
                        Manage your Account
                    </PageHeaderDescription>
                </PageHeader>

            </div>
            <div>
                <ProfileTabs />
                <div className="overflow-hidden mt-4">{children}</div>
            </div>
        </Shell>
    )
}

import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '@/components/global/page-header'
import MediaComponent from '@/components/media'
import MediaUploadButton from '@/components/media/upload-buttons'
import { OnboardingForm } from '@/components/onboarding/onboardingForm'
import { getMedia } from '@/lib/actions/media.action'
import { getActorUser, getCurrentUser } from '@/lib/auth'
import React from 'react'

type Props = {}

const MediaPage = async ({ }: Props) => {
    const user = await getCurrentUser()
    const actor = await getActorUser(user)
    if ((actor && !actor.company.id) || (!user?.company.id)) return <OnboardingForm />
    const companyId = (actor ? actor.company.id : user.company.id) ?? ""
    const data = await getMedia(actor ? actor?.company.id ?? "" : user?.company.id)

    return (

        <div className="flex flex-col gap-4 h-full w-full">
            <PageHeader className="flex flex-col md:flex-row justify-between md:items-center">
                <div>
                    <div className="flex space-x-4">
                        <PageHeaderHeading size="sm" className="flex-1">
                            Media Buckets
                        </PageHeaderHeading>
                    </div>
                    <PageHeaderDescription size="sm">
                        Manage media files
                    </PageHeaderDescription>
                </div>
                <MediaUploadButton companyId={companyId} />
            </PageHeader>
            <MediaComponent
                data={data}
                companyId={companyId}
            />
        </div>

    )
}

export default MediaPage

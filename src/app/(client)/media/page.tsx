import MediaComponent from '@/components/media'
import { OnboardingForm } from '@/components/onboarding/onboardingForm'
import { getMedia } from '@/lib/actions/media.action'
import { getActorUser, getCurrentUser } from '@/lib/auth'
import React from 'react'

type Props = {}

const MediaPage = async ({ }: Props) => {
    const user = await getCurrentUser()
    const actor = await getActorUser(user)
    if ((actor && !actor.company.id) || (!user?.company.id)) return <OnboardingForm />

    const data = await getMedia(actor ? actor?.company.id ?? "" : user?.company.id)

    return (
        <>
            <MediaComponent
                data={data}
                companyId={user.company.id}
            />
        </>
    )
}

export default MediaPage

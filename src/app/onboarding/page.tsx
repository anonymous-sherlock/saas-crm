import TitleSection from '@/components/landing-page/title-section'
import { OnboardingForm } from '@/components/onboarding/onboardingForm'
import { Shell } from '@/components/shells/shell'
import { getCurrentIsOnboarded, getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { DEFAULT_DASHBOARD_REDIRECT, DEFAULT_LOGIN_REDIRECT } from 'routes'

async function Onboardingpage() {
    const user = await getCurrentUser()
    if (!user) redirect(DEFAULT_LOGIN_REDIRECT)
    const isOnboarded = await getCurrentIsOnboarded()
    if (isOnboarded) redirect(DEFAULT_DASHBOARD_REDIRECT)
    return (
        <main className='flex flex-col gap-2 md:gap-6 md:p-20 justify-center items-center min-h-screen grainy relative'>
            <Shell className='p-5 md:container max-w-3xl mx-auto'>
                <TitleSection
                    title="Onboarding Process"
                    subheading="Join thousands of satisfied users who rely on our platform for their personal and professional productivity needs."
                    pill="onboarding"
                />
                <OnboardingForm />
            </Shell>

        </main>
    )
}
export default Onboardingpage
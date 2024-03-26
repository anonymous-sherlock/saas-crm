import { DashboardCharts } from '@/components/dashboard/DashboardCharts';
import OverviewCard from '@/components/dashboard/OverviewCard';
import { Card, CardContent } from '@/components/ui/card';
import { getCurrentIsOnboarded } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { ONBOARDING_REDIRECT } from '@routes';
import { type Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export const metadata: Metadata = {
    title: "Adscrush | Dashboard",
    description: "",
};
export default async function DashboardPage() {
    const isOnboarded = await getCurrentIsOnboarded()
    if (!isOnboarded) redirect(ONBOARDING_REDIRECT)
    return (
        <Suspense fallback={<p>Loading feed...</p>}>
            <div className="">
                <OverviewCard />
            </div>
            <Card className='p-6 mt-8'>
                <CardContent className={cn("p-2")}>
                    <DashboardCharts />
                </CardContent>
            </Card>
        </Suspense>
    )
}
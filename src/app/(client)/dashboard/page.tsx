import {DashboardCharts} from '@/components/dashboard/DashboardCharts';
import OverviewCard from '@/components/dashboard/OverviewCard';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { type Metadata } from 'next';
import React, { Suspense } from 'react'

export const metadata: Metadata = {
    title: "Adscrush | Dashboard",
    description: "",
};
export default function DashboardPage() {
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
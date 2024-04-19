import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import OverviewCard from "@/components/dashboard/OverviewCard";
import { Card, CardContent } from "@/components/ui/card";
import { getAuthUser, getCurrentIsOnboarded } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { ONBOARDING_REDIRECT } from "@routes";
import { type Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Skeleton from "react-loading-skeleton";

export const metadata: Metadata = {
  title: "Adscrush | Dashboard",
  description: "",
};
export default async function DashboardPage() {
  const [isOnboarded, authUser] = await Promise.all([getCurrentIsOnboarded(), getAuthUser()]);
  if (!isOnboarded || !authUser.authUserId) redirect(ONBOARDING_REDIRECT);
  return (
    <Suspense fallback={<Skeleton height={200} className="my-2" count={3} />}>
      <div>
        <OverviewCard />
      </div>
      <Card className="p-6 mt-8">
        <CardContent className={cn("p-2")}>
          <DashboardCharts />
        </CardContent>
      </Card>
    </Suspense>
  );
}

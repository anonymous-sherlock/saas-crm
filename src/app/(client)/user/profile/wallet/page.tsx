import { InfoCard } from "@/components/dashboard/info-cards";
import { DataTableSkeleton } from "@/components/tables/global/data-table-skeleton";
import { PaymentsTableShell } from "@/components/tables/payments_table/payments-table-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAuthUser } from "@/lib/auth";
import { authPages } from "@routes";
import { redirect } from "next/navigation";
import React from "react";

export default async function WalletPage() {
  const { authUserId } = await getAuthUser();
  if (!authUserId) redirect(authPages.login);
  return (
    <>
      <InfoCard userId={authUserId} />
      <React.Suspense>
        <Card className="col-span-3 !mt-0">
          <CardHeader>
            <CardTitle>Recent Transaction</CardTitle>
            <CardDescription>You made 0 transaction total.</CardDescription>
          </CardHeader>
          <CardContent>
            <React.Suspense fallback={<DataTableSkeleton columnCount={6} />}>
              <PaymentsTableShell data={[]} userId={authUserId} />
            </React.Suspense>
          </CardContent>
        </Card>
      </React.Suspense>
    </>
  );
}

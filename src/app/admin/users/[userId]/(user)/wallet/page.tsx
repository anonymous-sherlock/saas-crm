import { InfoCard } from "@/components/dashboard/info-cards";
import { AddWalletBalanceForm } from "@/components/forms/add-wallet-balance-form";
import { DataTableSkeleton } from "@/components/tables/global/data-table-skeleton";
import { PaymentsTableShell } from "@/components/tables/payments_table/payments-table-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { getDateFromParams } from "@/lib/helpers/date";
import { payment } from "@/server/api/payment";
import { notFound } from "next/navigation";
import React from "react";

interface UserWalletPageProps {
  params: {
    userId: string;
  };
  searchParams: {
    date?: string;
  };
}
export default async function UserWalletPage({ params: { userId }, searchParams: { date } }: UserWalletPageProps) {
  const user = await db.user.findFirst({ where: { id: userId } });
  if (!user) notFound();
  const { from, to } = getDateFromParams(date);
  const payments = await payment.getAll({ userId: user?.id, date: { from, to }, limit: undefined });

  return (
    <>
      <InfoCard userId={user.id} />
      <AddWalletBalanceForm userId={user.id} />
      <React.Suspense>
        <Card className="col-span-3 !mt-0">
          <CardHeader>
            <CardTitle>Recent Transaction</CardTitle>
            <CardDescription>You made 0 transaction total.</CardDescription>
          </CardHeader>
          <CardContent>
            <React.Suspense fallback={<DataTableSkeleton columnCount={6} />}>
              <PaymentsTableShell data={payments} userId={user.id} />
            </React.Suspense>
          </CardContent>
        </Card>
      </React.Suspense>
    </>
  );
}

"use server";
import { cn, formatPrice, safeExecute } from "@/lib/utils";
import { Icons } from "../Icons";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { server } from "@/app/_trpc/server";

interface InfoCardProps {
  className?: string;
  userId: string;
}

export async function InfoCard({ className, userId }: InfoCardProps) {
  const data = await safeExecute(() => server.wallet.getDetails({ userId }));

  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6", className)}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
          <Icons.revenue className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatPrice(data?.totalBalance.amount ?? 0)}</div>
          <p className="text-xs text-muted-foreground">Lifetime Balance including the amount spent on leads.</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
          <Icons.wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatPrice(data?.wallet.balance ?? 0)}</div>
          <p className="text-xs text-muted-foreground">Balance you can able to use for leads</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
          <Icons.wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatPrice(data?.totalSpent.amount ?? 0)}</div>
          <p className="text-xs text-muted-foreground">The amount you have spent on leads</p>
        </CardContent>
      </Card>
    </div>
  );
}

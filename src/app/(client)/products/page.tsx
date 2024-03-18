import { server } from "@/app/_trpc/server";
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/global/page-header";
import { DataTableSkeleton } from "@/components/tables/global/data-table-skeleton";
import ProductTableShell from "@/components/tables/products_table/product-table-shell";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getActorUser, getCurrentUser } from "@/lib/auth";
import { getDateFromParams } from "@/lib/helpers/date";
import { product } from "@/server/api/product";
import { ProductsPageSearchParams } from "@/types";
import { authPages } from "@routes";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import "server-only";

interface ProductPageProps {
  searchParams: ProductsPageSearchParams
}
export default async function ProductPage({ searchParams: { date } }: ProductPageProps) {
  const user = await getCurrentUser()
  const actor = await getActorUser(user)
  if (!user) redirect(authPages.login)
  const userId = actor ? actor.userId : user.id
  const { from, to } = getDateFromParams(date)
  const products = await product.getAll({ date: { from, to }, userId: userId })

  return (
    <>
      <PageHeader separated >
        <div className="flex flex-col mb-4 md:mb-0 md:flex-row justify-between md:items-center">
          <div>
            <div className="flex space-x-4">
              <PageHeaderHeading size="sm" className="flex-1">
                All Products
              </PageHeaderHeading>
            </div>
            <PageHeaderDescription size="sm">
              Manage Products
            </PageHeaderDescription>
          </div>
          <Link href="/products/create" className={buttonVariants({ variant: "default" })}  >
            Add Product
          </Link>
        </div>
      </PageHeader>
      <div className="p-0 md:!pt-4">
        <React.Suspense>
          <Card className="col-span-3 !mt-0">
            <CardHeader>
              <CardTitle>Welcome back!</CardTitle>
              <CardDescription>
                Here&apos;s a list of all your products!.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <React.Suspense fallback={<DataTableSkeleton columnCount={6} />}>
                <ProductTableShell data={products ?? []} />
              </React.Suspense>
            </CardContent>
          </Card>
        </React.Suspense>
      </div>
    </>
  );
}
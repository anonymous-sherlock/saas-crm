import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/global/page-header";
import { DataTableSkeleton } from "@/components/tables/global/data-table-skeleton";
import ProductTableShell from "@/components/tables/products_table/product-table-shell";
import { UploadProductButton } from "@/components/template/products/upload-product-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { getDateFromParams } from "@/lib/helpers/date";
import { product } from "@/server/api/product";
import { ProductsPageSearchParams } from "@/types";
import { notFound } from "next/navigation";
import React from "react";
import "server-only";

interface ProductPageProps {
  searchParams: ProductsPageSearchParams;
  params: {
    userId: string;
  };
}
export default async function UserProductPage({ searchParams: { date }, params: { userId } }: ProductPageProps) {
  const user = await db.user.findFirst({ where: { id: userId } });
  if (!user) notFound();
  const { from, to } = getDateFromParams(date);
  const products = await product.getAllProducts({ date: { from, to }, userId: user.id });

  return (
    <>
      <PageHeader separated>
        <div className="flex flex-col mb-4 md:mb-0 md:flex-row justify-between md:items-center">
          <div>
            <div className="flex space-x-4">
              <PageHeaderHeading size="sm" className="flex-1">
                {user.name}&apos;s <span className="text-green-600">All Products</span>
              </PageHeaderHeading>
            </div>
            <PageHeaderDescription size="sm">Manage Products</PageHeaderDescription>
          </div>
          <UploadProductButton user={{ name: user.name, id: user.id }} />
        </div>
      </PageHeader>
      <div className="p-0 md:!pt-4">
        <React.Suspense>
          <Card className="col-span-3 !mt-0">
            <CardHeader>
              <CardTitle>Welcome back!</CardTitle>
              <CardDescription>Here&apos;s a list of all your products!.</CardDescription>
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

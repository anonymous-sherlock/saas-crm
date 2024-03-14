import { server } from "@/app/_trpc/server";
import ProductTableShell from "@/components/tables/products_table/product-table-shell";
import { buttonVariants } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import { authPages } from "@routes";
import { Ghost } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import "server-only";


export default async function ProductPage() {
  const user = await getCurrentUser()
  if (!user) redirect(authPages.login)
  const products = await server.product.getAll();

  return (
    <>
      <div className="border h-full flex-1 flex-col space-y-8 rounded-lg bg-white p-8 md:flex">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Welcome back!
            </h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of all your Products!
            </p>
          </div>
          <Link href="/products/create" className={buttonVariants({ size: "sm", variant: "outline" })}  >
            Add a Product
          </Link>
        </div>
        {products.length === 0 ? (
          <div className="!mb-20 !mt-20 flex flex-col items-center gap-2">
            <Ghost className="h-8 w-8 text-zinc-800" />
            <h3 className="text-xl font-semibold">
              Pretty empty around here
            </h3>
            <p>Let&apos;s upload your first product.</p>
          </div>
        ) : (
          <ProductTableShell data={products} />
        )}
      </div>
    </>
  );
}
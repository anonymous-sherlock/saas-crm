import { getAuthSession } from "@/lib/authOption";
import { db } from "@/db";
import { Session } from "next-auth";
import { notFound } from "next/navigation";
import ImageSlider from '@/components/ImageSlider'
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Check, Shield } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn, formatPrice } from "@/lib/utils";
import { PRODUCT_CATEGORIES } from "@/constants/index";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface PageProps {
  params: {
    productId: string
  }
}

export default async function Page({ params }: PageProps) {
  const product = await db.product.findFirst({
    where: {
      productId: params.productId
    },
    include: {
      images: true
    }
  })
  if (!product) return notFound()


  const label = PRODUCT_CATEGORIES.find(
    ({ value }) => value === product.category
  )?.label

  const validUrls = product.images
    .map(({ url }) =>
      typeof url === 'string' ? url : url
    )
    .filter(Boolean) as string[]
  return (
    <Card className={cn("")}>
      <div className="border h-full w-full! flex-col space-y-8 rounded-lg bg-white p-8 md:flex">
        {/* top bar */}
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Product details
            </h2>
            <p className="text-muted-foreground">
            </p>
          </div>
          <Link
            href="/products/create"
            className={buttonVariants({ size: "sm", variant: "outline" })}>
            Add a Product
          </Link>
        </div>

        {/* product details section */}
        <section className="flex gap-4">

          <div className='relative w-[30%]'>
            <div className='relative w-wull aspect-square rounded-lg'>
              <ImageSlider urls={validUrls} />

            </div>
          </div>

          <div className="ml-4">
            <h1 className='text-3xl font-bold tracking-tight text-gray-700 sm:text-4xl'>
              {product.name}
            </h1>
            {/* product additinal information */}
            <div className='mt-4'>
              <div className='flex items-center'>
                <p className='font-medium text-gray-900'>
                  {formatPrice(product.price)}
                </p>

                <div className='ml-4 border-l text-muted-foreground border-gray-300 pl-4'>
                  <Badge variant="default" className=" rounded-sm text-white">{label}</Badge>
                </div>
              </div>

              <div className='mt-4 space-y-6'>
                <p className='text-base text-muted-foreground'>
                  {product.description}
                </p>
              </div>

              <div className='mt-6 flex items-center'>
                <Check
                  aria-hidden='true'
                  className='h-5 w-5 flex-shrink-0 text-green-500'
                />
                <p className='ml-2 text-sm text-muted-foreground'>
                  Eligible for instant delivery
                </p>
              </div>
            </div>
          </div>

        </section>


      </div>

    </Card>
  )
}

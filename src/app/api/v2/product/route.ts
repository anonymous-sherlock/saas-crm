import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";
import { db } from "@/db";
import { env } from "@/env.mjs";
import { getCurrentUser } from "@/lib/auth";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

async function getSelectedProduct(selectedId: string | undefined | null) {
  if (selectedId) {
    return await db.product.findUnique({
      where: { id: selectedId },
      include: { images: true },
    });
  }
  return null;
}

export async function GET(req: NextRequest, res: NextResponse) {
  const queryParams = req.nextUrl.searchParams;
  const user = await getCurrentUser();
  const searchLimit = queryParams.get("limit");
  const productsPerPage = parseInt(searchLimit ?? "", 10) || 5;

  const selectedId = queryParams.get("selectedId");
  const searchString = queryParams.get("q")
    ?.split(" ")
    .filter((word) => word.length > 0)
    .join(" & ");

  const limit = productsPerPage;
  const offset = queryParams.get("offset") ? parseInt(queryParams.get("offset") ?? "", 10) || 0 : 0;

  try {
    const selectedProduct = await getSelectedProduct(selectedId);
    const whereClause: Prisma.ProductWhereInput = {
      OR: [
        { name: { contains: searchString ?? "" } },
        { id: { contains: searchString ?? "" } },
        { category: { contains: searchString ?? "" } },
      ],
      NOT: { id: selectedProduct?.id },
    };

    const products = await db.product.findMany({
      where: {
        ownerId: user?.isImpersonating ? user.actor.userId : user?.id,
        ...whereClause,
      },
      include: { images: true },
      take: productsPerPage,
      skip: offset,
      orderBy: {
        createdAt: "desc",
      },
    });
    const totalProductCount = await db.product.count({
      where: {
        ownerId: user?.actor ? user.actor.userId : user?.id,
      },
    });

    const nextUrl =
      offset + limit < totalProductCount
        ? `${env.NEXT_PUBLIC_APP_URL}/api/v2/product?offset=${offset + limit}&limit=${productsPerPage}`
        : null;
    const previousUrl =
      offset - limit >= 0
        ? `${env.NEXT_PUBLIC_APP_URL}/api/v2/product?offset=${Math.max(0, offset - limit)}&limit=${productsPerPage}`
        : null;

    return NextResponse.json(
      {
        count: totalProductCount,
        next: nextUrl,
        previous: previousUrl,
        results: products,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong", brief: error }, { status: 500 });
  }
}

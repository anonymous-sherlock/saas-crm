import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";
import { db } from "@/db";
import { getAuthSession } from "@/lib/authOption";
import { NextRequest, NextResponse } from "next/server";

async function getSelectedProduct(selectedId: string | null) {
  if (selectedId) {
    return await db.product.findUnique({
      where: { productId: selectedId },
      include: { images: true },
    });
  }
  return null;
}

export async function GET(req: NextRequest, res: NextResponse) {
  const session = await getAuthSession();
  const user = session?.user;

  const queryParams = req.nextUrl.searchParams;
  const productName = queryParams.get("name");
  const selectedId = queryParams.get("selectedId");
  const limit = parseInt(queryParams.get("limit") ?? INFINITE_QUERY_LIMIT.toString(), 10);
  const cursor = queryParams.get("cursor");

  try {
    const selectedProduct = await getSelectedProduct(selectedId);
    const whereClause = {
      OR: [{ name: { contains: productName ?? "" } }, { productId: { contains: productName ?? "" } }, { category: { contains: productName ?? "" } }],
      NOT: { productId: selectedProduct?.productId },
    };
    const products = await db.product.findMany({
      where: {
        ownerId: user?.id,
        ...whereClause,
      },
      include: { images: true },
      take: limit + 1, // Fetch one extra item to check if there's a next page
      cursor: cursor ? { productId: cursor } : undefined,
      orderBy: {
        createdAt: "desc",
      },
    });

    let nextCursor: typeof cursor | undefined = undefined;

    if (products.length > limit) {
      const nextItem = products.pop();
      nextCursor = nextItem?.productId;
    }

    let productsArray = [...products];
    if (selectedProduct) {
      productsArray.unshift(selectedProduct);
    }
    return NextResponse.json({ nextCursor, data: productsArray }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong", brief: error }, { status: 500 });
  }
}

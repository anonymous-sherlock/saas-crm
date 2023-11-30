import { db } from "@/db";
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
  const queryParams = req.nextUrl.searchParams;

  const productName = queryParams.get("name");
  const selectedId = queryParams.get("selectedId");
  const limit = queryParams.get("limit");
  const page = queryParams.get("page");

  try {
    const selectedProduct = await getSelectedProduct(selectedId);


    const products = await db.product.findMany({
      where: {
        OR: [
          { name: { contains: productName ?? "" } },
          { productId: { contains: productName ?? "" } },
          { category: { contains: productName ?? "" } },
        ],
        NOT: { productId: selectedProduct?.productId },
      },

      include: {
        images: true,
      },
      take: parseInt(limit ?? "8", 10),
    });

    if (!products) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    let productsArray = Object.entries(products).map((e) => e[1]);

    if (selectedProduct) {
      productsArray = [selectedProduct, ...productsArray].slice(0, parseInt(limit ?? "8", 10));
    }
    return NextResponse.json({ data: productsArray }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Something went wrong", brief: error }, { status: 500 });
  }
}

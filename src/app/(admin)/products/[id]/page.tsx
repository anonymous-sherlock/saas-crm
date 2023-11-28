import { getAuthSession } from "@/lib/authOption";
import { db } from "@/db";
import { Session } from "next-auth";
import { notFound } from "next/navigation";

async function getData({ id }: { id: string }) {
  const session = await getAuthSession();
  const { user } = session as Session;
  if (!user || !user.id) {
    return notFound();
  }
  // Retrieve the 'products' array property from the result
  const product = await db.product.findFirst({
    where: {
      ownerId: user.id,
      productId: id,
    },
  });

  return product;
}
export default async function Page({
  params,
}: {
  params: { id: string };
}) {
  return <div>{JSON.stringify(params.id)}</div>;
}

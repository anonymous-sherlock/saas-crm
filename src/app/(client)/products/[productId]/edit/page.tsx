import { ProductForm } from "@/components/template/products/ProductForm";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { getActorUser, getCurrentUser } from "@/lib/auth";
import { product } from "@/server/api/product";
import { authPages } from "@routes";
import { redirect } from "next/navigation";

interface ProductEditPageProps {
  params: {
    productId: string;
  };
}

export default async function ProductEditPage({ params }: ProductEditPageProps) {
  const user = await getCurrentUser();
  if (!user) redirect(authPages.login);
  const actor = await getActorUser(user);
  const userId = actor ? actor.userId : user?.id;
  const userProduct = await product.getSingleProduct({ userId: userId, productId: params.productId });

  return (
    <div className="flex">
      <div className="w-full">
        <Card className="bg-white p-6">
          <CardTitle>Edit Product Details</CardTitle>
          <CardContent className="mt-8 w-full p-0">
            <ProductForm product={userProduct} type="update" userId={userProduct?.ownerId ?? ""} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

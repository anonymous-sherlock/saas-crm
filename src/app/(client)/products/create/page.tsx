import { ProductForm } from "@/components/template/products/ProductForm";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { getActorUser, getCurrentUser } from "@/lib/auth";
import { authPages } from "@routes";
import { Metadata } from "next";
import { redirect } from "next/navigation";
export const metadata: Metadata = {
  title: "Adscrush | Add Product",
  description: "",
};
interface AddProductsPageProps {}
async function AddProductsPage({}: AddProductsPageProps) {
  const user = await getCurrentUser();
  if (!user) redirect(authPages.login);
  const actor = await getActorUser(user);
  const userId = actor ? actor.userId : user?.id;
  return (
    <>
      <div className="flex">
        <div className="w-full">
          <Card className="bg-white p-6">
            <CardTitle>Add a Product</CardTitle>
            <CardContent className="mt-8 w-full p-0">
              <ProductForm type="create" userId={userId} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

export default AddProductsPage;

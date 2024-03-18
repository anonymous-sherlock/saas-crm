import { ProductForm } from "@/components/template/products/ProductForm";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Adscrush | Add Product",
  description: "",
};
interface AddProductsPageProps {

}
async function AddProductsPage({ }: AddProductsPageProps) {

  return (
    <>
      <div className="flex">
        <div className="w-full">
          <ProductForm title='Add a Product' type="create" />
        </div>
      </div>
    </>

  );
}

export default AddProductsPage



import { ProductForm } from "@/components/template/products/ProductForm";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Adscrush | Add Product",
  description: "",
};

function AddProductsPage() {
  return (
    <>
      <div className="flex">
        <div className="w-full">
          <ProductForm edit={false} />
        </div>
      </div>
    </>

  );
}

export default AddProductsPage



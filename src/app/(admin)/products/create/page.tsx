import { ProductForm } from "@/components/products/ProductForm";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Adscrush | Add Product",
  description: "",
};

function AddProductsPage() {
  return (
    <>

      <div className="flex">
        <div className="flex- w-full">
          <ProductForm />
        </div>
      </div>
    </>

  );
}

export default AddProductsPage



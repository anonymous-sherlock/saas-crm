"use client";
import { CustomModal } from "@/components/global/custom-modal";
import { Button } from "@/components/ui/button";
import { useModal } from "@/providers/modal-provider";
import { FC } from "react";
import { ProductForm } from "./ProductForm";

interface UploadProductButtonProps {
  user: {
    id: string;
    name: string;
  };
}

export const UploadProductButton: FC<UploadProductButtonProps> = ({ user }) => {
  const { setOpen } = useModal();

  return (
    <Button
      onClick={() =>
        setOpen(
          <CustomModal size="5xl" title={`Create a new product`} subheading={`Add this product for user ${user.name}`}>
            <ProductForm type="create" userId={user.id} />
          </CustomModal>,
        )
      }
    >
      Add Product
    </Button>
  );
};

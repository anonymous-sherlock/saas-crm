"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";

import { trpc } from "@/app/_trpc/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { toast as hotToast } from "react-hot-toast";
import { Button, buttonVariants } from "@/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { productRowSchema } from "./schema";
import Spinner from "@/components/ui/spinner";
import Link from "next/link";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const router = useRouter();
  const utils = trpc.useUtils();

  const product = productRowSchema.parse(row.original);
  const { mutate: deleteProduct, isLoading } = trpc.product.deleteProduct.useMutation({
    onSuccess: (data) => {
      toast({
        title: `${data.deletedCount} Product Deleted succesfully`,
        description: "",
        variant: "success",
      });
      utils.product.getAll.invalidate()
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 500) {
          return toast({
            title: "Cannot Delete Product.",
            description: "",
            variant: "destructive",
          });
        }
      }
    },

  });

  function handleRowClick() {
    const currentRow = product;
    const payload = currentRow.productId;

    deleteProduct({ productIds: [payload] });
  }
  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center">
          <Spinner /> {/* Replace with your loading indicator component */}
        </div>
      ) : (
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
              >
                <DotsHorizontalIcon className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuItem className="cursor-pointer"><Link href={`/products/${product.productId}/edit`} className="w-full">Edit</Link></DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer"><Link href={`/products/${product.productId}`} className="w-full">View Product</Link></DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" 
                onClick={()=>{
                  navigator.clipboard.writeText(product.productId.toString());
                  hotToast.success('Successfully copied product ID')

                }}
              >Copy Product ID</DropdownMenuItem>
              <DropdownMenuSeparator />
              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="text-red-600 cursor-pointer" disabled={isLoading}>
                  Delete
                  <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* dialog content */}
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                Products and its related campaign from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleRowClick}
                disabled={isLoading}
                className={buttonVariants({ variant: "destructive" })}
              >
                {isLoading ? "Deleting..." : "Delete Product"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
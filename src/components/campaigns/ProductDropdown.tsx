"use client";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { cn } from "@/lib/utils";
import { ProductSearchPayload } from "@/schema/productSchema";
import { Prisma } from "@prisma/client";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Check, RefreshCw } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import notFoundImage from "@/public/product-not-found.jpg"

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import Spinner from "../ui/spinner";



type ProductWithImagesPayload = Prisma.ProductGetPayload<{
  include: {
    images: true
  }
}>


const ProductDropdown = () => {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string | null>("");
  const debouncedValue = useDebounce(searchText, 500);
  const {
    data: products,
    isFetching,
    isFetched,

    refetch,
  } = useQuery<{ data: ProductWithImagesPayload[] }>({
    queryKey: ["product", debouncedValue,],
    queryFn: async () => {
      const payload: ProductSearchPayload = {
        name: debouncedValue as string,
        selectedId: selectedProduct as string,
      };
      const { data } = await axios.get("/api/search/product", {
        params: payload,
      });
      return data;
    },
    onError: (err) => { },
    enabled: !!debouncedValue,
  });

  const { setValue, getValues, } = useFormContext();

  const [open, setOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handlePopupTrigger = () => {
    refetch();
    setIsPopupOpen(true);
  };

  const getProductCategory = () => {
    const selectedProductId = getValues("product");
    const selectedProduct = products?.data.find(
      (p) => p.productId === selectedProductId
    );

    return selectedProduct?.category?.length
      ? selectedProduct.category
      : "no category";
  };

  const getProductName = () => {
    const selectedProductId = getValues("product");
    const selectedProduct = products?.data.find(
      (p) => p.productId === selectedProductId
    );

    return selectedProduct?.name || "Select a Product";
  };

  return (
    <section>
      {/* product dropdown */}

      <Popover open={isPopupOpen} onOpenChange={setIsPopupOpen}>
        <PopoverTrigger asChild onClick={handlePopupTrigger}>
          <div className="mb-4 mt-2 flex w-full flex-col items-start justify-between rounded-md border px-4 py-3 sm:flex-row sm:items-center">
            <p className="text-sm font-medium leading-none flex justify-start items-center">
              <span className="mr-2 rounded-md bg-primary px-2 py-1 text-xs text-primary-foreground flex-grow flex-shrink-0">
                {getProductCategory()}
              </span>
              <span className="text-muted-foreground line-clamp-1 leading-7 whitespace-pre-line">
                {getProductName()}
              </span>
            </p>

            <DropdownMenu open={open} onOpenChange={setOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <DotsHorizontalIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuGroup>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => {
                      setSelectedProduct(null);
                      setValue("product", "");
                      setSearchText("");
                    }}
                  >
                    Remove
                    <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 max-w-[360px] min-w-[340px]">
          <Command className="m-0 h-full w-full p-0">
            <CommandInput
              placeholder="Search..."
              value={searchText ? searchText : ""}
              onValueChange={(e) => setSearchText(e)}

            />
            <CommandList>
              <CommandEmpty>
                {isFetching ? <><Spinner />Fetching Products...</> : "No results found."}
              </CommandEmpty>
              <CommandGroup heading="Products">
                {isFetched &&
                  products &&
                  products?.data
                    ?.sort((a: ProductWithImagesPayload, b: ProductWithImagesPayload) => {
                      if (a.productId === getValues("product")) {
                        return -1; // Move a to the beginning
                      } else if (b.productId === getValues("product")) {
                        return 1; // Move b to the beginning
                      }
                      return 0; // No change in order
                    }
                    )
                    .map((product: ProductWithImagesPayload, i) => {
                      const isSelected = product.productId === selectedProduct;

                      if (i === products.data.length - 1) {
                        return (
                          <CommandItem key={i} className="flex justify-center items-center mx-auto"><Spinner />
                            load more
                          </CommandItem>
                        )
                      }
                      return (
                        <CommandItem
                          key={product.productId}
                          value={product.productId}

                          onSelect={(currentValue) => {
                            const currentProduct = getValues("product");
                            const newProduct =
                              product === currentProduct ? "" : product.productId;
                            setValue("product", newProduct);
                            setSelectedProduct(product.productId);
                            setIsPopupOpen(false);
                          }}

                          aria-selected={isSelected}
                          className={cn("flex gap-2 cursor-pointer max-h-16 min-h-16 my-1 hover:bg-none")}
                        >
                          <div className="h-4 w-4">
                            {isSelected && <Check className={cn("w-full h-full font-semibold")} />}
                          </div>
                          <Image src={product.images[0].url || notFoundImage.src} alt={product.name} width={30} height={20} sizes="50px" className="rounded-sm"
                            style={{ width: 30 }}
                            blurDataURL={notFoundImage.blurDataURL} />
                          <div className="w-full w-max-[140px] truncate">
                            <div className="ml-3 flex flex-col w-[calc(100%-10px)]">
                              <span className="text-sm font-medium text-gray-900">
                                {product.name}
                              </span>
                              <span className="text-sm truncate w-[calc(100%-30px)]">
                                {product.description}
                              </span>
                            </div>
                          </div>
                        </CommandItem>
                      );
                    })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <div className="grid grid-cols-2 gap-4">
        {selectedProduct &&
          products?.data
            .find((p) => p.productId === selectedProduct)
            ?.images.slice(0, 2)
            .map((img) => (
              <div
                key={img.id}
                className="relative w-full h-40 mt-4 rounded-md inline-block bg-gray-100 border-gray-300 border-2"
              >
                <Image
                  fill
                  src={encodeURI(img.url)}
                  alt="Selected Product"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 10vw"
                  className="absolute object-contain mr-auto inset-0"
                />
              </div>
            ))}
      </div>

    </section>
  );
};





export default ProductDropdown;
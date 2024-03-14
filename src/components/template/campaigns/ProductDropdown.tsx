"use client";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { cn } from "@/lib/utils";
import notFoundImage from "@/public/product-not-found.jpg";
import { Image } from "@nextui-org/react";
import { Prisma } from "@prisma/client";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Check, Search } from "lucide-react";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "../../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList
} from "../../ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";

import { useProductList } from "@/lib/hooks/use-producLists";
import { campaignFormSchema } from "@/schema/campaign.schema";
import NextImage from "next/image";
import { z } from "zod";
import { Input } from "../../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import Spinner from "../../ui/spinner";
import { PRODUCT_CATEGORIES } from "@/constants/index";


type ProductWithImagesPayload = Prisma.ProductGetPayload<{
  include: {
    images: true
  }
}>


const ProductDropdown = () => {
  const { setValue, getValues, clearErrors } = useFormContext<z.infer<typeof campaignFormSchema>>();
  const [selectedProduct, setSelectedProduct] = useState<string | null>(getValues("productId"));
  const [searchText, setSearchText] = useState<string | null>("");
  const [open, setOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);



  const debouncedValue = useDebounce(searchText, 700);
  const { data: productSearched, isFetching, isLoading, isFetched, hasNextPage, isFetchingNextPage, fetchNextPage, refetch } = useProductList({ selectedProduct: selectedProduct, debouncedValue })

  const products = productSearched?.pages.flatMap((page) => page.data)


  const handlePopupTrigger = () => {
    let fetched = false
    if (!fetched) {
      refetch()
      fetched = true
    }

    setIsPopupOpen(true);

  };

  const getProductCategory = () => {
    const selectedid = getValues("productId");
    const selectedProductCategory = products?.find(
      (p) => p.id === selectedid
    )?.category;

    const category = PRODUCT_CATEGORIES.find((data) => data.value === selectedProductCategory)?.label
    return selectedProductCategory ? category : "no category";
  };

  const getProductName = () => {
    const selectedid = getValues("productId");
    const selectedProduct = products?.find(
      (p) => p.id === selectedid
    );

    return selectedProduct?.name || "Select a Product";
  };

  return (
    <>
      {/* product dropdown */}

      <Popover open={isPopupOpen} onOpenChange={setIsPopupOpen}>
        <PopoverTrigger asChild onClick={handlePopupTrigger}>
          <div className={cn("mb-4 mt-2 flex w-full items-start justify-between rounded-md border px-4 py-3 sm:flex-row sm:items-center",
            "relative items-center justify-between w-full flex tap-highlight-transparent shadow-sm border-2  border-default-200 bg-default-100 hover:bg-default-100 text-foreground-500 hover:text-foreground-500 font-normal hover:font-normal focus-visible:bg-default-100 hover:border-default-400 min-h-unit-8 rounded-small gap-0 transition-background !duration-150 transition-colors motion-reduce:transition-none outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background h-12 px-3 py-1 is-filled")}>
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
                    className="text-red-600 hover:text-red-600 cursor-pointer"
                    onClick={() => {
                      setSelectedProduct(null);
                      setValue("productId", "");
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
        <PopoverContent className="w-full p-0 max-w-[360px] min-w-[340px]
         gap-0 divide-y divide-default-300/50 dark:divide-default-100/80 bg-content1 overflow-hidden shadow-small rounded-medium">
          <Command className="m-0 h-full w-full p-0">
            <div className="flex items-center border-b px-3" >
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <Input type="text" placeholder="Search here..." className={cn(
                "flex w-full bg-transparent py-2 text-sm outline-none border-none ring-offset-0 placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50", "focus-visible:ring-0 focus-visible:outline-none  focus-visible:border-none focus-visible:ring-offset-0 focus-visible:bg-transparent")}
                onChange={(e) => setSearchText(e.currentTarget.value)} />
            </div>
            <CommandList>
              <CommandEmpty className="flex justify-center items-center p-4 text-muted-foreground">
                {isFetching || isLoading ? <><Spinner />Fetching Products...</> : "No results found."}
              </CommandEmpty>
              <CommandGroup heading="Products">
                {isFetched &&
                  products &&
                  products
                    .map((product: ProductWithImagesPayload, i) => {
                      const isSelected = product.id === selectedProduct;

                      return (
                        <React.Fragment key={`${product.id}-${i}`}>
                          <CommandItem
                            key={product.id}
                            value={product.id}
                            onSelect={(currentValue) => {
                              const currentProduct = getValues("productId");
                              const newProduct =
                                product.id === currentProduct ? "" : product.id;
                              setValue("productId", newProduct);
                              setSelectedProduct(product.id);
                              setIsPopupOpen(false);
                              clearErrors("productId")
                            }}
                            className={cn("flex gap-2 cursor-pointer min-h-[40px] my-1 hover:bg-none aria-selected:bg-default-300")}
                          >
                            <div className="h-4 w-4">
                              {isSelected &&
                                <Check className={cn("w-full h-full font-semibold")} />
                              }
                            </div>
                            <Image
                              as={NextImage}
                              src={product.images[0]?.url || notFoundImage.src}
                              alt={product.name} width={40} height={40} sizes="50px"
                              className="w-[40] rounded-sm"
                              style={{ width: 30 }}
                              fallbackSrc={notFoundImage.src}
                            />
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
                          {
                            products.length - 1 === i ?
                              <>
                                {isFetchingNextPage ?
                                  <CommandItem className="flex justify-center items-center mx-auto gap-2 p-3" disabled><Spinner /></CommandItem> : null}
                              </>
                              : null

                          }
                        </React.Fragment>
                      );
                    })}
                {/* next page button */}
                {
                  hasNextPage ? <CommandItem className="flex justify-center items-center mx-auto gap-2" disabled> <Button variant="secondary" onClick={() => fetchNextPage()} className="w-full text-black  p-1 hover:bg-primary/5" disabled={!hasNextPage}>{isFetchingNextPage ? "Loading..." : "Load more"}</Button>
                  </CommandItem> : null
                }
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <div className="grid grid-cols-2 gap-4 mt-0 sm:mt-2">
        {selectedProduct && products &&
          products.find((p) => p.id === selectedProduct)
            ?.images.slice(0, 2)
            .map((img) => (
              <div
                key={img.id}
                className="relative w-full h-40 mt-2 rounded-md inline-block bg-gray-100 border-gray-300 border-2"
              >
                <Image
                  as={NextImage}
                  fallbackSrc={notFoundImage.src}
                  src={encodeURI(img?.url)}
                  width={400}
                  height={400}
                  alt="Selected Product"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 10vw"
                  className="absolute object-contain mr-auto inset-0"
                />
              </div>
            ))}
      </div>

    </>
  );
};

export default ProductDropdown;
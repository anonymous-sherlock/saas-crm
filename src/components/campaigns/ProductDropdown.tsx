"use client";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { cn } from "@/lib/utils";
import { ProductSearchPayload } from "@/schema/productSchema";
import { Prisma } from "@prisma/client";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { Check, ChevronLeft, ChevronRight, Loader2, RefreshCw, Search } from "lucide-react";
import Image from "next/image";
import React, { useId, useState } from "react";
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
import { Input } from "../ui/input";



type ProductWithImagesPayload = Prisma.ProductGetPayload<{
  include: {
    images: true
  }
}>


const ProductDropdown = () => {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string | null>("");
  const [open, setOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { setValue, getValues, } = useFormContext();



  const debouncedValue = useDebounce(searchText, 700);
  const {
    data: productSearched,
    isFetching,
    isFetched,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    fetchPreviousPage,


    refetch,
  } = useInfiniteQuery<{
    nextCursor: string,
    data: ProductWithImagesPayload[]
  }>({
    queryKey: ["product", debouncedValue,],
    queryFn: async ({ pageParam }) => {
      const payload: ProductSearchPayload = {
        name: debouncedValue as string,
        selectedId: selectedProduct as string,
        cursor: pageParam,
        limit: 5,
      };
      const { data } = await axios.get("/api/search/product", {
        params: payload,
      });
      return data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor
    },
    keepPreviousData: true,
    enabled: !!debouncedValue,

  });
  const products = productSearched?.pages.flatMap((page) => page.data)


  const handlePopupTrigger = () => {
    let fetched = false
    if (!fetched) {
      refetch()

      console.log("fetched called")
      fetched = true
    }

    setIsPopupOpen(true);

  };

  const getProductCategory = () => {
    const selectedProductId = getValues("product");
    const selectedProduct = products?.find(
      (p) => p.productId === selectedProductId
    );

    return selectedProduct?.category?.length
      ? selectedProduct.category
      : "no category";
  };

  const getProductName = () => {
    const selectedProductId = getValues("product");
    const selectedProduct = products?.find(
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
            <div className="flex items-center border-b px-3" >
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <Input type="text" placeholder="Search here..." className={cn(
                "flex w-full bg-transparent py-2 text-sm outline-none border-none ring-offset-0 placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50", "focus-visible:ring-0 focus-visible:outline-none  focus-visible:border-none focus-visible:ring-offset-0 focus-visible:bg-transparent")}
                onChange={(e)=>setSearchText(e.currentTarget.value)} />
            </div>
            <CommandList>
              <CommandEmpty className="flex justify-center items-center p-4">
                {isFetching ? <><Spinner />Fetching Products...</> : "No results found."}
              </CommandEmpty>
              <CommandGroup heading="Products">
                {isFetched &&
                  products &&
                  products
                    .map((product: ProductWithImagesPayload, i) => {
                      const isSelected = product.productId === selectedProduct;

                      return (
                        <React.Fragment key={`${product.productId}-${i}`}>
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

                            className={cn("flex gap-2 cursor-pointer min-h-[40px] my-1 hover:bg-none")}
                          >
                            <div className="h-4 w-4">
                              {isSelected && <Check className={cn("w-full h-full font-semibold")} />}
                            </div>
                            <Image src={product.images[0].url || notFoundImage.src} alt={product.name} width={40} height={40} sizes="50px" className="w-[40] rounded-sm"
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

      <div className="grid grid-cols-2 gap-4">
        {selectedProduct && products &&
          products.find((p) => p.productId === selectedProduct)
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
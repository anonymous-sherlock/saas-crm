"use client";
import { trpc } from "@/app/_trpc/client";
import { FormError } from "@/components/global/form-error";
import { FormSuccess } from "@/components/global/form-success";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PRODUCT_CATEGORIES } from "@/constants/index";
import { addProduct, deleteProduct } from "@/lib/actions/product.action";
import useFileUpload from "@/lib/hooks/useFileUpload";
import { catchError, cn } from "@/lib/utils";
import { productFormSchema } from "@/schema/productSchema";
import { RouterOutputs } from "@/server";
import { FileWithPreview } from "@/types";
import { Card, CardContent, CardTitle } from "@/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input as NextInput, Textarea as NextTextarea } from "@nextui-org/react";
import { Check, ChevronsUpDown, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { pages } from "routes";
import { z } from "zod";
import Spinner from "../../ui/spinner";
import { ProductImagesUploader } from "./productImages";

type ProductFormProps = {
  edit: true;
  product: RouterOutputs["product"]["get"];
} | {
  edit: false;
  product?: RouterOutputs["product"]["get"];
};

export function ProductForm({ edit, product }: ProductFormProps) {
  const [open, setOpen] = useState(false);
  const [productImages, setProductImages] = React.useState<FileWithPreview[] | null>(null)
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = React.useTransition()
  const [isDeleting, startDeletingTransition] = React.useTransition()
  const router = useRouter()

  const mediaUrl = product?.media.map((media) => {
    if (media.url) { return { value: media.url } }
  })
  const form = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      id: product?.id || "",
      productName: product?.name || "",
      productPrice: product?.price.toString() || "",
      productDescription: product?.description || "",
      productQuantity: product?.quantity.toString() || "",
      productImages: [],
      mediaUrls: mediaUrl && mediaUrl.length > 0 ? mediaUrl : [{ value: "" }],
      productCategory: product?.category || ""
    },
  });
  const utils = trpc.useUtils();
  const { upload } = useFileUpload({ endpoint: "crm" })

  const { mutateAsync: updateProduct, isLoading: isUpdatingProduct } = trpc.product.update.useMutation({
    onSuccess: () => {
      utils.product.invalidate();
      router.push("/products",)
    },
  });

  const isDisabled = isDeleting || isPending || isUpdatingProduct
  const { fields, append, remove } = useFieldArray({
    name: "mediaUrls",
    control: form.control,
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof productFormSchema>) {
    startTransition(async () => {
      setError("");
      setSuccess("");
      if (productImages?.length === 0 || !values.productImages) {
        toast.error("Product images is not provided")
        setError("Product images is not provided")
        return;
      }

      try {
        if (!productImages) throw new Error("No Product images provided")
        const [primaryProductImages] = await Promise.all([upload({ files: productImages }),]);

        const { productImages: _, ...valuesWithoutFiles } = values;
        addProduct({
          ...valuesWithoutFiles,
          productImages: primaryProductImages?.data.files ?? [],
        }).then((data) => {
          setError(data?.error);
          setSuccess(data?.success);
          if (data?.success) {
            toast.success(data?.success)
            utils.product.invalidate();
            router.push(pages.product)
          }
        });
      } catch (err) {
        catchError(err);
      }

    })

    // if (edit === true) {
    //   hotToast.promise(
    //     updateProduct({ product: values, files: files, productId: product.productId }),
    //     {
    //       loading: 'Updating Product...',
    //       success: "product updated Sucessfully!",
    //       error: "Could not update product.",
    //     }
    //   );
    // }
    // else {

    //   hotToast.promise(
    //     createProduct({ product: values, files: files }),
    //     {
    //       loading: 'Adding Product...',
    //       success: (data) => `${data.message}`,
    //       error: "Could not Add product.",
    //     }
    //   );
    // }
  }

  // 3. Define a product delete handler
  function handleProductDelete() {
    startDeletingTransition(async () => {
      setError("");
      setSuccess("");
      if (edit === true) {
        try {
          deleteProduct({ id: product?.id }).then((data) => {
            setError(data?.error);
            setSuccess(data?.success);
            if (data?.success) {
              router.push(pages.product)
            }
          })
        } catch (error) {
          catchError(error)
        }
      }
    })

  }

  return (
    <Card className="bg-white p-6">
      <CardTitle>{edit === true ? "Update Product" : "Add a Product"}</CardTitle>
      <CardContent className="mt-8 w-full p-0">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            method="post"
            className="flex flex-col lg:grid lg:grid-cols-5 items-start gap-6 space-y-4"
          >
            <div className="col-span-3 flex w-full flex-col gap-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="productName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel >Product Name</FormLabel>
                      <FormControl>
                        <NextInput type="text" aria-label="Product Name" size="sm"
                          placeholder="Nutra Bay" variant="faded"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* product price */}
                <FormField
                  control={form.control}
                  name="productPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Price</FormLabel>
                      <FormControl>
                        <NextInput type="text" aria-label="Product Name" size="sm"
                          placeholder="1,999" variant="faded"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col md:grid grid-cols-2 gap-4">
                {/* product category */}
                <FormField
                  control={form.control}
                  name="productCategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Category</FormLabel>
                      <FormControl>
                        <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button data-slot="input-wrapper" variant="outline" role="combobox" className={cn("relative items-center justify-between w-full flex tap-highlight-transparent shadow-sm border-2  border-default-200 bg-default-100 hover:bg-default-100 text-foreground-500 hover:text-foreground-500 font-normal hover:font-normal focus-visible:bg-default-100 hover:border-default-400 min-h-unit-8 rounded-small gap-0 transition-background !duration-150 transition-colors motion-reduce:transition-none outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background h-12 px-3 py-1 is-filled")}>
                                {field.value
                                  ? PRODUCT_CATEGORIES.find((cat) => field.value === cat.value)?.label
                                  : "Select a Category"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="p-0 gap-0 divide-y divide-default-300/50 dark:divide-default-100/80 bg-content1 max-w-[300px] overflow-hidden shadow-small rounded-medium"
                          >
                            <Command className="m-0 h-full w-full p-0">
                              <CommandInput placeholder="Search..." />
                              <CommandList>
                                <CommandEmpty>No region found.</CommandEmpty>
                                <CommandGroup heading="Region">
                                  {PRODUCT_CATEGORIES.map((cat, index) => (
                                    <CommandItem
                                      className="my-2 cursor-pointer aria-selected:bg-default-300"
                                      key={index}
                                      value={cat.label}
                                      onSelect={() => {
                                        form.setValue("productCategory", cat.value);
                                        form.clearErrors("productCategory");
                                        setOpen(false);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          cat.value === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {cat.label}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* product Quantity */}
                <FormField
                  control={form.control}
                  name="productQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Quantity</FormLabel>
                      <FormControl>
                        <NextInput type="text" aria-label="Product Name" size="sm"
                          placeholder="-1 for unlimited stocks" variant="faded"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* product description */}
              <FormField
                control={form.control}
                name="productDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Description</FormLabel>
                    <FormControl>
                      <NextTextarea
                        variant="faded"
                        aria-label="Product Description"
                        labelPlacement="outside"
                        placeholder="Enter your description"
                        className="col-span-12 md:col-span-6 mb-6 md:mb-0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* media urls */}
              {fields.map((field, index) => (

                <FormField
                  control={form.control}
                  key={index}
                  name={`mediaUrls.${index}.value`}
                  render={({ field }) => (
                    <FormItem className={cn(index !== 0 && "-mt-6")}>
                      <div className="flex">
                        <div className="flex-1">
                          <FormLabel className={cn(index !== 0 && "sr-only")}>
                            Media URLs
                          </FormLabel>
                          <FormDescription className={cn(index !== 0 && "sr-only")}>
                            Add links of your Video, youtube, vimeo or any other
                            source.
                          </FormDescription>
                        </div>
                        {index === 0 ?
                          <Button type="button" variant="secondary" size="sm" className="mt-2 md:w-1/4 border"
                            onClick={() => append({ value: "" })}>
                            Add URL
                          </Button> : null}
                      </div>

                      <FormControl>
                        <div className="flex gap-2">
                          <NextInput type="text" aria-label="Product Name" size="sm"
                            classNames={{
                              inputWrapper: "h-11"
                            }}
                            placeholder="https://youtu.be/cZ25wf..." variant="faded" className="flex-1"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={() => {
                              if (index !== 0) {
                                remove(index);
                              }
                            }}
                            className={cn("w-10 p-[12px]", (index === 0) && "cursor-not-allowed")}
                            disabled={(index === 0)}
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>



            {/* right side menu */}
            <div className="col-span-3 lg:col-span-2 mt-[0_!important] w-full">
              <ProductImagesUploader files={productImages} setFiles={setProductImages} />
            </div>

            <FormSuccess message={success} classname="col-span-5" />
            <FormError message={error} classname="col-span-5" />
            {edit === true ?
              <Button type="button" variant="destructive" className={cn("w-full col-span-1 !mt-0")}
                disabled={isDisabled} onClick={handleProductDelete}>
                {isDeleting ?
                  (<><Spinner />Deleting...</>) : (<><Trash2 className="w-4 h-4 mr-2" />Delete Product</>)}
              </Button> : null
            }

            <Button type="submit" className={cn("w-full col-span-1 !mt-0")} disabled={isDisabled} >
              {isPending || isUpdatingProduct ? (
                <>
                  <Spinner />{edit === true ? "Updating Product..." : "Adding Product..."}
                </>
              ) : (
                edit === true ? "Update Product" : "Add Product"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

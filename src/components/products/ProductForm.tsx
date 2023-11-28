"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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
import { Input } from "@/components/ui/input";
import { productCategories } from "@/constants/index";
import { cn } from "@/lib/utils";
import { productFormSchema } from "@/schema/productSchema";
import { useImageFileStore, useProductImages } from "@/store/index";
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
import { Textarea } from "@/ui/textarea";
import { Check, ChevronsUpDown, Trash2 } from "lucide-react";
import { useId, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
// import DragAndDrop from "./DragnDrop";
import { trpc } from "@/app/_trpc/client";
import { useRouter } from "next/navigation";
import DragnDrop from "./DragnDrop";

export function ProductForm() {
  const router = useRouter();
  const uid = useId()

  const [open, setOpen] = useState(false);
  const { files, setFiles } = useImageFileStore();
  const form = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      productName: "",
      productPrice: "",
      productDescription: "",
      productQuantity: "",
      productImages: [],
      mediaUrls: [{ value: "" }],
    },
  });
  const utils = trpc.useUtils();



  // const { mutateAsync: createProduct, isLoading } = useMutation({
  //   mutationKey: ["createProduct"],
  //   mutationFn: async (formData: FormData) => {
  //     const { data } = await axios.post("/api/product/add", formData);
  //     return data;
  //   },
  //   onError: (err) => {
  //     if (err instanceof AxiosError) {
  //       if (err.response?.status === 500) {
  //         console.log(err);
  //         return toast({
  //           title: "Cannot Create Product.",
  //           description: err.response.data.error,
  //           variant: "destructive",
  //         });
  //       } else if (err.response?.status === 400) {
  //         return toast({
  //           title: "Uh oh! Something went wrong.",
  //           description: "There was a problem with your request",
  //           variant: "destructive",
  //         });
  //       }
  //     }
  //     return toast({
  //       title: "Cannot Create Product.",
  //       description: "Internal server error",
  //       variant: "destructive",
  //     });
  //   },
  //   onSuccess: (data) => {
  //     utils.product.invalidate();
  //     if (data.success) {
  //       form.reset();
  //       setFiles([]);
  //     }
  //     return toast({
  //       variant: "success",
  //       title: "Product created",
  //       description: data.message,
  //     });
  //   },
  // });

  const { fields, append, remove } = useFieldArray({
    name: "mediaUrls",
    control: form.control,
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof productFormSchema>) {
    console.log(values)

  }

  return (
    <Card className="bg-white p-6">
      <CardTitle>Add a Product</CardTitle>
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
                        <Input placeholder="Nutra Bay" {...field} />
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
                        <Input placeholder="1,999" {...field} />
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
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className={cn(
                                  "w-full justify-between",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? field.value
                                  : "Select a Category"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-full p-0"
                            style={{ maxWidth: "100%", width: "100%" }}
                          >
                            <Command className="m-0 h-full w-full p-0">
                              <CommandInput placeholder="Search..." />
                              <CommandList>
                                <CommandEmpty>No results found.</CommandEmpty>
                                <CommandGroup heading="Categories">
                                  {productCategories.map((cat, index) => (
                                    <CommandItem
                                      className="my-2  cursor-pointer"
                                      key={index}
                                      value={cat}
                                      onSelect={() => {
                                        form.setValue("productCategory", cat);
                                        form.clearErrors("productCategory");
                                        setOpen(false);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          cat === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {cat}
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
                        <Input
                          placeholder="-1 for unlimited stocks"
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
                      <Textarea
                        placeholder="Product Description."
                        {...field}
                        className={cn("min-h-36!")}
                        minRows={5}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* media urls */}
              {fields.map((field, index) => (
                <>

                  <FormField
                    control={form.control}
                    key={uid}
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
                            <Button type="button" variant="secondary" size="sm" className="mt-2 md:w-1/4 "
                              onClick={() => append({ value: "" })}>
                              Add URL
                            </Button> : null}
                        </div>

                        <FormControl>
                          <div className="flex gap-2">
                            <Input
                              {...field}
                              className="flex-1"
                              placeholder="https://youtu.be/cZ25wf..."
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
                </>
              ))}

            </div>



            {/* right side menu */}
            <div className="col-span-3 lg:col-span-2 mt-[0_!important] w-full">
              <FormField
                control={form.control}
                name="productImages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Add Product Images</FormLabel>
                    <FormControl>
                      <DragnDrop />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              className={cn("w-full col-span-1")}
            >
              Add Product
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

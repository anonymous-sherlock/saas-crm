"use client";

import { ColumnDef } from "@tanstack/react-table";
import notFoundImage from "@/public/product-not-found.jpg";
import { Checkbox } from "@/ui/checkbox";
import { Product, ProductImage } from "@prisma/client";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { ProductInfoHover } from "./product-info-hover";
export type ProductList = Product & {
  images: ProductImage[];
};



export const columns: ColumnDef<ProductList>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "productId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product Id" />
    ),
    cell: ({ row }) => {
      const cell = row.original
      return (
        <div className="w-[75px] truncate">
          <Link href={`/products/${cell.productId}`}>{cell.productId}</Link>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product Name" />
    ),
    cell: ({ row }) => {
      const product = row.original;

      return (
        <div className="flex space-x-2 max-w-[220px] ">
          {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
          <span className="w-full truncate font-medium ">
            {row.getValue("name")}{" "}
          </span>
          {product.productId && <ProductInfoHover product={product} />}
        </div>
      );
    },
  },
  {
    accessorKey: "images",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product Images" />
    ),
    cell: ({ row }) => (
      <div className="w-[25px] truncate p-1">
        {row.original.images[0]?.url ? (
          <Image
            src={row.original.images[0]?.url.toString() || notFoundImage.src}
            alt={row.original.name}
            width={50}
            height={50}
            className="w-[20px] rounded-md"
            style={{ width: "auto" }}
            blurDataURL={notFoundImage.blurDataURL}
          />
        ) : null}
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Poduct Category" />
    ),
    cell: ({ row }) => {
      // const label = labels.find((label) => label.value === row.original.label);

      return (
        <div className="flex space-x-2 max-w-[220px] ">
          {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
          <span className="w-full truncate font-medium ">
            {row.getValue("category")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Uploaded On" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center max-w-[180px] ">
          <span className="line-clamp-1 leading-7 whitespace-pre-line mr-1 ">
            {format(row.original.createdAt, 'dd, MMM - hh:mm a')}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    id: "actions",
    cell: ({ row, cell }) => <DataTableRowActions row={row} />,
  },
];
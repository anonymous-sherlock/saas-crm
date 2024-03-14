"use client";
import { Checkbox } from "@/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import React, { FC } from "react";
import { DataTableColumnHeader } from "../global/data-table-column-header";
import { DataTable } from './data-table';
import { DataTableRowActions } from './data-table-row-actions';
import { ProductColumnDef } from './schema';
import Link from "next/link";
import { ProductInfoHover } from "./product-info-hover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PRODUCT_CATEGORIES } from "@/constants/index";
import { format } from "date-fns";


interface ProductTableShellProps {
    data: ProductColumnDef[]
}

const ProductTableShell: FC<ProductTableShellProps> = ({ data }) => {
    const LeadsColumnDef = React.useMemo<ColumnDef<ProductColumnDef>[]>(
        () => [
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
                accessorKey: "id",
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} title="Product Id" />
                ),
                cell: ({ row }) => {
                    const cell = row.original
                    return (
                        <div className="w-[75px] truncate">
                            <Link href={`/products/${cell.id}`}>{cell.id}</Link>
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
                            <span className="w-full truncate font-medium ">
                                {row.getValue("name")}{" "}
                                {product.id && <ProductInfoHover product={product} />}
                            </span>
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
                    <div className="truncate  flex p-1">
                        {row.original.images.length > 0 ? (
                            <>
                                {row.original.images.slice(0, 3).map((img, index) => (
                                    <div key={index} className="relative w-7 h-7">
                                        <Avatar className="rounded-full h-full w-full object-contain ring-2 ring-offset-2 ring-offset-background ring-default">
                                            <AvatarImage src={img.url} alt="@shadcn" className="h-full w-full" />
                                            <AvatarFallback className="h-full w-full text-[10px] font-semibold truncate line-clamp-1 text-ellipsis grid capitalize items-center">{row.original.name.split(" ")[0]}</AvatarFallback>
                                        </Avatar>

                                    </div>
                                ))

                                }

                            </>
                        ) : null}
                    </div>
                ),
                enableSorting: false,
                enableHiding: false,
            },
            {
                accessorKey: "category",
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} title="Poduct Category" />
                ),
                cell: ({ row }) => {
                    const label = PRODUCT_CATEGORIES.find((label) => label.value === row.original.category)?.label;
                    if (!label) return "No Category Found"
                    return (
                        <div className="flex space-x-2 max-w-[220px] ">
                            <span className="w-full truncate font-medium ">
                                {label}
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
                        <div className="flex items-center w-auto md:max-w-[180px] ">
                            <span className="mr-1 text-nowrap">
                                {/* {format(row.original.createdAt, 'dd, MMM - hh:mm a')} */}
                                {format(row.original.createdAt, "dd LLL, yy - hh:mm a")}
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
        ],
        []
    )
    return (
        <DataTable data={data ?? []} columns={LeadsColumnDef} />
    )
}

export default ProductTableShell
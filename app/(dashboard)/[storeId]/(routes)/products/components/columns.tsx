"use client"
import { ColumnDef } from "@tanstack/react-table"
import { CellActions } from "./cell-action"


export type ProductColumn = {
    id: string
    name: string
    price: string
    sizes: string[]
    category: string
    colors: string[]
    isFeatured: boolean
    isArchived: boolean
    stock: number
    createdAt: string
}


export const columns: ColumnDef<ProductColumn>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "category",
        header: "Category",
    },
    {
        accessorKey: "price",
        header: "Price",
    },
    {
        accessorKey: "stock",
        header: "Stock",
    },
    {
        accessorKey: "isArchived",
        header: "Archived",
    },
    {
        accessorKey: "isFeatured",
        header: "Featured",
    },
    {
        accessorKey: "sizes",
        header: "Sizes",
        cell: ({ row }) => (
            <div className="grid items-center gap-x-2 gap-y-3 grid-cols-3">
                {row.original.sizes.map(size => (
                    <span key={size} className="px-1 py-1 bg-gray-200 rounded flex items-center justify-center font-semibold" >
                        {size}
                    </span>
                ))}
            </div>
        )
    },
    {
        accessorKey: "colors",
        header: "Colors",
        cell: ({ row }) => (
            <div className="grid items-center gap-x-2 grid-cols-3 gap-y-3">
                {row.original.colors.map(clr => (
                    <div
                        key={clr}
                        className="h-6 w-6 rounded-full border"
                        style={{ backgroundColor: clr }}
                    />
                ))}
            </div>
        )
    },
    {
        accessorKey: "createdAt",
        header: "Date",
    },
    {
        id: 'actions',
        cell: ({ row }) => <CellActions data={row.original} />
    }
];

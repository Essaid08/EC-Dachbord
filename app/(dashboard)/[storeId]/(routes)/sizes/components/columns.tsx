"use client"
import { ColumnDef } from "@tanstack/react-table"
import { CellActions } from "./cell-action"

export type SizeColumn = {
    id: string
    name: string
    value: string
    cratedAt: string
}
export const columns: ColumnDef<SizeColumn>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "value",
        header: "Value",
    },
    {
        accessorKey: "createdAt",
        header: "Date",
    },
    {
        id: 'actions',
        cell: ({row}) =><CellActions data={row.original}/>
    }
]
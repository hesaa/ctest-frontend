import { ColumnDef } from "@tanstack/react-table"


import moment from 'moment';
import { Employee } from "@/interfaces/IEmployee";
import ActionOption from "./components/action-option";
export const columns: ColumnDef<Employee>[] = [
    {
        header: "No",
        id: "id",
        accessorKey: 'id',
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;

            return pageIndex * pageSize + row.index + 1;
        },
        size: 50,
        enableSorting: false,
        sortingFn: 'auto'
    },
    {
        header: 'Name',
        accessorKey: "name",
        enableSorting: true,
        size: 1000,

    },
    {
        header: "Created At",
        id: "Created",
        cell: ({ row }) => {
            return row.original?.created_at ? moment(row.original.created_at).format('DD-MM-yyyy HH:mm:ss') : '-'
        },
        size: 200, //starting column size
        enableSorting: true,
    },
    {
        header: "Updated At",
        id: "Updated",
        cell: ({ row }) => {
            return row.original?.updated_at ? moment(row.original.updated_at).format('DD-MM-yyyy HH:mm:ss') : '-'
        },
        size: 200, //starting column size
        enableSorting: true,
    },
    {
        id: "actions",
        size: 50,
        cell: ({ row }) => (
            <ActionOption row={row.original} />
        ),
    },

];
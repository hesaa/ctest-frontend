import { ColumnDef } from "@tanstack/react-table"


import moment from 'moment';
import { Task } from "@/interfaces/ITask";
import ActionOption from "./components/action-option";
export const columns: ColumnDef<Task>[] = [
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
        header: 'Description',
        accessorKey: "description",
        enableSorting: true,
        size: 400,

    },
    {
        header: 'Hourly Rate',
        accessorKey: "hourly_rate",
        enableSorting: true,
    },
    {
        header: 'Additional Charges',
        accessorKey: "additional_charges",
        enableSorting: true,
    },
    {
        header: 'Total Remuneration',
        accessorKey: "total_remuneration",
        enableSorting: true,
    },
    {
        header: 'Total Employee',
        id: "total_employee",
        cell: ({ row }) => {
            return row.original?.employees?.length
        },
        enableSorting: true,
    },
    {
        header: "Date",
        id: "date",
        cell: ({ row }) => {
            return row.original?.date ? moment(row.original.date).format('DD-MM-yyyy') : '-'
        },
        size: 150, //starting column size
        enableSorting: true,
    },
    {
        header: "Created At",
        id: "Created",
        cell: ({ row }) => {
            return row.original?.created_at ? moment(row.original.created_at).format('DD-MM-yyyy HH:mm:ss') : '-'
        },
        size: 150, //starting column size
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
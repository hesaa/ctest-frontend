"use client"

import { useEffect, useState } from 'react';

import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
    SortingState
} from "@tanstack/react-table"
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronsLeftIcon,
    ChevronsRightIcon,
} from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton component
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area"


import { X, ArrowDown, ArrowUp, Plus } from "lucide-react";
import { DataResponse } from "@/interfaces/IDataResponse";

import { Employee } from "@/interfaces/IEmployee";
import { getEmployee } from "./serverAction/employee";

import AddData from "./components/add-data-dialog";
import { columns } from "./columns";


export default function Content() {
    const [isLoading, setIsLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [pageIndex, setPageIndex] = useState(0); // Page starts from 0
    const [pageSize, setPageSize] = useState(10);  // Rows per page

    const [filteredData, setFilteredData] = useState<Employee[]>([]);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [search, setSearch] = useState("");

    const [sorting, setSorting] = useState<SortingState>([]);


    const fetchData = async () => {
        setIsLoading(true);
        try {


            const params = new URLSearchParams()

            const sortingData = sorting[0] ? sorting[0] : false
            if (search) params.append("q", search)
            if (sortingData) {
                params.append("sort", sortingData.id)
                params.append("order", sortingData.desc ? 'DESC' : 'ASC')
            }


            const query = params.toString()

            const data: DataResponse<Employee> = await getEmployee(pageIndex + 1, pageSize, query, search);
            setFilteredData(data.data.data);
            console.log(data)
            setTotalRows(data.data.pagination.totalItems);
        } catch (err) {
            console.log(err)
        } finally {
            setIsLoading(false);
        }
    }
    useEffect(() => {
        fetchData();
    }, [pageIndex, pageSize, sorting, search]);

    useEffect(() => {
        fetchData();
    }, []);



    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        // Reset to first page when search changes
        setPageIndex(0);
    };



    const table = useReactTable({
        data: filteredData,
        columns,
        pageCount: Math.ceil(totalRows / pageSize),
        state: {
            pagination: { pageIndex, pageSize },
            sorting,
        },
        manualPagination: true, // Enable server-side pagination
        manualSorting: true, // Enable server-side sorting
        onSortingChange: setSorting,
        onPaginationChange: (updater) => {
            const newState = typeof updater === "function" ? updater({ pageIndex, pageSize }) : updater;
            setPageIndex(newState.pageIndex);
            setPageSize(newState.pageSize);
        },
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })

    const clearSearch = () => {
        setSearch("");
        setPageIndex(0);
        // If you want to trigger search immediately after clear:
    };

    return (
        <Card className="rounded-lg border-none mt-6">
            <CardContent className="p-6">
                <div className="flex min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)]">
                    <div className="flex flex-col space-y-4 w-full">
                        <div className="flex items-center py-4">
                            <div className="relative w-1/3">
                                <Input
                                    placeholder="Type a name..."
                                    className="w-full pr-10"
                                    value={search}
                                    onChange={handleSearchChange}
                                />
                                {search && (
                                    <button
                                        type="button"
                                        onClick={clearSearch}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                            <div className='flex gap-2 ml-auto'>
                                <Button
                                    variant="outline"
                                    onClick={() => setIsDialogOpen(true)}
                                >
                                    <Plus />
                                    Add data
                                </Button>
                            </div>
                        </div>


                        <div className="rounded-md border flex justify-center w-full">
                            <ScrollArea className="w-full">
                                <Table className="table-fixed">
                                    <TableHeader>
                                        {table.getHeaderGroups().map((headerGroup) => (
                                            <TableRow key={headerGroup.id}>
                                                {headerGroup.headers
                                                    .map((header) => (
                                                        <TableHead
                                                            key={header.id}
                                                            style={{ width: header.getSize() }}
                                                            onClick={header.column.getToggleSortingHandler()}
                                                            className={header.column.getCanSort() ? "cursor-pointer select-none" : ""}
                                                        >
                                                            {header.isPlaceholder ? null : (
                                                                <div className="flex items-center gap-1">
                                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                                    {{
                                                                        asc: <ArrowDown className="ml-2 h-4 w-4" />,
                                                                        desc: <ArrowUp className="ml-2 h-4 w-4" />,
                                                                    }[header.column.getIsSorted() as string] ?? null}
                                                                </div>
                                                            )}
                                                        </TableHead>
                                                    ))}

                                            </TableRow>
                                        ))}
                                    </TableHeader>
                                    <TableBody>
                                        {isLoading ? (
                                            // Show Skeleton rows while loading
                                            [...Array(pageSize)].map((_, index) => (
                                                <TableRow key={index}>
                                                    {table.getAllColumns()
                                                        .map((col, colIndex) => (
                                                            <TableCell key={colIndex}>
                                                                <Skeleton className="h-5 w-full rounded-md" />
                                                            </TableCell>
                                                        ))}
                                                </TableRow>
                                            ))
                                        ) : table.getRowModel().rows.length > 0 ? (
                                            table.getRowModel().rows.map((row) => (
                                                <TableRow
                                                    key={row.id}
                                                    data-state={row.getIsSelected() && "selected"}
                                                >
                                                    {row.getVisibleCells()
                                                        .map((cell) => (
                                                            <TableCell key={cell.id}>
                                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                            </TableCell>
                                                        ))}
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                                    No results.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </ScrollArea>
                        </div>

                        {/* Pagination Controls */}

                        <div className="flex items-center justify-between px-4">
                            <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
                                Showing {totalRows === 0 ? 0 : pageIndex * pageSize + 1} to{' '}
                                {Math.min((pageIndex + 1) * pageSize, totalRows)} of {totalRows} entries
                            </div>
                            <div className="flex w-full items-center gap-8 lg:w-fit">
                                <div className="hidden items-center gap-2 lg:flex">
                                    <select
                                        value={pageSize}
                                        onChange={e => setPageSize(Number(e.target.value))}
                                        className="px-2 py-1 sm"
                                    >
                                        {[10, 25, 50, 100].map(size => (
                                            <option key={size} value={size}>
                                                Show {size}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex w-fit items-center justify-center text-sm font-medium">
                                    Page {table.getState().pagination.pageIndex + 1} of{" "}
                                    {table.getPageCount()}
                                </div>
                                <div className="ml-auto flex items-center gap-2 lg:ml-0">
                                    <Button
                                        variant="outline"
                                        className="hidden h-8 w-8 p-0 lg:flex"
                                        onClick={() => table.setPageIndex(0)}
                                        disabled={!table.getCanPreviousPage()}
                                    >
                                        <span className="sr-only">Go to first page</span>
                                        <ChevronsLeftIcon />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="size-8"
                                        size="icon"
                                        onClick={() => table.previousPage()}
                                        disabled={!table.getCanPreviousPage()}
                                    >
                                        <span className="sr-only">Go to previous page</span>
                                        <ChevronLeftIcon />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="size-8"
                                        size="icon"
                                        onClick={() => table.nextPage()}
                                        disabled={!table.getCanNextPage()}
                                    >
                                        <span className="sr-only">Go to next page</span>
                                        <ChevronRightIcon />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="hidden size-8 lg:flex"
                                        size="icon"
                                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                        disabled={!table.getCanNextPage()}
                                    >
                                        <span className="sr-only">Go to last page</span>
                                        <ChevronsRightIcon />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <AddData
                    isOpen={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}/>
            </CardContent>
        </Card>
    );
}
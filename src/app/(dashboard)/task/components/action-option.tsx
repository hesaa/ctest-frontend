"use client"

import React, { useState } from "react";
import { MoreVerticalIcon } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import UpdateData from "./update-data-dialog";
import DeleteData from "./delete-data-dialog";


interface ActionOptionsProps {
    row: any
}


const ActionOptions: React.FC<ActionOptionsProps> = ({ row }) => {
    const [isDialogDeleteOpen, setIsDialogDeleteOpen] = useState(false);
    const [isDialogUpdateOpen, setIsDialogUpdateOpen] = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
                        size="icon"
                    >
                        <MoreVerticalIcon />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                    <DropdownMenuItem onClick={() => setIsDialogUpdateOpen(true)}>Edit</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setIsDialogDeleteOpen(true)}>Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <>
                <UpdateData
                    isOpen={isDialogUpdateOpen}
                    onClose={() => setIsDialogUpdateOpen(false)}
                    row={row} />
                <DeleteData
                    isOpen={isDialogDeleteOpen}
                    onClose={() => setIsDialogDeleteOpen(false)}
                    row={row}
                />
            </>
        </>
    )
}

export default ActionOptions;
"use client"
import React, { useState } from 'react';
import { useRouter } from "next/navigation";

import { deleteTask } from "../serverAction/task"
import { Button } from "@/components/ui/button"


import { toast } from "@/hooks/use-toast"
import { Spinner } from "@/components/ui/spinner"
import { revalidatePath } from 'next/cache';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Task } from "@/interfaces/ITask";


interface DialogAddProp {
    isOpen: boolean;
    onClose: () => void;
    row: Task
}


const DeleteData: React.FC<DialogAddProp> = ({ isOpen, onClose, row }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = async () => {
        setIsLoading(true);
        const res = await deleteTask(row.id);

        if (res?.success) {
            toast({ title: res?.message });

            window.location.reload();
            onClose()
        } else {
            toast({ variant: "destructive", title: res?.message || "An error occurred" });
        }

        setIsLoading(false);
    }

    return (
        <Dialog onOpenChange={onClose} open={isOpen} modal defaultOpen={isOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle><span className='text-red-600 uppercase'>{row.description}</span> Will be deleted!</DialogTitle>
                    <DialogDescription>
                        Deleted data cannot be recovered? are you sure?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    {!isLoading ? <Button type="submit" onClick={handleDelete}
                        disabled={isLoading}
                    >Delete
                    </Button> : <Spinner />}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteData;
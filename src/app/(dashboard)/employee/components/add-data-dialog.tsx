"use client"
import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { storeEmployee } from "../serverAction/employee"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import { Spinner } from "@/components/ui/spinner"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

const FormSchema = z.object({
    name: z.string().min(2),
})



interface DialogAddProp {
    isOpen: boolean;
    onClose: () => void;
}


const AddData: React.FC<DialogAddProp> = ({ isOpen, onClose }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
        },
    })

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        setIsLoading(true);

        const res = await storeEmployee(data);
        if (res?.success) {
            toast({ title: res?.message });

            window.location.reload();

            onClose()

            form.setValue("name", "");
        } else {
            toast({ variant: "destructive", title: res?.message || "An error occurred" });
        }
        setIsLoading(false);
    }
    return (
        <Dialog onOpenChange={onClose} open={isOpen} modal defaultOpen={isOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add employee</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Type a employee name....' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            {!isLoading ? <Button type="submit"
                                disabled={isLoading}
                            >Submit
                            </Button> : <Spinner />}
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default AddData;
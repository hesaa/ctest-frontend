"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { getEmployee } from "@/app/(dashboard)/employee/serverAction/employee"
import { storeTask } from "../serverAction/task"
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
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"


import { useFieldArray } from "react-hook-form";

import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";


const formSchema = z.object({
    description: z.string().min(1, "Description is required"),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
    hourly_rate: z.number().int().positive(),
    additional_charges: z.number().min(0).default(0),
    assignments: z.array(z.object({
        employee_id: z.number().int().positive(),
        hours_spent: z.number().positive().max(24, "Hours spent must be 24 or less"),
    }))
        .optional()
        .refine((items) => {
            if (!items) return true;
            const employeeIds = items.map(item => item.employee_id);
            return new Set(employeeIds).size === employeeIds.length;
        }, {
            message: "Employee IDs must be unique",
            path: ["assignments"],
        }),
});

// Create a type that matches exactly what useForm expects
type FormValues = {
    description: string;
    date: string;
    hourly_rate: number;
    additional_charges?: number;
    assignments?: {
        employee_id: number;
        hours_spent: number;
    }[];
};

interface DialogAddProp {
    isOpen: boolean;
    onClose: () => void;
}


const AddData: React.FC<DialogAddProp> = ({ isOpen, onClose }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [employeeOptions, setEmployeeOptions] = useState<{ value: number, label: string }[]>([]);
    const [search, setSearch] = useState("");
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: "",
            date: format(new Date(), "yyyy-MM-dd"),
            hourly_rate: 0,
            additional_charges: 0,
            assignments: [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        name: "assignments",
        control: form.control,
    });

    useEffect(() => {
        form.reset();
        const fetchEmployees = async () => {
            setIsLoading(true)
            const response = await getEmployee(1, 100000) //todo.
            const data = response.data.data
            setEmployeeOptions(data.map(emp => ({
                value: emp.id,
                label: `${emp.name} (ID: ${emp.id})`
            })));
            setIsLoading(false)
        };
        fetchEmployees();
    }, [isOpen]);


    const onSubmit = async (data: FormValues) => {

        setIsLoading(true);
        const res = await storeTask(data);
        if (res?.success) {
            toast({ title: res?.message });

            window.location.reload();
            form.reset();

            onClose()

        } else {
            toast({ variant: "destructive", title: res?.message || "An error occurred" });
        }
        setIsLoading(false);
    }


    const handleError = (errors: typeof form.formState.errors) => {
        // Optional: log all error messages
        try {
            const flatErrors = Object.entries(errors).map(([field, error]) => ({
                field,
                message: error?.message,
            }));

            const assignmentsErrors = flatErrors.find(item => item.field == "assignments")

            if (assignmentsErrors) {
                toast({
                    variant: "destructive",
                    description: "Employee IDs must be unique",
                });
            }

        } catch (err) {
            console.log(err)
        }

    };
    return (
        <Dialog onOpenChange={onClose} open={isOpen} modal defaultOpen={isOpen}>
            <ScrollArea className="h-full m-0">
                <DialogContent className="sm:max-w-[550px]">
                    <DialogHeader>
                        <DialogTitle>Add Task</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit, handleError)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="description"
                                disabled={isLoading}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Project description" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="date"
                                disabled={isLoading}
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(new Date(field.value), "PPP")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={new Date(field.value)}
                                                    onSelect={(date) =>
                                                        field.onChange(format(date || new Date(), "yyyy-MM-dd"))
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="hourly_rate"
                                disabled={isLoading}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Hourly Rate</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="additional_charges"
                                disabled={isLoading}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Additional Charges</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-sm font-medium">Assignments</h3>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        disabled={isLoading}
                                        onClick={() => append({ employee_id: 0, hours_spent: 0 })}
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Assignment
                                    </Button>
                                </div>
                                {fields.length > 0 ? (
                                    <ScrollArea className="h-full m-0">
                                        {fields.map((field, index) => (
                                            <div key={field.id} className="grid grid-cols-12 gap-4 mb-4 items-end border p-4 rounded-lg">
                                                {/* Remove Button */}
                                                <div className="col-span-12 flex justify-end">
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="icon"
                                                        onClick={() => remove(index)}
                                                        disabled={isLoading}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                {/* Employee ID Field */}
                                                <div className="col-span-12">
                                                    <FormField
                                                        disabled={isLoading}
                                                        control={form.control}
                                                        name={`assignments.${index}.employee_id`}
                                                        render={({ field }) => (
                                                            <FormItem className="flex flex-col">
                                                                <FormLabel>
                                                                    Employee {index + 1}
                                                                </FormLabel>
                                                                <Popover>
                                                                    <PopoverTrigger asChild>
                                                                        <FormControl>
                                                                            <Button
                                                                                disabled={isLoading}
                                                                                variant="outline"
                                                                                role="combobox"
                                                                                className="w-full justify-between"
                                                                            >
                                                                                {field.value
                                                                                    ? employeeOptions.find(emp => emp.value === field.value)?.label
                                                                                    : "Select employee..."}
                                                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                                            </Button>
                                                                        </FormControl>
                                                                    </PopoverTrigger>
                                                                    <PopoverContent className="w-full p-0">
                                                                        <Command>
                                                                            <CommandInput
                                                                                placeholder="Search employees..."
                                                                                onValueChange={setSearch}
                                                                            />
                                                                            <CommandEmpty>No employee found.</CommandEmpty>
                                                                            <CommandGroup>
                                                                                {employeeOptions
                                                                                    .filter(emp =>
                                                                                        emp.label.toLowerCase().includes(search.toLowerCase())
                                                                                    )
                                                                                    .slice(0, 10)
                                                                                    .map((emp) => (
                                                                                        <CommandItem
                                                                                            value={emp.label}
                                                                                            key={emp.value}
                                                                                            onSelect={() => field.onChange(emp.value)}
                                                                                        >
                                                                                            <Check
                                                                                                className={cn(
                                                                                                    "mr-2 h-4 w-4",
                                                                                                    field.value === emp.value ? "opacity-100" : "opacity-0"
                                                                                                )}
                                                                                            />
                                                                                            {emp.label}
                                                                                        </CommandItem>
                                                                                    ))}

                                                                            </CommandGroup>
                                                                        </Command>
                                                                    </PopoverContent>
                                                                </Popover>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>

                                                {/* Hours Spent Field */}
                                                <div className="col-span-12">
                                                    <FormField
                                                        control={form.control}
                                                        name={`assignments.${index}.hours_spent`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>
                                                                    Hours Spent
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        type="number"
                                                                        step="0.5"
                                                                        min="0.5"
                                                                        max="24"
                                                                        placeholder="Hours spent"
                                                                        {...field}
                                                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                                                        disabled={isLoading}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>

                                            </div>
                                        ))}
                                    </ScrollArea>) : (
                                    <div className="flex items-center justify-center h-[100px] border rounded-md">
                                        <p className="text-sm text-muted-foreground">No assignments added</p>
                                    </div>
                                )}
                            </div>
                            {/* Add Assignment Button */}
                            <div className="flex justify-end mt-4">
                                {!isLoading ? <Button type="submit"
                                    disabled={isLoading}
                                >Submit
                                </Button> : <Spinner />}
                            </div>
                        </form>
                    </Form>
                </DialogContent>
            </ScrollArea>


        </Dialog>
    )
}

export default AddData;
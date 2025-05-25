export interface Task {
    id: number
    description: string;
    date: Date;
    hourly_rate: string;
    additional_charges: string
    total_remuneration: string;
    employees?: EmployesAssignment[];
    created_at: Date;
    updated_at: Date;
}

export interface EmployesAssignment {
    id: number;
    name: string;
    hours_spent: string;
}

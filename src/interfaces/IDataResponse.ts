export interface IPagination {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
}

export interface PaginatedData<T> {
    data: T[];
    pagination: IPagination;
}

export interface DataResponse<T> {
    status: number;
    success: boolean;
    message: string;
    data: PaginatedData<T>;
}

export interface InputResponse<T> {
    status: number;
    success: boolean;
    message: string;
    data: T;
}

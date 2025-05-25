"use server";

import { DataResponse, InputResponse } from "@/interfaces/IDataResponse";
import { Employee, EmployeeStore } from "@/interfaces/IEmployee";
import { cookies } from "next/headers";

export const getEmployee = async (page: number, show: number = 10, query?: string,  search?: string) => {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value;

    const headers: Record<string, any> = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        cache: 'no-store',

    };
    let url = `${process.env.HOST}/employees?page=${page}&show=${show}&${query}`
    if (search) {
        url += `&search=${search}`
    }
    const response = await fetch(
        url,
        {
            headers,
            cache: "no-store", // this makes router.refresh() re-fetch
        },
    );
    const result: DataResponse<Employee> = await response.json();
    return result;
};

export const storeEmployee = async (data: EmployeeStore) => {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value;

    const headers: Record<string, any> = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };


    const url = process.env.HOST + "/employees";
    try {
        const response = await fetch(url, {
            method: "POST",
            headers,
            cache: 'no-store',
            body: JSON.stringify(data),
        });
        const result: InputResponse<Employee> = await response.json();
        return result
    } catch (error) {
        console.error("Error: ", error);
    }
}

export const updateEmployee = async (data: EmployeeStore, id: number) => {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value;

    const headers: Record<string, any> = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };


    const url = process.env.HOST + `/employees/${id}`;
    try {
        const response = await fetch(url, {
            method: "PUT",
            headers,
            cache: 'no-store',
            body: JSON.stringify(data),
        });
        const result: InputResponse<Employee> = await response.json();
        return result
    } catch (error) {
        console.error("Error: ", error);
    }
}

export const deleteEmployee = async (id: number) => {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value;

    const headers: Record<string, any> = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };


    const url = process.env.HOST + `/employees/${id}`;

    try {
        const response = await fetch(url, {
            method: "DELETE",
            headers,
            cache: 'no-store',
        });
        const result: InputResponse<Employee> = await response.json();
        return result
    } catch (error) {
        console.error("Error: ", error);
    }
}

"use server";

import { DataResponse, InputResponse } from "@/interfaces/IDataResponse";
import { Task } from "@/interfaces/ITask";
import { cookies } from "next/headers";


export const getTask = async (page: number, show: number = 10, query: string, search: string) => {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value;

    const headers: Record<string, any> = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        cache: 'no-store',

    };
    const url = `${process.env.HOST}/tasks?page=${page}&show=${show}&${query}&search=${search}`
    const response = await fetch(
        url,
        {
            headers,
            cache: "no-store", // this makes router.refresh() re-fetch
        },
    );
    const result: DataResponse<Task> = await response.json();

    return result;
};


// export const getEmployee = async (page: number, show: number = 10, query: string, search: string) => {
//     const cookieStore = await cookies()
//     const token = cookieStore.get("token")?.value;

//     const headers: Record<string, any> = {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//         cache: 'no-store',

//     };
//     const url = `${process.env.HOST}/employees?page=${page}&show=${show}&${query}&search=${search}`
//     const response = await fetch(
//         url,
//         {
//             headers,
//             cache: "no-store", // this makes router.refresh() re-fetch
//         },
//     );
//     const result: DataResponse<Employee> = await response.json();
//     return result;
// };



export const storeTask = async (data: any) => {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value;

    const headers: Record<string, any> = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };


    const url = process.env.HOST + "/tasks";
    try {
        const response = await fetch(url, {
            method: "POST",
            headers,
            cache: 'no-store',
            body: JSON.stringify(data),
        });
        const result: InputResponse<Task> = await response.json();
        return result
    } catch (error) {
        console.error("Error: ", error);
    }
}

export const updateTask = async (data: any, id: number) => {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value;

    const headers: Record<string, any> = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };


    const url = process.env.HOST + `/tasks/${id}`;
    try {
        const response = await fetch(url, {
            method: "PUT",
            headers,
            cache: 'no-store',
            body: JSON.stringify(data),
        });
        const result: InputResponse<Task> = await response.json();
        return result
    } catch (error) {
        console.error("Error: ", error);
    }
}

export const deleteTask = async (id: number) => {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value;

    const headers: Record<string, any> = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };


    const url = process.env.HOST + `/tasks/${id}`;
    try {   
        const response = await fetch(url, {
            method: "DELETE",
            headers,
            cache: 'no-store',
        });
        const result: InputResponse<Task> = await response.json();
        return result
    } catch (error) {
        console.error("Error: ", error);
    }
}

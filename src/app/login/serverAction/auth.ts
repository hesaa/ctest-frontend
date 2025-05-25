"use server";

export async function handleLogin(
    email: string,
    password: string,
) {
    const url = process.env.HOST + "/auth/login";
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });
        const result = await response.json();
        if (!result.status) {
            return false
        }
        return result;
    } catch (error) {
        console.error("Error: ", error);
        return {
            success: false,
            error
        };
    }
}

export async function handleLogout(token: string) {
    const url = process.env.HOST + "/auth/logout";
    try {
        const headers: Record<string, any> = {
            Authorization: token,
            "Content-Type": "application/json",
        };


        const response = await fetch(url, {
            method: "POST",
            headers,
            cache: "no-cache",
        });
        const result = await response.json();
        if (!result.status) {
            return {
                success: false,
                error: {
                    name: "LoginError",
                    message: result?.message
                },
            }
        }

        return result.data;
    } catch (error) {
        console.error("Error: ", error);
        return {
            success: false,
            error
        };
    }
}
export async function handleMe(token: string) {
    const url = process.env.HOST + "/auth/me";
    try {
        const headers: Record<string, any> = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        };


        const response = await fetch(url, {
            headers,
            cache: "no-cache",
        });
        const result = await response.json();
        if (!result.status) {
            return false
        }

        return result.data;
    } catch (error) {
        console.error("Error: ", error);
        return {
            success: false,
            error
        };
    }
}

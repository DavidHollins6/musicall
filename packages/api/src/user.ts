import { User } from "@musicall/storage";

export const getUser = async (id: string): Promise<User | null> => {
    const response = await fetch(`${process.env.API_URL}/user/${id}`);
    if (response.ok) {
        const room = (await response.json()) as User;
        return room;
    }

    console.error("Error getting user: ", response.status);
    return null;
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
    const response = await fetch(`${process.env.API_URL}/user/email/${email}`);
    if (response.ok) {
        const user = (await response.json()) as User;
        return user;
    }

    console.error("Error getting user by email: ", response.status);
    return null;
};

export const createUser = async (userId: string, email: string, name: string): Promise<User | null> => {
    const response = await fetch(`${process.env.API_URL}/user/create/${userId}`, {
        method: "POST",
        body: JSON.stringify({
            email,
            name,
        }),
        headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
        const user = (await response.json()) as User;
        return user;
    }

    console.error("Error creating user: ", response.status);
    return null;
};

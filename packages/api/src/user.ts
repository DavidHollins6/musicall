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

import { Room } from "@musicall/storage";

export const getRoom = async (id: string): Promise<Room | null> => {
    const response = await fetch(`http://localhost:3000/room/${id}`);
    if (response.ok) {
        const room = (await response.json()) as Room;
        return room;
    }

    console.error("Error getting room: ", response.status);
    return null;
};

export const getRoomAllowList = async (id: string): Promise<Array<string>> => {
    const response = await fetch(`http://localhost:3000/room/${id}/allow-list`);
    if (response.ok) {
        const allowList = (await response.json()) as Array<string>;
        return allowList;
    }

    console.error("Error getting allow list: ", response.status);
    return [];
};

export const getOwnedRooms = async (id: string): Promise<Array<Room>> => {
    const response = await fetch(`http://localhost:3000/room/owned/${id}`);
    if (response.ok) {
        const allowList = (await response.json()) as Array<Room>;
        return allowList;
    }

    console.error("Error getting owned rooms: ", response.status);
    return [];
};

export const createRoom = async (userId: string, email: string): Promise<Room | null> => {
    const response = await fetch(`http://localhost:3000/room/create/${userId}`, {
        method: "POST",
        body: JSON.stringify({
            email,
        }),
        headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
        const user = (await response.json()) as Room;
        return user;
    }

    console.error("Error creating room: ", response.status);
    return null;
};

export const allowUserIntoRoom = async (id: string, userId: string): Promise<boolean> => {
    const response = await fetch(`http://localhost:3000/room/${id}/allow`, {
        method: "POST",
        body: JSON.stringify({
            userId,
        }),
        headers: { "Content-Type": "application/json" },
    });

    return response.ok;
};

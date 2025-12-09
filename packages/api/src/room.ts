import { Room } from "@musicall/storage";

export const getRoom = async (id: string): Promise<Room | null> => {
    const response = await fetch(`${process.env.API_URL}/room/${id}`);
    if (response.ok) {
        const room = (await response.json()) as Room;
        return room;
    }

    console.error("Error getting room: ", response.status);
    return null;
};

export const getRoomAllowList = async (id: string): Promise<Array<string>> => {
    const response = await fetch(`${process.env.API_URL}/room/${id}/allow-list`);
    if (response.ok) {
        const allowList = (await response.json()) as Array<string>;
        return allowList;
    }

    console.error("Error getting allow list: ", response.status);
    return [];
};

export const getOwnedRooms = async (id: string): Promise<Array<Room>> => {
    const response = await fetch(`${process.env.API_URL}/room/owned/${id}`);
    if (response.ok) {
        const allowList = (await response.json()) as Array<Room>;
        return allowList;
    }

    console.error("Error getting owned rooms: ", response.status);
    return [];
};

export const createRoom = async (room: Room): Promise<Room | null> => {
    const response = await fetch(`${process.env.API_URL}/room/create/${room.id}`, {
        method: "POST",
        body: JSON.stringify(room),
        headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
        const user = (await response.json()) as Room;
        return user;
    }

    console.error("Error creating room: ", response.status);
    return null;
};

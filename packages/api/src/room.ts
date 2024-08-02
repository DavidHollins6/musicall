import { Room } from "@musicall/storage/types";

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

export const allowUserIntoRoom = async (
  id: string,
  userId: string
): Promise<boolean> => {
  const response = await fetch(`http://localhost:3000/room/${id}/allow`, {
    method: "POST",
    body: JSON.stringify({
      userId,
    }),
    headers: { "Content-Type": "application/json" },
  });

  return response.ok;
};

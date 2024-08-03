import { User } from "@musicall/storage/types";

export const getUser = async (id: string): Promise<User | null> => {
  const response = await fetch(`http://localhost:3000/user/${id}`);
  if (response.ok) {
    const room = (await response.json()) as User;
    return room;
  }

  console.error("Error getting user: ", response.status);
  return null;
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const response = await fetch(`http://localhost:3000/user/email/${email}`);
  if (response.ok) {
    const user = (await response.json()) as User;
    return user;
  }

  console.error("Error getting user by email: ", response.status);
  return null;
};

export const createUser = async (
  userId: string,
  email: string
): Promise<User | null> => {
  const response = await fetch(`http://localhost:3000/user/create/${userId}`, {
    method: "POST",
    body: JSON.stringify({
      email,
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

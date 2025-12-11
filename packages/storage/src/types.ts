export type User = {
    firstName: string;
    lastName: string;
    primaryEmailAddress: string;
    id: string;
};

export type Room = {
    id: string;
    ownerId: string;
    name: string;
};

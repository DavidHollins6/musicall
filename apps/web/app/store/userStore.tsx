import { User } from "@musicall/storage";
import { createContext, useContext } from "react";
import { createStore, useStore } from "zustand";

interface UserState {
    user: User;
    isOwner: boolean;
}

type UserStore = ReturnType<typeof createUserStore>;

export const createUserStore = (initProps: UserState) => {
    return createStore<UserState>()(() => ({
        ...initProps,
    }));
};

export const UserContext = createContext<UserStore | null>(null);

export const useUserStore = () => {
    const store = useContext(UserContext);
    if (!store) throw new Error("Missing BearContext.Provider in the tree");
    const storeData = useStore(store, (s) => s);
    return storeData;
};

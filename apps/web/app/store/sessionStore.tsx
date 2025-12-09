import { User } from "@musicall/storage";
import { createContext, useContext } from "react";
import { createStore, useStore } from "zustand";

interface SessionState {
    user?: User;
}

type UserStore = ReturnType<typeof createSessionStore>;

export const createSessionStore = (initProps: SessionState) => {
    return createStore<SessionState>()(() => ({
        ...initProps,
    }));
};

export const SessionContext = createContext<UserStore | null>(null);

export const useSessionStore = () => {
    const store = useContext(SessionContext);
    if (!store) throw new Error("Missing BearContext.Provider in the tree");
    const storeData = useStore(store, (s) => s);
    return storeData;
};

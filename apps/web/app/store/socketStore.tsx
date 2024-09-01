import PartySocket from "partysocket";
import { create } from "zustand";
import { produce } from "immer";

type State = {
    socket: PartySocket | null;
};

type Actions = {
    setSocket: (socket: PartySocket) => void;
};

export const useSocketStore = create<State & Actions>((set) => ({
    socket: null,
    setSocket: (socket: PartySocket) => {
        set(
            produce((state: State) => {
                state.socket = socket;
            }),
        );
    },
}));

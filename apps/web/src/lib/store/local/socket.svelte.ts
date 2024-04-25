import type PartySocket from "partysocket";
import { getContext, setContext } from "svelte";

const STORE_NAME = "socket";

export type SocketContext = {
    socket: PartySocket;
};

export function createSocketStore(initial: SocketContext) {
    let socket = $state<PartySocket>(initial.socket);

    setContext(STORE_NAME, {
        get socket() {
            return socket;
        },
        set socket(value) {
            socket = value;
        },
    });
}

export function getSocketStore() {
    return getContext<SocketContext>(STORE_NAME);
}

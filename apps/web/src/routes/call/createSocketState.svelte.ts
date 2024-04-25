import type PartySocket from "partysocket";

export type SocketContext = {
    socket: PartySocket;
};

export default function createSocketState(initial: SocketContext) {
    let socket = $state<PartySocket>(initial.socket);

    return {
        get socket() {
            return socket;
        },
        set socket(value) {
            socket = value;
        },
    };
}

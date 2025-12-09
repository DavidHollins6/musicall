import { useSelector } from "@xstate/react";
import { createActor, setup } from "xstate";
import type { ServerMessages } from "@musicall/types/serverMessage";
import { socket } from "../utils/socket/socket";

export const socketMachine = setup({
    types: {} as {
        events:
            | {
                  type: "socket.connect";
              }
            | {
                  type: "socket.sendMessage";
                  message: ServerMessages;
              };
    },
}).createMachine({
    id: "socket",
    context: {
        socket: null,
    },
    initial: "disconnected",
    states: {
        disconnected: {
            on: {
                "socket.connect": {
                    target: "#socket.connected",
                    actions: () => {
                        socket.connect();
                    },
                },
            },
        },
        connected: {
            on: {
                "socket.sendMessage": {
                    actions: ({ event }) => {
                        socket.emit(event.type, event);
                    },
                },
            },
        },
    },
});

export const socketActor = createActor(socketMachine);

export const useSocketStateMachine = () => {
    const state = useSelector(socketActor, (state) => state);

    return {
        ...state,
        send: socketActor.send,
    };
};

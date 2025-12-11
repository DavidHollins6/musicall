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
                  type: "socket.connected";
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
    initial: "connecting",
    states: {
        connecting: {
            entry: () => {
                // Listen for the actual socket connection event
                socket.on("connect", () => {
                    socketActor.send({ type: "socket.connected" });
                });

                socket.connect();
            },
            on: {
                "socket.connected": {
                    target: "connected",
                },
            },
        },
        disconnected: {
            on: {
                "socket.connect": {
                    target: "connecting",
                },
            },
        },
        connected: {
            on: {
                "socket.sendMessage": {
                    actions: ({ event }) => {
                        console.log("sending event", event.message.type);
                        socket.emit(event.message.type, event.message);
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

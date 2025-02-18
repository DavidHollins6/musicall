import { useSelector } from "@xstate/react";
import PartySocket from "partysocket";
import { assign, createActor, setup } from "xstate";

export const socketMachine = setup({
    types: {} as {
        context: {
            socket?: PartySocket;
        };
        events:
            | {
                  type: "socket.setSocket";
                  socket: PartySocket;
              }
            | {
                  type: "socket.initialized";
                  socket: PartySocket;
              }
            | {
                  type: "socket.sendMessage";
                  message: string;
              };
    },
}).createMachine({
    id: "socket",
    context: {},
    initial: "initializing",
    states: {
        initializing: {
            on: {
                "socket.initialized": {
                    target: "#socket.initialized",
                    actions: assign({
                        socket: ({ event }) => event.socket,
                    }),
                },
            },
        },
        initialized: {
            on: {
                "socket.sendMessage": {
                    actions: ({ event, context }) => {
                        context.socket?.send(event.message);
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

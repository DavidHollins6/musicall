import { useMachine } from "@xstate/svelte";
import { assign, setup } from "xstate";
import { getContext, setContext } from "svelte";

export const CONTEXT_NAME = "chat";
export const chatMachine = setup({
    types: {} as {
        context: {
            chatMessages: string[];
            unreadMessages: number;
        };
    },
    actions: {
        addMessage: assign({
            chatMessages: ({ context, event }) => {
                console.log(event);
                return [...context.chatMessages, event.message];
            },
        }),
        incrementUnreadMessages: assign({
            unreadMessages: ({ context }) => context.unreadMessages + 1,
        }),
        resetUnreadMessages: assign({
            unreadMessages: () => 0,
        }),
    },
}).createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QGMAWBDALgOggS1mQHsA7EsZTSAYgGEB5AOUYFFaAVAbQAYBdRUAAcisPJjykBIAB6IAjAE4ArNjkAOAOwAWBQCZdSgGxL93AMwAaEAE9EZw2tXcFZpRu5Klcuc4C+vqzQsbGIyCioIaiDMACUKMDwAN0gefiQQYVFxSXTZBDMNRwUtEwVDQwMlEu4tK1sEXW1sLW4K6rM1Qw1dLQ1-QIwcUPJKGjwSZAAnMABbMBJMAFUSafQIAFk4WHQYWFSpTLEJEik8s11Hew05dwVFDUMFOvkNDWxlMzlGuV6f+-6QNEQqQRhFqNNYGAliswGtNrBtrt9ulDtkTrk7FpDM0fjUKp5nGYnjZEGo5NglNwqc5KoZvL1-AEQCQiBA4FJogcREccqA8gBaQzPBD8lQKcUSyWSswAoH4Qgg8KQLlZY6nRBaXTC+yOQyEkoaFyGVxyWWDYFhUYQFU89F8ux3bBdNyGLQFDpfG7ajQqNRKI26FzcXTBsqM3xAA */
    id: CONTEXT_NAME,
    initial: "disconnected",
    context: { chatMessages: [], unreadMessages: 0 },
    states: {
        disconnected: {
            on: { CONNECT: "connected" },
        },
        connected: {
            on: {
                ADD_MESSAGE: {
                    actions: "addMessage",
                },
                incrementUnreadMessages: {
                    actions: "incrementUnreadMessages",
                },
                resetUnreadMessages: {
                    actions: "resetUnreadMessages",
                },
            },
        },
    },
});

export type Actor = ReturnType<typeof useMachine<typeof chatMachine>>;

export const createChatMachine = () => {
    setContext(CONTEXT_NAME, useMachine(chatMachine));
};

export const getChatMachine = () => {
    return getContext<Actor>(CONTEXT_NAME);
};

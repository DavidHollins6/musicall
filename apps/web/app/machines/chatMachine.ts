import { User } from "@musicall/storage";
import { useSelector } from "@xstate/react";
import { assign, createActor, setup } from "xstate";

type ChatMessage = {
    from: User;
    message: string;
    timestamp: number;
};

export const chatMachine = setup({
    types: {} as {
        context: {
            messages: Array<ChatMessage>;
        };
        events: {
            type: "chat.sendMessage";
            message: ChatMessage;
        };
    },
}).createMachine({
    id: "chat",
    context: {
        messages: [],
    },
    initial: "connected",
    states: {
        connected: {
            on: {
                "chat.sendMessage": {
                    actions: assign(({ context, event }) => ({ messages: [...context.messages, event.message] })),
                },
            },
        },
    },
});

export const chatActor = createActor(chatMachine);

export const useChatStateMachine = () => {
    const state = useSelector(chatActor, (state) => state);

    return {
        ...state,
        send: chatActor.send,
    };
};

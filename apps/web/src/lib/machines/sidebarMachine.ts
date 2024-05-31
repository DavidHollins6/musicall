import { useMachine } from "@xstate/svelte";
import { assign, setup } from "xstate";
import { getContext, setContext } from "svelte";

export const CONTEXT_NAME = "callUI";
export const callUIMachine = setup({
    actions: {
        receiveMessage: assign({
            chatMessages: ({ context }) => [...context.chatMessages, "hello"],
        }),
    },
}).createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QGMCGAbdBVAkgOmXQHtZIBiAeQAUBRAOQH0BhACQEEAVBgZRwBEaAITYAlANoAGALqJQABxIBLAC6KiAO1kgAHogCMANgCceAEwB2AMwAWa+YPm91gKzHTAGhABPRKecSzfwlTYOsDCQM7AF8ozzRMXAJiUghKWkYqUQ4cJhxMug5uHn4hUUkZJBAFWBU1TUrdBEMTCxs7BydXIw9vRAAOPTwgiQlbI0sjPVMDPRi4jGx8ZAALVGUyJgAZCm4aYoFhcWktatqNLUaLczwJPVdrCOcjcz8-Tx8moxNzYefbA1MXz6cxA8UWBFW62o9AYmRE2Vy+UK+1KRwq8iUqnODUQzmcpkCI1MenMRms0ws718+LwPyJoXCkXMILBiTkqAATqpkIp2eplLANttdijDuUTpi6hdEAYnngvqZiXY+n5LHoqQhLI4biNgs5rEYHCrZrFQQs2ZzubzUPzBdDGKxOKKysdKqcsfVQI0AQFLM47kZnJYDH0gs4NSECX5dX8woCjMCQeoiBA4FpWTgJTUPdKEABaAwagss81LZKQLNnT06RDkjWBobDey2GyWCSWEsJJaQys5nEIMKDCKvclG7rPCMSPp4SyztoqlWhDumjN4dlcxQ8vkC3tS-uh6w3CYSBPH4x9cyT5x4cIjPQSUl2KzWZcxIA */
    id: CONTEXT_NAME,
    initial: "closed",
    context: { chatMessages: [], unreadMessages: 0 },
    states: {
        closed: {
            on: {
                OPEN_CHAT_SIDEBAR: {
                    target: "chat",
                },
                OPEN_PARTICIPANTS_SIDEBAR: {
                    target: "participants",
                },
            },
        },
        chat: {
            on: {
                CLOSE_SIDEBAR: {
                    target: "closed",
                },
                OPEN_PARTICIPANTS_SIDEBAR: {
                    target: "participants",
                },
            },
        },
        participants: {
            on: {
                CLOSE_SIDEBAR: {
                    target: "closed",
                },
                OPEN_CHAT_SIDEBAR: {
                    target: "chat",
                },
            },
        },
    },
});

export type Actor = ReturnType<typeof useMachine<typeof callUIMachine>>;

export const createToggleMachine = () => {
    setContext(CONTEXT_NAME, useMachine(callUIMachine));
};

export const getToggleMachine = () => {
    return getContext<Actor>(CONTEXT_NAME);
};

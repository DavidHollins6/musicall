import { getContext, setContext } from "svelte";

const STORE_NAME = "chat";

export type Context = {
    chatMessages: Array<{ message: string; from: string; timestamp: number }>;
    unreadMessages: number;
};

export function createChatStore(initial: Context) {
    let chatMessages = $state(initial.chatMessages);
    let unreadMessages = $state(initial.unreadMessages);

    setContext(STORE_NAME, {
        get chatMessages() {
            return chatMessages;
        },
        set chatMessages(value) {
            chatMessages = value;
        },

        get unreadMessages() {
            return unreadMessages;
        },
        set unreadMessages(value) {
            unreadMessages = value;
        },
    });
}

export function getChatStore() {
    return getContext<Context>(STORE_NAME);
}

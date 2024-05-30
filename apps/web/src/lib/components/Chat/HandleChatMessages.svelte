<script lang="ts">
    import { getCallStore } from "$lib/store/local/call.svelte";
    import { getChatStore } from "$lib/store/local/chat.svelte";
    import { getUIStore } from "$lib/store/local/ui.svelte";

    const callStore = getCallStore();
    const chatStore = getChatStore();
    const uiStore = getUIStore();

    $effect(() => {
        callStore.webRTCHandler.onChatMessageReceived = (message, from, timestamp) => {
            chatStore.chatMessages.push({ message, from, timestamp });

            if (uiStore.sidePanel !== "chat") {
                chatStore.unreadMessages++;
            }
        };
    });
</script>

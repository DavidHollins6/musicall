<script lang="ts">
    import { getCallStore } from "$lib/store/local/call.svelte";

    const callStore = getCallStore();

    $effect(() => {
        callStore.webRTCHandler.onChatMessageReceived = (message, from, timestamp) => {
            callStore.chatMessages.push({ message, from, timestamp });

            if (!callStore.isSidePanelOpen && callStore.sidePanel !== "chat") {
                callStore.unreadMessages++;
            }
        };
    });
</script>

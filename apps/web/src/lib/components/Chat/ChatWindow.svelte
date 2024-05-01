<script lang="ts">
    import SendIcon from "~icons/mdi/send-variant-outline";
    import { getCallStore } from "$lib/store/local/call.svelte";
    import ChatMessage from "./ChatMessage.svelte";

    let message = $state("");
    const callStore = getCallStore();
</script>

<div class="h-full flex flex-col border-l-neutral-content border-solid border-l">
    <div class="grow overflow-y-auto p-2 flex flex-col gap-4">
        {#each callStore.chatMessages as message}
            <ChatMessage message={message.message} isMyMessage={message.from === callStore.webRTCHandler.socket.id} />
        {/each}
    </div>
    <div class="p-2 flex gap-4">
        <input class="input input-bordered grow" type="text" bind:value={message} />
        <button
            disabled={message.length === 0}
            class="btn btn-neutral"
            onclick={() => {
                callStore.webRTCHandler.sendData({
                    type: "chat",
                    from: callStore.webRTCHandler.socket.id,
                    message,
                    timestamp: Date.now(),
                });

                callStore.chatMessages.push({
                    from: callStore.webRTCHandler.socket.id,
                    message,
                    timestamp: Date.now(),
                });
                message = "";
            }}><SendIcon class="text-xl" /></button
        >
    </div>
</div>

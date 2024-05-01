<script lang="ts">
    import { getCallStore } from "$lib/store/local/call.svelte";
    import ChatWindow from "../Chat/ChatWindow.svelte";
    import ParticipantsWindow from "../Participants/ParticipantsWindow.svelte";

    const callStore = getCallStore();
</script>

<div class="w-full h-full flex flex-col overflow-hidden">
    <div class="border-l-neutral-content border-solid border-l p-4">
        <div role="tablist" class="tabs tabs-boxed">
            <button
                role="tab"
                onclick={() => {
                    callStore.sidePanel = "chat";
                    callStore.unreadMessages = 0;
                }}
                class={`tab ${callStore.sidePanel === "chat" ? "tab-active" : ""}`}
            >
                Chat
                {#if callStore.unreadMessages}
                    <div class="badge badge-info ml-2">{callStore.unreadMessages}</div>
                {/if}</button
            >
            <button
                role="tab"
                onclick={() => {
                    callStore.sidePanel = "participants";
                }}
                class={`tab ${callStore.sidePanel === "participants" ? "tab-active" : ""}`}>Participants</button
            >
        </div>
    </div>

    {#if callStore.sidePanel === "chat"}
        <ChatWindow />
    {:else}
        <ParticipantsWindow />
    {/if}
</div>

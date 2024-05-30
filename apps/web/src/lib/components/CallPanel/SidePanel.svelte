<script lang="ts">
    import { getChatStore } from "$lib/store/local/chat.svelte";
    import { getUIStore } from "$lib/store/local/ui.svelte";
    import ChatWindow from "../Chat/ChatWindow.svelte";
    import ParticipantsWindow from "../Participants/ParticipantsWindow.svelte";

    const uiStore = getUIStore();
    const chatStore = getChatStore();
</script>

<div class="w-full h-full flex flex-col overflow-hidden">
    <div class="border-l-neutral-content border-solid border-l p-4">
        <div role="tablist" class="tabs tabs-boxed">
            <button
                role="tab"
                onclick={() => {
                    uiStore.sidePanel = "chat";
                    chatStore.unreadMessages = 0;
                }}
                class={`tab ${uiStore.sidePanel === "chat" ? "tab-active" : ""}`}
            >
                Chat
                {#if chatStore.unreadMessages}
                    <div class="badge badge-info ml-2">{chatStore.unreadMessages}</div>
                {/if}</button
            >
            <button
                role="tab"
                onclick={() => {
                    uiStore.sidePanel = "participants";
                }}
                class={`tab ${uiStore.sidePanel === "participants" ? "tab-active" : ""}`}>Participants</button
            >
        </div>
    </div>

    {#if uiStore.sidePanel === "chat"}
        <ChatWindow />
    {:else if uiStore.sidePanel === "participants"}
        <ParticipantsWindow />
    {/if}
</div>

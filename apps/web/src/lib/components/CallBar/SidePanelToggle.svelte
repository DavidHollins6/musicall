<script lang="ts">
    import { getChatStore } from "$lib/store/local/chat.svelte";
    import { getUIStore } from "$lib/store/local/ui.svelte";
    import MenuIcon from "~icons/mdi/menu";
    import MenuCloseIcon from "~icons/mdi/menu-close";

    const uiStore = getUIStore();
    const chatStore = getChatStore();
</script>

<button
    on:click={() => {
        if (uiStore.sidePanel) {
            uiStore.sidePanel = "chat";
            chatStore.unreadMessages = 0;
        } else {
            uiStore.sidePanel = null;
        }
    }}
    class={`btn text-2xl relative ${uiStore.sidePanel ? "btn-info" : "btn-outline"}`}
>
    {#if uiStore.sidePanel}
        <MenuCloseIcon />
    {:else}
        <MenuIcon />
    {/if}
    {#if chatStore.unreadMessages}
        <div class="badge badge-info absolute -top-2 -right-2">{chatStore.unreadMessages}</div>
    {/if}
</button>

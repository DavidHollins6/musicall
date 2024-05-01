<script lang="ts">
    import { getCallStore } from "$lib/store/local/call.svelte";
    import MenuIcon from "~icons/mdi/menu";
    import MenuCloseIcon from "~icons/mdi/menu-close";

    const callStore = getCallStore();
</script>

<button
    on:click={async () => {
        callStore.isSidePanelOpen = !callStore.isSidePanelOpen;
        if (callStore.sidePanel === "chat") {
            callStore.unreadMessages = 0;
        }
    }}
    class={`btn text-2xl relative ${callStore.isSidePanelOpen ? "btn-info" : "btn-outline"}`}
>
    {#if callStore.isSidePanelOpen}
        <MenuCloseIcon />
    {:else}
        <MenuIcon />
    {/if}
    {#if callStore.unreadMessages}
        <div class="badge badge-info absolute -top-2 -right-2">{callStore.unreadMessages}</div>
    {/if}
</button>

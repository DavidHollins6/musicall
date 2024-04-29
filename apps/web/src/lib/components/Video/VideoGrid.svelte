<script lang="ts">
    import LocalVideo from "./LocalVideo.svelte";
    import { getCallStore } from "$lib/store/local/call.svelte";
    import TheirVideo from "./TheirVideo.svelte";

    const callStore = getCallStore();
    let numberOfItems = $derived(Object.keys(callStore.webRTCHandler.peers).length + 1);

    // This is disgusting, maybe we need a fun algorithm here?
    const itemStyles: Record<number, string> = {
        1: "w-full h-full",
        2: "w-1/2 h-full",
        3: "w-1/2 h-1/2",
        4: "w-1/2 h-1/2",
        5: "w-1/3 h-1/2",
        6: "w-1/3 h-1/2",
        7: "w-1/4 h-1/2",
        8: "w-1/4 h-1/2",
    };
</script>

<div class="p-20" style="height: calc(100% - 80px)">
    <div class="h-full flex flex-wrap justify-center">
        <LocalVideo containerClass={itemStyles[numberOfItems]} />
        {#each Object.keys(callStore.webRTCHandler.peers) as peerId}
            <TheirVideo {peerId} containerClass={itemStyles[numberOfItems]} />
        {/each}
    </div>
</div>

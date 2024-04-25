<script lang="ts">
    import Video from "./Video.svelte";
    import LocalVideo from "./LocalVideo.svelte";
    import { getCallStore } from "$lib/store/local/call.svelte";

    const callStore = getCallStore();
</script>

<div class="p-4 pb-0" style="height: calc(100% - 80px)">
    <div class="h-full grid grid-cols-4 gap-4">
        <LocalVideo />
        {#each Object.keys(callStore.peerConnection.peers) as peer}
            <Video peerId={peer} />
        {/each}
    </div>
</div>

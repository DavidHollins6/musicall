<script lang="ts">
    import { getCallStore } from "$lib/store/local/call.svelte";
    import ParticipantCard from "./ParticipantCard.svelte";

    const callStore = getCallStore();
</script>

<div class="h-full border-l-neutral-content border-solid border-l p-2 flex flex-col gap-4">
    <ParticipantCard peerId={callStore.webRTCHandler.socket.id} />
    {#each Object.keys(callStore.webRTCHandler.peers) as peerId}
        <ParticipantCard {peerId} />
    {/each}
</div>

<script lang="ts">
    import MicRoundedIcon from "~icons/mdi/microphone";
    import MicOffIcon from "~icons/mdi/microphone-off";

    import { getCallStore } from "$lib/store/local/call.svelte";

    const callStore = getCallStore();
</script>

<button
    on:click={() => {
        callStore.peerConnection.toggleMic(!callStore.isMicrophoneMuted);
        callStore.isMicrophoneMuted = !callStore.isMicrophoneMuted;
    }}
    class={`btn btn-square text-2xl ${callStore.isMicrophoneMuted ? "btn-warning" : "btn-success"}`}
>
    {#if callStore.isMicrophoneMuted}
        <MicOffIcon />
    {:else}
        <MicRoundedIcon />
    {/if}
</button>

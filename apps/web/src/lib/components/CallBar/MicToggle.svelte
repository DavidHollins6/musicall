<script lang="ts">
    import MicOnIcon from "~icons/mdi/microphone";
    import MicOffIcon from "~icons/mdi/microphone-off";

    import { getCallStore } from "$lib/store/local/call.svelte";

    const callStore = getCallStore();
</script>

<button
    on:click={() => {
        callStore.webRTCHandler.toggleMic(!callStore.isMicrophoneEnabled);
        callStore.isMicrophoneEnabled = !callStore.isMicrophoneEnabled;

        callStore.webRTCHandler.sendData({
            type: "call",
            data: { video: callStore.isVideoEnabled, microphone: callStore.isMicrophoneEnabled },
            from: callStore.webRTCHandler.socket.id,
        });
    }}
    class={`btn text-2xl shadow-md ${callStore.isMicrophoneEnabled ? "btn-success" : "btn-outline"}`}
>
    {#if callStore.isMicrophoneEnabled}
        <MicOnIcon />
    {:else}
        <MicOffIcon />
    {/if}
</button>

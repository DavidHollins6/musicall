<script lang="ts">
    import { getCallStore } from "$lib/store/local/call.svelte";
    import CameraIcon from "~icons/mdi/camera";
    import CameraOffIcon from "~icons/mdi/camera-off";

    const callStore = getCallStore();
</script>

<button
    on:click={async () => {
        await callStore.webRTCHandler.toggleCamera(!callStore.isVideoEnabled);
        callStore.isVideoEnabled = !callStore.isVideoEnabled;

        callStore.webRTCHandler.sendData({
            type: "call",
            data: { video: callStore.isVideoEnabled, microphone: callStore.isMicrophoneEnabled },
            from: callStore.webRTCHandler.socket.id,
        });
    }}
    class={`btn text-2xl shadow-md  ${callStore.isVideoEnabled ? "btn-success" : "btn-outline"}`}
>
    {#if callStore.isVideoEnabled}
        <CameraIcon />
    {:else}
        <CameraOffIcon />
    {/if}
</button>

<script lang="ts">
    import MicOnIcon from "~icons/mdi/microphone";
    import MicOffIcon from "~icons/mdi/microphone-off";

    import { getCallStore } from "$lib/store/local/call.svelte";

    const callStore = getCallStore();
</script>

<button
    on:click={() => {
        if (callStore.localStream) {
            const newValue = !callStore.inputs.microphone.enabled;

            callStore.inputs.microphone.enabled = newValue;

            const audioTrack = callStore.localStream.getTracks().find((track) => track.kind === "audio");

            if (audioTrack) {
                audioTrack.enabled = newValue;
            }

            callStore.webRTCHandler.sendData({
                type: "call",
                data: { microphone: newValue },
                from: callStore.webRTCHandler.socket.id,
            });
        }
    }}
    class={`btn text-2xl shadow-md ${callStore.inputs.microphone.enabled ? "btn-success" : "btn-outline"}`}
>
    {#if callStore.inputs.microphone.enabled}
        <MicOnIcon />
    {:else}
        <MicOffIcon />
    {/if}
</button>

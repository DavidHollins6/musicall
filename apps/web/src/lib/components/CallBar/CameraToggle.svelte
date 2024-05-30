<script lang="ts">
    import { getCallStore } from "$lib/store/local/call.svelte";
    import CameraIcon from "~icons/mdi/camera";
    import CameraOffIcon from "~icons/mdi/camera-off";

    const callStore = getCallStore();
</script>

<button
    on:click={async () => {
        if (callStore.localStream) {
            const newValue = !callStore.inputs.video.enabled;

            callStore.inputs.video.enabled = newValue;

            const videoTrack = callStore.localStream.getTracks().find((track) => track.kind === "video");

            if (videoTrack) {
                videoTrack.enabled = newValue;
            }

            Object.keys(callStore.peers).forEach((p) => {
                const peer = callStore.peers[p];
                peer.peerConnection.send(
                    JSON.stringify({
                        type: "call",
                        data: { video: newValue },
                        from: callStore.webRTCHandler.socket.id,
                    }),
                );
            });

            callStore.webRTCHandler.sendData({});
        }
    }}
    class={`btn text-2xl shadow-md  ${callStore.inputs.video.enabled ? "btn-success" : "btn-outline"}`}
>
    {#if callStore.inputs.video.enabled}
        <CameraIcon />
    {:else}
        <CameraOffIcon />
    {/if}
</button>

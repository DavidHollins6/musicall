<script lang="ts">
    import { getContext } from "svelte";
    import type { CallContext } from "./createCallState.svelte";

    const { peerId } = $props<{ peerId: string }>();

    let videoRef: HTMLVideoElement | undefined = $state();
    const callContext = getContext<CallContext>("call");

    $effect(() => {
        if (videoRef && callContext.peerConnection.otherStreams[peerId]) {
            console.log("setting a video!!", callContext.peerConnection.otherStreams[peerId]);
            videoRef.srcObject = callContext.peerConnection.otherStreams[peerId];
        }
    });
</script>

<video bind:this={videoRef} autoPlay playsInline>THEIR VIDEO</video>

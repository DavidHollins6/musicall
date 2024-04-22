<script lang="ts">
    import { getContext } from "svelte";
    import type { CallContext } from "./createCallState.svelte";

    let videoRef: HTMLVideoElement | undefined = $state();
    const callContext = getContext<CallContext>("call");

    $effect(() => {
        if (videoRef && callContext.peerConnection.localStream) {
            videoRef.srcObject = callContext.peerConnection.localStream;
        }
    });
</script>

<video bind:this={videoRef} autoPlay playsInline>YOUR VIDEO</video>

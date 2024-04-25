<script lang="ts">
    import { getCallStore } from "$lib/store/local/call.svelte";

    let videoRef: HTMLVideoElement | undefined = $state();
    const callStore = getCallStore();

    $effect(() => {
        if (videoRef && callStore.peerConnection.localStream) {
            videoRef.srcObject = callStore.peerConnection.localStream;
        }
    });
</script>

<!-- svelte-ignore a11y-media-has-caption -->
<video bind:this={videoRef} autoPlay playsInline></video>

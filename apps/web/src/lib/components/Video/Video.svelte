<script lang="ts">
    import { getCallStore } from "$lib/store/local/call.svelte";

    const { peerId }: { peerId: string } = $props();

    let videoRef: HTMLVideoElement | undefined = $state();
    const callStore = getCallStore();

    $effect(() => {
        if (videoRef && callStore.peerConnection.otherStreams[peerId]) {
            videoRef.srcObject = callStore.peerConnection.otherStreams[peerId];
        }
    });
</script>

<!-- svelte-ignore a11y-media-has-caption -->
<video bind:this={videoRef} autoPlay playsInline>THEIR VIDEO</video>

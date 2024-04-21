<script lang="ts">
    import { getContext } from "svelte";
    import type { CallContext } from "./createCallState.svelte";

    let yourVideo: HTMLVideoElement | undefined = $state();
    let theirVideo: HTMLVideoElement | undefined = $state();
    const callContext = getContext<CallContext>("call");

    $effect(() => {
        if (theirVideo && callContext.peerConnection.theirStream) {
            theirVideo.srcObject = callContext.peerConnection.theirStream;
        }
        if (yourVideo && callContext.peerConnection.yourStream) {
            yourVideo.srcObject = callContext.peerConnection.yourStream;
        }
        if (callContext.isVideoEnabled && yourVideo && callContext.peerConnection.yourStream) {
            yourVideo.srcObject = callContext.peerConnection.yourStream;
        } else if (yourVideo) {
            yourVideo.srcObject = null;
        }
    });
</script>

<div class="p-4 pb-0" style="height: calc(100% - 80px)">
    <div class="relative rounded-md h-full">
        <div class="bg-accent-content rounded-md absolute w-72 h-40 right-0 bottom-0 m-6 justify-center flex">
            <video muted class=" rounded-md object-contain" bind:this={yourVideo} autoPlay playsInline></video>
        </div>

        <video
            class="rounded-md bg-primary-content h-full w-full object-contain"
            bind:this={theirVideo}
            autoPlay
            playsInline
        ></video>
    </div>
</div>

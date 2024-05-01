<script lang="ts">
    import MicOffIcon from "~icons/mdi/microphone-off";

    const {
        stream,
        containerClass,
        avatarUrl,
        cameraEnabled,
        microphoneEnabled,
        connected,
    }: {
        stream?: MediaStream;
        containerClass: string;
        avatarUrl: string;
        cameraEnabled: boolean;
        microphoneEnabled: boolean;
        connected: boolean;
    } = $props();

    let videoRef: HTMLVideoElement | undefined = $state();

    $effect(() => {
        if (videoRef && stream) {
            videoRef.srcObject = stream;
        }
    });
</script>

<!-- svelte-ignore a11y-media-has-caption -->
<div class={`p-1 ${containerClass}`}>
    <div class="rounded-lg bg-secondary-content h-full relative shadow-lg">
        {#if cameraEnabled && connected}
            <!-- svelte-ignore invalid-self-closing-tag -->
            <video bind:this={videoRef} autoPlay playsInline class="max-h-full w-full h-full rounded" />
        {:else}
            <div class="flex justify-center items-center h-full">
                <div
                    style={`background-image: url(${avatarUrl})`}
                    class="bg-center bg-no-repeat bg-cover w-32 h-32 rounded-full shadow-lg"
                ></div>
                {#if !connected}
                    <div class="absolute right-6 bottom-6">...connecting</div>
                {/if}
            </div>
        {/if}
        {#if !microphoneEnabled && connected}
            <div class="absolute right-6 bottom-6 backdrop-opacity-10 backdrop-invert bg-black/60 rounded-lg p-4">
                <MicOffIcon class="text-error text-4xl" />
            </div>
        {/if}
        <div
            class="absolute left-6 bottom-6 backdrop-opacity-10 backdrop-invert bg-black/60 p-2 text-white rounded-lg text-sm"
        >
            Person's Name
        </div>
    </div>
</div>

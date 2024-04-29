<script lang="ts">
    import { getCallStore } from "$lib/store/local/call.svelte";
    import { faker } from "@faker-js/faker";
    import Video from "./Video.svelte";

    const { containerClass, peerId }: { containerClass: string; peerId: string } = $props();

    const callStore = getCallStore();

    const userAvatar = faker.image.avatar();

    const peer = callStore.webRTCHandler.getPeer(peerId);
</script>

{#if peer}
    <Video
        stream={peer.stream}
        avatarUrl={userAvatar}
        {containerClass}
        cameraEnabled={peer.cameraEnabled}
        microphoneEnabled={peer.microphoneEnabled}
        connected={peer.connected}
    />
{/if}

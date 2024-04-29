<script lang="ts">
    import { getCallStore } from "$lib/store/local/call.svelte";
    import { faker } from "@faker-js/faker";
    import Video from "./Video.svelte";

    const { containerClass }: { containerClass: string } = $props();

    const callStore = getCallStore();

    const userAvatar = faker.image.avatar();
</script>

<Video
    stream={callStore.webRTCHandler.localStream}
    avatarUrl={userAvatar}
    {containerClass}
    cameraEnabled={callStore.isVideoEnabled}
    microphoneEnabled={callStore.isMicrophoneEnabled}
    connected={true}
/>

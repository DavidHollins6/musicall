<script lang="ts">
    import MicOnIcon from "~icons/mdi/microphone";
    import MicOffIcon from "~icons/mdi/microphone-off";
    import MusicNoteIcon from "~icons/mdi/music-note";
    import MusicNoteOffIcon from "~icons/mdi/music-note-off";
    import CameraIcon from "~icons/mdi/camera";
    import CameraOffIcon from "~icons/mdi/camera-off";
    import { getCallStore } from "$lib/store/local/call.svelte";

    const { peerId }: { peerId: string } = $props();

    const callStore = getCallStore();

    const peer = callStore.webRTCHandler.peers[peerId];
    const isYou = callStore.webRTCHandler.socket.id === peerId;
</script>

<div class="flex border-neutral-content border-solid shadow-lg rounded-md p-2 items-center justify-between">
    <div class="flex items-center">
        <div class="avatar">
            <div class="w-8 h-8 rounded-full">
                <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" alt="" />
            </div>
        </div>
        <div class="ml-4">
            {#if isYou}
                <b>You</b>
            {:else}
                Person's Name
            {/if}
        </div>
    </div>

    <div class="flex justify-self-end">
        {#if isYou ? callStore.isMicrophoneEnabled : peer.microphoneEnabled}
            <MicOnIcon />
        {:else}
            <MicOffIcon />
        {/if}
        <!-- {#if peer.isMidiEnabled}
            <MusicNoteIcon />
        {:else}
            <MusicNoteOffIcon />
        {/if} -->
        {#if isYou ? callStore.isVideoEnabled : peer.microphoneEnabled}
            <CameraIcon />
        {:else}
            <CameraOffIcon />
        {/if}
    </div>
</div>
